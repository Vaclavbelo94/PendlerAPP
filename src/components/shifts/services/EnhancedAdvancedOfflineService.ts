import { Shift, ShiftType } from '../types';
import { ConflictData, ConflictResolution, advancedConflictResolver } from '@/components/conflicts/ConflictResolutionService';
import { ShiftOfflineService } from './ShiftOfflineService';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';

export interface SyncResult {
  synced: number;
  conflicts: number;
  errors: number;
  autoResolved: number;
  manualRequired: number;
}

export class EnhancedAdvancedOfflineService extends ShiftOfflineService {
  private static enhancedInstance: EnhancedAdvancedOfflineService;

  static getInstance(): EnhancedAdvancedOfflineService {
    if (!EnhancedAdvancedOfflineService.enhancedInstance) {
      EnhancedAdvancedOfflineService.enhancedInstance = new EnhancedAdvancedOfflineService();
    }
    return EnhancedAdvancedOfflineService.enhancedInstance;
  }

  async syncWithAdvancedConflictResolution(userId: string): Promise<SyncResult> {
    try {
      const [localShifts, remoteShifts] = await Promise.all([
        this.getLocalShifts(userId),
        this.getRemoteShifts(userId)
      ]);

      // Use the new advanced conflict detection
      const conflicts = await advancedConflictResolver.detectShiftConflicts(localShifts, remoteShifts);
      
      let autoResolved = 0;
      let manualRequired = 0;
      const unresolvedConflicts: ConflictData[] = [];

      // Attempt automatic resolution
      for (const conflict of conflicts) {
        try {
          const resolution = await advancedConflictResolver.resolveConflictAutomatically(conflict);
          
          if (resolution.action !== 'manual') {
            await this.applyResolution(conflict, resolution, userId);
            autoResolved++;
            
            // Record the resolution for analytics
            advancedConflictResolver.recordResolution(resolution, 0); // 0 for automatic
          } else {
            unresolvedConflicts.push(conflict);
            manualRequired++;
          }
        } catch (error) {
          errorHandler.handleError(error, { operation: 'autoResolveConflict', conflictId: conflict.id });
          unresolvedConflicts.push(conflict);
          manualRequired++;
        }
      }

      // Sync non-conflicting changes
      const syncResult = await this.syncNonConflictingChanges(localShifts, remoteShifts, userId, conflicts);
      
      return {
        synced: syncResult.synced,
        conflicts: conflicts.length,
        errors: syncResult.errors,
        autoResolved,
        manualRequired
      };
    } catch (error) {
      errorHandler.handleError(error, { operation: 'syncWithAdvancedConflictResolution' });
      return { synced: 0, conflicts: 0, errors: 1, autoResolved: 0, manualRequired: 0 };
    }
  }

  private async applyResolution(
    conflict: ConflictData,
    resolution: ConflictResolution,
    userId: string
  ): Promise<void> {
    let resolvedItem: Shift;

    switch (resolution.action) {
      case 'keep_local':
        resolvedItem = conflict.localItem;
        await this.updateRemoteShift(resolvedItem);
        break;
        
      case 'keep_remote':
        resolvedItem = conflict.remoteItem;
        await this.updateLocalShift(resolvedItem, userId);
        break;
        
      case 'merge':
        if (resolution.resolvedItem) {
          resolvedItem = resolution.resolvedItem;
          await this.updateBothShifts(resolvedItem, userId);
        } else {
          // Perform merge based on selected fields
          resolvedItem = await this.performAdvancedMerge(conflict, resolution);
          await this.updateBothShifts(resolvedItem, userId);
        }
        break;
        
      case 'create_duplicate':
        await this.createDuplicateShift(conflict.localItem, userId);
        await this.updateLocalShift(conflict.remoteItem, userId);
        break;
    }
  }

  private async performAdvancedMerge(
    conflict: ConflictData,
    resolution: ConflictResolution
  ): Promise<Shift> {
    const merged: Shift = { ...conflict.localItem };
    
    if (resolution.selectedFields) {
      for (const [field, choice] of Object.entries(resolution.selectedFields)) {
        switch (choice) {
          case 'remote':
            (merged as any)[field] = conflict.remoteItem[field];
            break;
          case 'merged':
            // Intelligent merge for text fields
            if (field === 'notes' && typeof conflict.localItem[field] === 'string' && typeof conflict.remoteItem[field] === 'string') {
              (merged as any)[field] = this.mergeTextFields(conflict.localItem[field], conflict.remoteItem[field]);
            } else {
              (merged as any)[field] = conflict.localItem[field]; // Fallback to local
            }
            break;
          case 'local':
          default:
            // Keep local value (already in merged object)
            break;
        }
      }
    }
    
    merged.updated_at = new Date().toISOString();
    return merged;
  }

  private mergeTextFields(local: string, remote: string): string {
    if (local === remote) return local;
    
    // Check if one contains the other
    if (local.includes(remote)) return local;
    if (remote.includes(local)) return remote;
    
    // Combine with clear separation
    return `${local}\n\n[Sloučeno se vzdálenou verzí]:\n${remote}`;
  }

  private async getLocalShifts(userId: string): Promise<Shift[]> {
    try {
      const localData = localStorage.getItem(`shifts_${userId}`);
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      errorHandler.handleError(error, { operation: 'getLocalShifts' });
      return [];
    }
  }

  private async getRemoteShifts(userId: string): Promise<Shift[]> {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(shift => ({
        id: shift.id,
        userId: shift.user_id,
        user_id: shift.user_id,
        date: shift.date,
        type: shift.type as ShiftType,
        notes: shift.notes || '',
        created_at: shift.created_at,
        updated_at: shift.updated_at
      })) || [];
    } catch (error) {
      errorHandler.handleError(error, { operation: 'getRemoteShifts' });
      return [];
    }
  }

  private async syncNonConflictingChanges(
    localShifts: Shift[], 
    remoteShifts: Shift[], 
    userId: string,
    conflicts: ConflictData[]
  ): Promise<{ synced: number; errors: number }> {
    let synced = 0;
    let errors = 0;

    const conflictedIds = new Set(conflicts.map(c => c.localItem.id));

    // Synchronize new local shifts (not in conflicts)
    const newLocalShifts = localShifts.filter(local => 
      !remoteShifts.some(remote => remote.id === local.id) && 
      !conflictedIds.has(local.id)
    );

    for (const shift of newLocalShifts) {
      try {
        await this.updateRemoteShift(shift);
        synced++;
      } catch (error) {
        errors++;
        errorHandler.handleError(error, { operation: 'syncNewLocalShift', shiftId: shift.id });
      }
    }

    // Synchronize new remote shifts (not in conflicts)
    const newRemoteShifts = remoteShifts.filter(remote => 
      !localShifts.some(local => local.id === remote.id) && 
      !conflictedIds.has(remote.id)
    );

    for (const shift of newRemoteShifts) {
      try {
        await this.updateLocalShift(shift, userId);
        synced++;
      } catch (error) {
        errors++;
        errorHandler.handleError(error, { operation: 'syncNewRemoteShift', shiftId: shift.id });
      }
    }

    return { synced, errors };
  }

  // Enhanced methods with better error handling and backup strategies
  private async updateRemoteShift(shift: Shift): Promise<void> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { error } = await supabase
          .from('shifts')
          .upsert({
            id: shift.id,
            user_id: shift.user_id,
            type: shift.type,
            notes: shift.notes,
            date: shift.date,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) throw error;
        return; // Success
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  private async updateLocalShift(shift: Shift, userId: string): Promise<void> {
    try {
      const localShifts = await this.getLocalShifts(userId);
      const updatedShifts = localShifts.map(s => 
        s.id === shift.id ? shift : s
      );
      
      // Add the shift if it doesn't exist locally
      if (!localShifts.some(s => s.id === shift.id)) {
        updatedShifts.push(shift);
      }
      
      localStorage.setItem(`shifts_${userId}`, JSON.stringify(updatedShifts));
    } catch (error) {
      errorHandler.handleError(error, { operation: 'updateLocalShift', shiftId: shift.id });
      throw error;
    }
  }

  private async updateBothShifts(shift: Shift, userId: string): Promise<void> {
    await Promise.all([
      this.updateRemoteShift(shift),
      this.updateLocalShift(shift, userId)
    ]);
  }

  private async createDuplicateShift(shift: Shift, userId: string): Promise<void> {
    const duplicateShift: Shift = {
      ...shift,
      id: `${shift.id}_duplicate_${Date.now()}`,
      notes: `${shift.notes || ''}\n\n[Duplikát kvůli konfliktu]`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.updateLocalShift(duplicateShift, userId);
  }

  // Method to get detailed sync statistics
  async getSyncStatistics(userId: string): Promise<{
    localCount: number;
    remoteCount: number;
    conflictsPending: number;
    lastSyncTime?: string;
  }> {
    try {
      const [localShifts, remoteShifts] = await Promise.all([
        this.getLocalShifts(userId),
        this.getRemoteShifts(userId)
      ]);

      const conflicts = await advancedConflictResolver.detectShiftConflicts(localShifts, remoteShifts);
      const lastSyncTime = localStorage.getItem(`lastSync_${userId}`);

      return {
        localCount: localShifts.length,
        remoteCount: remoteShifts.length,
        conflictsPending: conflicts.length,
        lastSyncTime: lastSyncTime || undefined
      };
    } catch (error) {
      errorHandler.handleError(error, { operation: 'getSyncStatistics' });
      return {
        localCount: 0,
        remoteCount: 0,
        conflictsPending: 0
      };
    }
  }
}

export const enhancedAdvancedOfflineService = EnhancedAdvancedOfflineService.getInstance();

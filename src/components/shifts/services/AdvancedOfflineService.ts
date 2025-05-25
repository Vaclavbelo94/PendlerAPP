import { Shift, ShiftType } from '../types';
import { ConflictResolutionService, ConflictData, ConflictResolution } from './ConflictResolutionService';
import { ShiftOfflineService } from './ShiftOfflineService';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';

export class AdvancedOfflineService extends ShiftOfflineService {
  private static advancedInstance: AdvancedOfflineService;
  private conflictResolver = ConflictResolutionService.getInstance();

  static getInstance(): AdvancedOfflineService {
    if (!AdvancedOfflineService.advancedInstance) {
      AdvancedOfflineService.advancedInstance = new AdvancedOfflineService();
    }
    return AdvancedOfflineService.advancedInstance;
  }

  async syncWithConflictResolution(userId: string): Promise<{
    synced: number;
    conflicts: number;
    errors: number;
  }> {
    try {
      const [localShifts, remoteShifts] = await Promise.all([
        this.getLocalShifts(userId),
        this.getRemoteShifts(userId)
      ]);

      const conflicts = await this.conflictResolver.detectConflicts(localShifts, remoteShifts);
      
      if (conflicts.length > 0) {
        const resolutions = await this.conflictResolver.showConflictResolutionDialog(conflicts);
        await this.applyConflictResolutions(conflicts, resolutions, userId);
      }

      const syncResult = await this.syncNonConflictingChanges(localShifts, remoteShifts, userId);
      
      return {
        synced: syncResult.synced,
        conflicts: conflicts.length,
        errors: syncResult.errors
      };
    } catch (error) {
      errorHandler.handleError(error, { operation: 'syncWithConflictResolution' });
      return { synced: 0, conflicts: 0, errors: 1 };
    }
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
        date: new Date(shift.date),
        type: shift.type as ShiftType, // Cast to ShiftType
        notes: shift.notes || '',
        created_at: shift.created_at,
        updated_at: shift.updated_at
      })) || [];
    } catch (error) {
      errorHandler.handleError(error, { operation: 'getRemoteShifts' });
      return [];
    }
  }

  private async applyConflictResolutions(
    conflicts: ConflictData[], 
    resolutions: ConflictResolution[],
    userId: string
  ): Promise<void> {
    for (let i = 0; i < conflicts.length; i++) {
      const conflict = conflicts[i];
      const resolution = resolutions[i];
      
      try {
        switch (resolution.action) {
          case 'keep_local':
            await this.updateRemoteShift(conflict.localShift);
            break;
          case 'keep_remote':
            await this.updateLocalShift(conflict.remoteShift, userId);
            break;
          case 'merge':
            if (resolution.resolvedShift) {
              await this.updateBothShifts(resolution.resolvedShift, userId);
            }
            break;
          case 'create_duplicate':
            await this.createDuplicateShift(conflict.localShift, userId);
            break;
        }
      } catch (error) {
        errorHandler.handleError(error, { 
          operation: 'applyConflictResolution',
          conflictId: conflict.localShift.id,
          action: resolution.action
        });
      }
    }
  }

  private async updateRemoteShift(shift: Shift): Promise<void> {
    const { error } = await supabase
      .from('shifts')
      .update({
        type: shift.type,
        notes: shift.notes,
        date: shift.date.toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', shift.id);

    if (error) throw error;
  }

  private async updateLocalShift(shift: Shift, userId: string): Promise<void> {
    const localShifts = await this.getLocalShifts(userId);
    const updatedShifts = localShifts.map(s => 
      s.id === shift.id ? shift : s
    );
    
    localStorage.setItem(`shifts_${userId}`, JSON.stringify(updatedShifts));
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
      notes: `${shift.notes}\n\n[Duplikát kvůli konfliktu]`
    };

    await this.updateLocalShift(duplicateShift, userId);
  }

  private async syncNonConflictingChanges(
    localShifts: Shift[], 
    remoteShifts: Shift[], 
    userId: string
  ): Promise<{ synced: number; errors: number }> {
    let synced = 0;
    let errors = 0;

    // Synchronizace nových lokálních směn
    const newLocalShifts = localShifts.filter(local => 
      !remoteShifts.some(remote => remote.id === local.id)
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

    // Synchronizace nových vzdálených směn
    const newRemoteShifts = remoteShifts.filter(remote => 
      !localShifts.some(local => local.id === remote.id)
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

  cleanup() {
    // Clean up any resources
    this.conflictResolver = ConflictResolutionService.getInstance();
  }
}

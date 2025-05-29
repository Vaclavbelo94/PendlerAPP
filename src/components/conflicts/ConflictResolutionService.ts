
import { notificationService } from '@/components/shifts/services/NotificationService';

export interface ConflictData {
  id: string;
  localItem: any;
  remoteItem: any;
  conflictType: 'concurrent_edit' | 'delete_edit' | 'version_mismatch' | 'field_level';
  entityType: 'shifts' | 'vocabulary' | 'vehicles' | 'calculations' | 'settings';
  conflictedFields?: string[];
  timestamp: string;
  metadata?: any;
}

export interface ConflictResolution {
  action: 'keep_local' | 'keep_remote' | 'merge' | 'create_duplicate' | 'manual';
  resolvedItem?: any;
  mergeStrategy?: 'automatic' | 'field_level' | 'semantic' | 'three_way';
  selectedFields?: Record<string, 'local' | 'remote' | 'merged'>;
}

export interface ConflictAnalytics {
  totalConflicts: number;
  resolvedAutomatically: number;
  resolvedManually: number;
  conflictsByType: Record<string, number>;
  avgResolutionTime: number;
  userPreferences: Record<string, number>;
}

export class AdvancedConflictResolutionService {
  private static instance: AdvancedConflictResolutionService;
  private analytics: ConflictAnalytics = {
    totalConflicts: 0,
    resolvedAutomatically: 0,
    resolvedManually: 0,
    conflictsByType: {},
    avgResolutionTime: 0,
    userPreferences: {}
  };

  static getInstance(): AdvancedConflictResolutionService {
    if (!AdvancedConflictResolutionService.instance) {
      AdvancedConflictResolutionService.instance = new AdvancedConflictResolutionService();
    }
    return AdvancedConflictResolutionService.instance;
  }

  async detectConflicts(localItems: any[], remoteItems: any[], entityType: string): Promise<ConflictData[]> {
    const conflicts: ConflictData[] = [];
    
    for (const localItem of localItems) {
      const remoteItem = remoteItems.find(r => r.id === localItem.id);
      
      if (remoteItem) {
        const conflictData = this.analyzeConflict(localItem, remoteItem, entityType);
        if (conflictData) {
          conflicts.push(conflictData);
        }
      }
    }
    
    this.analytics.totalConflicts += conflicts.length;
    this.updateConflictsByType(conflicts);
    
    return conflicts;
  }

  private analyzeConflict(local: any, remote: any, entityType: string): ConflictData | null {
    const localTime = new Date(local.updated_at || local.created_at || Date.now()).getTime();
    const remoteTime = new Date(remote.updated_at || remote.created_at || Date.now()).getTime();
    
    // Field-level conflict detection
    const conflictedFields = this.detectFieldConflicts(local, remote);
    
    if (conflictedFields.length > 0) {
      const timeDiff = Math.abs(localTime - remoteTime);
      
      let conflictType: ConflictData['conflictType'] = 'field_level';
      
      if (timeDiff < 300000) { // 5 minutes
        conflictType = 'concurrent_edit';
      } else if (timeDiff > 3600000) { // 1 hour
        conflictType = 'version_mismatch';
      }
      
      return {
        id: `${entityType}_${local.id}_${Date.now()}`,
        localItem: local,
        remoteItem: remote,
        conflictType,
        entityType: entityType as any,
        conflictedFields,
        timestamp: new Date().toISOString(),
        metadata: {
          localTime,
          remoteTime,
          timeDiff
        }
      };
    }
    
    return null;
  }

  private detectFieldConflicts(local: any, remote: any): string[] {
    const conflictedFields: string[] = [];
    const excludeFields = ['id', 'created_at', 'updated_at', 'user_id'];
    
    for (const field in local) {
      if (excludeFields.includes(field)) continue;
      
      if (local[field] !== remote[field]) {
        conflictedFields.push(field);
      }
    }
    
    return conflictedFields;
  }

  async resolveConflictAutomatically(conflict: ConflictData): Promise<ConflictResolution> {
    const { localItem, remoteItem, conflictType, conflictedFields } = conflict;
    
    switch (conflictType) {
      case 'concurrent_edit':
        return this.performIntelligentMerge(localItem, remoteItem, conflictedFields || []);
        
      case 'version_mismatch':
        const localTime = new Date(localItem.updated_at || localItem.created_at || Date.now()).getTime();
        const remoteTime = new Date(remoteItem.updated_at || remoteItem.created_at || Date.now()).getTime();
        
        return {
          action: localTime > remoteTime ? 'keep_local' : 'keep_remote',
          mergeStrategy: 'automatic'
        };
        
      case 'field_level':
        return this.performFieldLevelMerge(localItem, remoteItem, conflictedFields || []);
        
      default:
        return { action: 'manual', mergeStrategy: 'field_level' };
    }
  }

  private performIntelligentMerge(local: any, remote: any, conflictedFields: string[]): ConflictResolution {
    const mergedItem = { ...local };
    const selectedFields: Record<string, 'local' | 'remote' | 'merged'> = {};
    
    for (const field of conflictedFields) {
      // Intelligent merge strategies
      if (this.isTextField(field)) {
        if (local[field] && remote[field]) {
          mergedItem[field] = this.mergeTextFields(local[field], remote[field]);
          selectedFields[field] = 'merged';
        } else {
          mergedItem[field] = local[field] || remote[field];
          selectedFields[field] = local[field] ? 'local' : 'remote';
        }
      } else if (this.isNumericField(field)) {
        // For numeric fields, take the higher value or local if same
        mergedItem[field] = Math.max(Number(local[field] || 0), Number(remote[field] || 0));
        selectedFields[field] = 'merged';
      } else {
        // Default to local for other fields
        mergedItem[field] = local[field];
        selectedFields[field] = 'local';
      }
    }
    
    return {
      action: 'merge',
      resolvedItem: mergedItem,
      mergeStrategy: 'semantic',
      selectedFields
    };
  }

  private performFieldLevelMerge(local: any, remote: any, conflictedFields: string[]): ConflictResolution {
    // For field-level conflicts, we'll return the data for manual resolution
    return {
      action: 'manual',
      mergeStrategy: 'field_level',
      selectedFields: conflictedFields.reduce((acc, field) => {
        acc[field] = 'local'; // Default preference
        return acc;
      }, {} as Record<string, 'local' | 'remote' | 'merged'>)
    };
  }

  private mergeTextFields(local: string, remote: string): string {
    if (local === remote) return local;
    
    // Simple merge strategy: combine if different
    if (local.length > remote.length) {
      return local.includes(remote) ? local : `${local}\n\n[Vzdálená verze]: ${remote}`;
    } else {
      return remote.includes(local) ? remote : `${remote}\n\n[Lokální verze]: ${local}`;
    }
  }

  private isTextField(field: string): boolean {
    const textFields = ['notes', 'description', 'message', 'content', 'bio'];
    return textFields.some(tf => field.toLowerCase().includes(tf));
  }

  private isNumericField(field: string): boolean {
    const numericFields = ['count', 'score', 'amount', 'price', 'cost', 'value'];
    return numericFields.some(nf => field.toLowerCase().includes(nf));
  }

  private updateConflictsByType(conflicts: ConflictData[]): void {
    for (const conflict of conflicts) {
      const key = `${conflict.entityType}_${conflict.conflictType}`;
      this.analytics.conflictsByType[key] = (this.analytics.conflictsByType[key] || 0) + 1;
    }
  }

  recordResolution(resolution: ConflictResolution, resolutionTime: number): void {
    if (resolution.action === 'manual') {
      this.analytics.resolvedManually++;
    } else {
      this.analytics.resolvedAutomatically++;
    }
    
    // Update average resolution time
    const total = this.analytics.resolvedAutomatically + this.analytics.resolvedManually;
    this.analytics.avgResolutionTime = 
      (this.analytics.avgResolutionTime * (total - 1) + resolutionTime) / total;
  }

  getAnalytics(): ConflictAnalytics {
    return { ...this.analytics };
  }

  // Entity-specific conflict detection methods
  async detectShiftConflicts(localShifts: any[], remoteShifts: any[]): Promise<ConflictData[]> {
    return this.detectConflicts(localShifts, remoteShifts, 'shifts');
  }

  async detectVocabularyConflicts(localItems: any[], remoteItems: any[]): Promise<ConflictData[]> {
    return this.detectConflicts(localItems, remoteItems, 'vocabulary');
  }

  async detectVehicleConflicts(localVehicles: any[], remoteVehicles: any[]): Promise<ConflictData[]> {
    return this.detectConflicts(localVehicles, remoteVehicles, 'vehicles');
  }
}

export const advancedConflictResolver = AdvancedConflictResolutionService.getInstance();


import { Shift } from '../types';
import { notificationService } from './NotificationService';

export interface ConflictData {
  localShift: Shift;
  remoteShift: Shift;
  conflictType: 'concurrent_edit' | 'delete_edit' | 'version_mismatch';
}

export interface ConflictResolution {
  action: 'keep_local' | 'keep_remote' | 'merge' | 'create_duplicate';
  resolvedShift?: Shift;
}

export class ConflictResolutionService {
  private static instance: ConflictResolutionService;

  static getInstance(): ConflictResolutionService {
    if (!ConflictResolutionService.instance) {
      ConflictResolutionService.instance = new ConflictResolutionService();
    }
    return ConflictResolutionService.instance;
  }

  async detectConflicts(localShifts: Shift[], remoteShifts: Shift[]): Promise<ConflictData[]> {
    const conflicts: ConflictData[] = [];
    
    for (const localShift of localShifts) {
      const remoteShift = remoteShifts.find(r => r.id === localShift.id);
      
      if (remoteShift) {
        const conflictType = this.determineConflictType(localShift, remoteShift);
        if (conflictType) {
          conflicts.push({
            localShift,
            remoteShift,
            conflictType
          });
        }
      }
    }
    
    return conflicts;
  }

  private determineConflictType(local: Shift, remote: Shift): ConflictData['conflictType'] | null {
    const localTime = new Date(local.updated_at || local.created_at).getTime();
    const remoteTime = new Date(remote.updated_at || remote.created_at).getTime();
    
    // Pokud se liší obsah a byly upraveny zhruba ve stejnou dobu (±5 minut)
    if (Math.abs(localTime - remoteTime) < 300000) {
      if (this.hasContentDifferences(local, remote)) {
        return 'concurrent_edit';
      }
    }
    
    // Pokud se liší časové razítko více než 5 minut
    if (Math.abs(localTime - remoteTime) > 300000) {
      return 'version_mismatch';
    }
    
    return null;
  }

  private hasContentDifferences(local: Shift, remote: Shift): boolean {
    return (
      local.type !== remote.type ||
      local.notes !== remote.notes ||
      local.date.getTime() !== remote.date.getTime()
    );
  }

  async resolveConflictAutomatically(conflict: ConflictData): Promise<ConflictResolution> {
    const { localShift, remoteShift, conflictType } = conflict;
    
    switch (conflictType) {
      case 'concurrent_edit':
        // Pro souběžné úpravy použijeme automatické sloučení
        return this.mergeShifts(localShift, remoteShift);
        
      case 'version_mismatch':
        // Pro verze mismatch preferujeme novější verzi
        const localTime = new Date(localShift.updated_at || localShift.created_at).getTime();
        const remoteTime = new Date(remoteShift.updated_at || remoteShift.created_at).getTime();
        
        return {
          action: localTime > remoteTime ? 'keep_local' : 'keep_remote'
        };
        
      default:
        return { action: 'keep_local' };
    }
  }

  private mergeShifts(local: Shift, remote: Shift): ConflictResolution {
    // Inteligentní sloučení - preferujeme neprázdné hodnoty
    const mergedShift: Shift = {
      ...local,
      type: local.type || remote.type,
      notes: this.mergeNotes(local.notes, remote.notes),
      updated_at: new Date().toISOString()
    };
    
    return {
      action: 'merge',
      resolvedShift: mergedShift
    };
  }

  private mergeNotes(localNotes: string, remoteNotes: string): string {
    if (!localNotes && !remoteNotes) return '';
    if (!localNotes) return remoteNotes;
    if (!remoteNotes) return localNotes;
    if (localNotes === remoteNotes) return localNotes;
    
    // Pokud se poznámky liší, spojíme je
    return `${localNotes}\n\n[Vzdálená poznámka]: ${remoteNotes}`;
  }

  async showConflictResolutionDialog(conflicts: ConflictData[]): Promise<ConflictResolution[]> {
    // V reálné implementaci by zde bylo UI pro ruční řešení konfliktů
    notificationService.showGenericError(
      `Nalezeno ${conflicts.length} konfliktů při synchronizaci. Použije se automatické řešení.`
    );
    
    const resolutions: ConflictResolution[] = [];
    for (const conflict of conflicts) {
      const resolution = await this.resolveConflictAutomatically(conflict);
      resolutions.push(resolution);
    }
    
    return resolutions;
  }
}

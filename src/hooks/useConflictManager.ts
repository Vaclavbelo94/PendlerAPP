import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { ConflictData, ConflictResolution, advancedConflictResolver } from '@/components/conflicts/ConflictResolutionService';
import { supabase } from '@/integrations/supabase/client';

export const useConflictManager = () => {
  const { user } = useAuth();
  const { success, error: showError } = useStandardizedToast();
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [isResolvingConflicts, setIsResolvingConflicts] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const detectAndShowConflicts = useCallback(async (
    localData: any[],
    remoteData: any[],
    entityType: string
  ) => {
    try {
      const detectedConflicts = await advancedConflictResolver.detectConflicts(
        localData,
        remoteData,
        entityType
      );

      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setShowConflictDialog(true);
        return true; // Has conflicts
      }

      return false; // No conflicts
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      showError('Chyba', 'Nepodařilo se detekovat konflikty');
      return false;
    }
  }, [showError]);

  const resolveConflicts = useCallback(async (
    resolutions: Map<string, ConflictResolution>
  ): Promise<void> => {
    if (!user) return;

    setIsResolvingConflicts(true);
    
    try {
      const resolvedItems: any[] = [];
      
      for (const [conflictId, resolution] of resolutions.entries()) {
        const conflict = conflicts.find(c => c.id === conflictId);
        if (!conflict) continue;

        let resolvedItem: any;

        switch (resolution.action) {
          case 'keep_local':
            resolvedItem = conflict.localItem;
            break;
          case 'keep_remote':
            resolvedItem = conflict.remoteItem;
            break;
          case 'merge':
            resolvedItem = await performMerge(conflict, resolution);
            break;
          case 'create_duplicate':
            // Create duplicate with suffix
            const duplicateItem = {
              ...conflict.localItem,
              id: `${conflict.localItem.id}_duplicate_${Date.now()}`,
              notes: `${conflict.localItem.notes || ''}\n\n[Duplikát kvůli konfliktu]`
            };
            resolvedItems.push(duplicateItem);
            resolvedItem = conflict.remoteItem;
            break;
          default:
            resolvedItem = conflict.localItem;
        }

        resolvedItems.push(resolvedItem);
      }

      // Apply resolutions to database
      await applyResolutionsToDatabase(resolvedItems, conflicts[0]?.entityType);
      
      success('Konflikty vyřešeny', `Úspěšně vyřešeno ${resolutions.size} konfliktů`);
      setShowConflictDialog(false);
      setConflicts([]);
      
    } catch (error) {
      console.error('Error resolving conflicts:', error);
      showError('Chyba při řešení', 'Nepodařilo se vyřešit konflikty');
    } finally {
      setIsResolvingConflicts(false);
    }
  }, [user, conflicts, success, showError]);

  const performMerge = async (
    conflict: ConflictData, 
    resolution: ConflictResolution
  ): Promise<any> => {
    const merged = { ...conflict.localItem };
    
    if (resolution.selectedFields) {
      for (const [field, choice] of Object.entries(resolution.selectedFields)) {
        switch (choice) {
          case 'remote':
            merged[field] = conflict.remoteItem[field];
            break;
          case 'merged':
            if (typeof conflict.localItem[field] === 'string' && 
                typeof conflict.remoteItem[field] === 'string') {
              merged[field] = `${conflict.localItem[field]}\n\n[Sloučeno]: ${conflict.remoteItem[field]}`;
            } else {
              merged[field] = conflict.localItem[field];
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
  };

  const applyResolutionsToDatabase = async (
    resolvedItems: any[],
    entityType: string
  ): Promise<void> => {
    if (!user) return;

    const updates = resolvedItems.map(item => ({
      ...item,
      user_id: user.id
    }));

    let tableName: string;
    switch (entityType) {
      case 'shifts':
        tableName = 'shifts';
        break;
      case 'vehicles':
        tableName = 'vehicles';
        break;
      case 'calculations':
        tableName = 'calculation_history';
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }

    // Use upsert to handle both inserts and updates
    const { error } = await supabase
      .from(tableName)
      .upsert(updates, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (error) throw error;
  };

  const closeConflictDialog = useCallback(() => {
    setShowConflictDialog(false);
    setConflicts([]);
  }, []);

  // Auto-resolve simple conflicts
  const autoResolveSimpleConflicts = useCallback(async (
    localData: any[],
    remoteData: any[],
    entityType: string
  ): Promise<{ resolved: any[], unresolved: ConflictData[] }> => {
    const detectedConflicts = await advancedConflictResolver.detectConflicts(
      localData,
      remoteData,
      entityType
    );

    const resolved: any[] = [];
    const unresolved: ConflictData[] = [];

    for (const conflict of detectedConflicts) {
      try {
        const resolution = await advancedConflictResolver.resolveConflictAutomatically(conflict);
        
        if (resolution.action !== 'manual') {
          let resolvedItem: any;
          
          switch (resolution.action) {
            case 'keep_local':
              resolvedItem = conflict.localItem;
              break;
            case 'keep_remote':
              resolvedItem = conflict.remoteItem;
              break;
            case 'merge':
              resolvedItem = await performMerge(conflict, resolution);
              break;
            default:
              unresolved.push(conflict);
              continue;
          }
          
          resolved.push(resolvedItem);
        } else {
          unresolved.push(conflict);
        }
      } catch (error) {
        console.error('Auto-resolve failed for conflict:', conflict.id, error);
        unresolved.push(conflict);
      }
    }

    return { resolved, unresolved };
  }, []);

  return {
    conflicts,
    showConflictDialog,
    isResolvingConflicts,
    detectAndShowConflicts,
    resolveConflicts,
    closeConflictDialog,
    autoResolveSimpleConflicts
  };
};

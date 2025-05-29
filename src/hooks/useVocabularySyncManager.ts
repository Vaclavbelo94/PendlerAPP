
import { useState, useEffect, useCallback } from 'react';
import { crossDeviceSyncService } from '@/services/CrossDeviceSyncService';
import { smartLanguagePackService } from '@/services/SmartLanguagePackService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { VocabularyItem } from '@/models/VocabularyItem';

export const useVocabularySyncManager = (
  vocabularyItems: VocabularyItem[],
  bulkAddVocabularyItems: (items: VocabularyItem[]) => void,
  testHistory: any[]
) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncStats, setSyncStats] = useState({ synced: 0, conflicts: 0 });
  const { success, error: showError, info } = useStandardizedToast();

  // Manual sync function
  const manualSync = useCallback(async () => {
    if (isSyncing) {
      info('Synchronizace probíhá', 'Počkejte na dokončení aktuální synchronizace');
      return;
    }

    setIsSyncing(true);
    try {
      console.log('Starting vocabulary sync with', vocabularyItems.length, 'items');
      
      // Track pack usage
      await smartLanguagePackService.trackPackUsage('vocabulary', Date.now());
      
      // Sync vocabulary items
      const syncResult = await crossDeviceSyncService.syncWithConflictResolution(
        vocabularyItems,
        'vocabulary_items'
      );
      
      setSyncStats(syncResult);
      setLastSynced(new Date());
      
      if (syncResult.conflicts > 0) {
        info(
          'Synchronizace dokončena s konflikty', 
          `Synchronizováno: ${syncResult.synced}, Konflikty vyřešeny: ${syncResult.conflicts}`
        );
      } else {
        success(
          'Slovník synchronizován', 
          `Úspěšně synchronizováno ${syncResult.synced} položek`
        );
      }
      
      console.log('Vocabulary sync completed:', syncResult);
    } catch (error) {
      console.error('Vocabulary sync failed:', error);
      showError('Chyba synchronizace', 'Nepodařilo se synchronizovat slovník');
    } finally {
      setIsSyncing(false);
    }
  }, [vocabularyItems, success, showError, info, isSyncing]);

  // Auto-sync on vocabulary changes
  useEffect(() => {
    if (vocabularyItems.length === 0) return;

    const autoSyncTimer = setTimeout(async () => {
      if (!isSyncing) {
        try {
          // Broadcast vocabulary changes
          await crossDeviceSyncService.broadcastSyncEvent(
            'vocabulary_items',
            'bulk_update',
            'update',
            { 
              count: vocabularyItems.length,
              timestamp: new Date(),
              items: vocabularyItems.slice(-5) // Send last 5 items as sample
            }
          );
        } catch (error) {
          console.error('Failed to broadcast vocabulary changes:', error);
        }
      }
    }, 2000);

    return () => clearTimeout(autoSyncTimer);
  }, [vocabularyItems, isSyncing]);

  // Listen for remote vocabulary updates
  useEffect(() => {
    const handleRemoteVocabularyUpdate = (event: CustomEvent) => {
      const { action, data } = event.detail;
      
      if (action === 'update' && data.items) {
        console.log('Received remote vocabulary update:', data);
        
        // Add new items from remote device
        const newItems = data.items.filter((remoteItem: VocabularyItem) => 
          !vocabularyItems.some(localItem => localItem.id === remoteItem.id)
        );
        
        if (newItems.length > 0) {
          bulkAddVocabularyItems(newItems);
          info(
            'Slovník aktualizován', 
            `Přidáno ${newItems.length} nových položek z jiného zařízení`
          );
        }
      }
    };

    window.addEventListener('vocabulary_items-updated', handleRemoteVocabularyUpdate as EventListener);
    
    return () => {
      window.removeEventListener('vocabulary_items-updated', handleRemoteVocabularyUpdate as EventListener);
    };
  }, [vocabularyItems, bulkAddVocabularyItems, info]);

  // Conflict resolver for vocabulary items
  useEffect(() => {
    crossDeviceSyncService.registerConflictResolver('vocabulary_items', (conflicts) => {
      // For vocabulary items, prefer the item with more data (longer text)
      return conflicts.reduce((best, current) => {
        const bestLength = (best.data.german?.length || 0) + (best.data.czech?.length || 0);
        const currentLength = (current.data.german?.length || 0) + (current.data.czech?.length || 0);
        return currentLength > bestLength ? current : best;
      }).data;
    });
  }, []);

  // Track test history changes for analytics
  useEffect(() => {
    if (testHistory.length > 0) {
      const analyticsData = {
        totalTests: testHistory.length,
        recentTests: testHistory.slice(-10),
        accuracy: testHistory.length > 0 ? 
          testHistory.filter(t => t.correct).length / testHistory.length : 0
      };
      
      // Store for analytics
      localStorage.setItem('vocabulary_analytics', JSON.stringify(analyticsData));
    }
  }, [testHistory]);

  return {
    isSyncing,
    lastSynced,
    syncStats,
    manualSync
  };
};

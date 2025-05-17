
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { toast } from '@/components/ui/use-toast';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveData, getAllData, clearStore, bulkSaveData } from '@/utils/offlineStorage';
import { validateVocabularyItems } from '@/utils/vocabularyValidation';

// Constants
const VOCABULARY_OFFLINE_KEY = 'vocabulary_offline_data';
const VOCABULARY_INDEXED_DB_STORE = 'vocabulary';
const TEST_HISTORY_KEY = 'vocabulary_test_history';

export const useVocabularySyncManager = (
  items: VocabularyItem[],
  bulkAddVocabularyItems: (items: VocabularyItem[]) => void,
  testHistory: any[]
) => {
  const { isOffline, lastOnlineAt } = useOfflineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Initialize last synced timestamp from localStorage
  useEffect(() => {
    const storedLastSynced = localStorage.getItem('vocabulary_last_synced');
    if (storedLastSynced) {
      setLastSynced(new Date(storedLastSynced));
    }
  }, []);

  // When going offline, save the current vocabulary items to localStorage and IndexedDB
  useEffect(() => {
    if (isOffline && items.length > 0) {
      try {
        setIsSyncing(true);
        
        // Save to localStorage as backup
        localStorage.setItem(VOCABULARY_OFFLINE_KEY, JSON.stringify(items));
        
        // Save to IndexedDB for better storage
        if ('indexedDB' in window) {
          // Use bulk save for better performance and transaction handling
          bulkSaveData(VOCABULARY_INDEXED_DB_STORE, items)
            .then(() => {
              console.log('All vocabulary items saved to IndexedDB:', items.length, 'items');
              
              // Update last synced timestamp
              const now = new Date();
              localStorage.setItem('vocabulary_last_synced', now.toISOString());
              setLastSynced(now);
            })
            .catch(error => {
              console.error('Error bulk saving items to IndexedDB:', error);
              // Individual save fallback in case bulk fails
              items.forEach(item => {
                try {
                  saveData(VOCABULARY_INDEXED_DB_STORE, item)
                    .catch(error => console.error('Error saving item to IndexedDB:', error));
                } catch (err) {
                  console.error('Error processing item for IndexedDB storage:', err);
                }
              });
            })
            .finally(() => {
              setIsSyncing(false);
            });
        } else {
          setIsSyncing(false);
        }
        
        console.log('Vocabulary data saved for offline use:', items.length, 'items');
        
        // Also save test history
        if (testHistory.length > 0) {
          localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(testHistory));
        }
      } catch (error) {
        console.error('Error saving vocabulary for offline use:', error);
        setIsSyncing(false);
      }
    }
  }, [isOffline, items, testHistory]);

  // When coming back online, check for any offline data to restore
  useEffect(() => {
    if (!isOffline && lastOnlineAt) {
      const restoreFromLocalStorage = async () => {
        try {
          const offlineData = localStorage.getItem(VOCABULARY_OFFLINE_KEY);
          if (offlineData) {
            const parsedData = JSON.parse(offlineData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              // Only restore if there's actual data and we don't have the data already
              if (items.length === 0 || window.confirm('Chcete obnovit slovíčka uložená offline?')) {
                const validItems = validateVocabularyItems(parsedData);
                if (validItems.length > 0) {
                  bulkAddVocabularyItems(validItems);
                  toast({
                    title: 'Data obnovena',
                    description: `${validItems.length} slovíček bylo obnoveno z offline úložiště.`,
                  });
                  // Clear offline data after successful restore
                  localStorage.removeItem(VOCABULARY_OFFLINE_KEY);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error restoring from localStorage:', error);
        }
      };
      
      const restoreFromIndexedDB = async () => {
        if ('indexedDB' in window) {
          try {
            setIsSyncing(true);
            const offlineItems = await getAllData(VOCABULARY_INDEXED_DB_STORE);
            setIsSyncing(false);
            
            if (offlineItems && offlineItems.length > 0) {
              // Check if we need to restore (if we have no items or user confirms)
              if (items.length === 0 || window.confirm('Chcete obnovit slovíčka uložená v IndexedDB?')) {
                // Validate that items are valid VocabularyItems
                const validItems = validateVocabularyItems(offlineItems);
                if (validItems.length > 0) {
                  bulkAddVocabularyItems(validItems);
                  toast({
                    title: 'Data obnovena z IndexedDB',
                    description: `${validItems.length} slovíček bylo obnoveno z IndexedDB.`,
                  });
                  
                  // Update last synced timestamp
                  const now = new Date();
                  localStorage.setItem('vocabulary_last_synced', now.toISOString());
                  setLastSynced(now);
                  
                  // Clear IndexedDB after successful restore
                  await clearStore(VOCABULARY_INDEXED_DB_STORE);
                }
              }
            }
          } catch (error) {
            console.error('Error restoring from IndexedDB:', error);
            setIsSyncing(false);
            // If IndexedDB fails, fall back to localStorage
            restoreFromLocalStorage();
          }
        } else {
          // If IndexedDB is not supported, fall back to localStorage
          restoreFromLocalStorage();
        }
      };
      
      // First try IndexedDB, fall back to localStorage if needed
      restoreFromIndexedDB();
    }
  }, [isOffline, bulkAddVocabularyItems, items.length, lastOnlineAt]);

  // Manual sync function that can be called from UI
  const manualSync = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      
      if (isOffline) {
        // If we're offline, save current data to IndexedDB
        if ('indexedDB' in window && items.length > 0) {
          // Clear previous data
          await clearStore(VOCABULARY_INDEXED_DB_STORE);
          
          // Save current data
          await bulkSaveData(VOCABULARY_INDEXED_DB_STORE, items);
          
          // Update last synced time
          const now = new Date();
          localStorage.setItem('vocabulary_last_synced', now.toISOString());
          setLastSynced(now);
          
          toast({
            title: 'Data uložena',
            description: `${items.length} slovíček bylo uloženo pro offline použití.`,
          });
        }
      } else {
        // If we're online, try to restore data from IndexedDB
        const offlineItems = await getAllData(VOCABULARY_INDEXED_DB_STORE);
        if (offlineItems && offlineItems.length > 0) {
          const validItems = validateVocabularyItems(offlineItems);
          if (validItems.length > 0) {
            // Find items that don't exist in the current list
            const existingIds = new Set(items.map(item => item.id));
            const newItems = validItems.filter(item => !existingIds.has(item.id));
            
            if (newItems.length > 0) {
              bulkAddVocabularyItems(newItems);
              toast({
                title: 'Data synchronizována',
                description: `${newItems.length} nových slovíček bylo přidáno.`,
              });
            } else {
              toast({
                title: 'Synchronizace dokončena',
                description: 'Všechna data jsou již aktuální.',
              });
            }
            
            // Clear the offline storage after sync
            await clearStore(VOCABULARY_INDEXED_DB_STORE);
          }
        } else {
          toast({
            title: 'Synchronizace dokončena',
            description: 'Žádná offline data k synchronizaci.',
          });
        }
      }
    } catch (error) {
      console.error('Error during manual sync:', error);
      toast({
        title: 'Chyba synchronizace',
        description: 'Nepodařilo se synchronizovat data.',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    lastSynced,
    manualSync
  };
};


import React, { useEffect } from 'react';
import { VocabularyProvider, useVocabularyContext } from './VocabularyProvider';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { toast } from '@/components/ui/use-toast';
import { saveData, getAllData } from '@/utils/offlineStorage';
import { VocabularyItem } from '@/models/VocabularyItem';

interface VocabularyManagerProps {
  children: React.ReactNode;
}

// Offline storage key for vocabulary items
const VOCABULARY_OFFLINE_KEY = 'vocabulary_offline_data';
const VOCABULARY_INDEXED_DB_STORE = 'vocabulary';

// Function to validate if an object is a VocabularyItem
const isVocabularyItem = (item: unknown): item is VocabularyItem => {
  return (
    typeof item === 'object' && 
    item !== null &&
    'id' in item && 
    'word' in item && 
    'translation' in item && 
    'repetitionLevel' in item &&
    'correctCount' in item &&
    'incorrectCount' in item
  );
};

// Function to validate an array of vocabulary items
const validateVocabularyItems = (items: unknown[]): VocabularyItem[] => {
  return items.filter(isVocabularyItem);
};

const VocabularySync = ({ children }: { children: React.ReactNode }) => {
  const { items, bulkAddVocabularyItems, testHistory } = useVocabularyContext();
  const { isOffline } = useOfflineStatus();

  // When going offline, save the current vocabulary items to localStorage and IndexedDB
  useEffect(() => {
    if (isOffline && items.length > 0) {
      try {
        // Save to localStorage as backup
        localStorage.setItem(VOCABULARY_OFFLINE_KEY, JSON.stringify(items));
        
        // Save to IndexedDB for better storage
        if ('indexedDB' in window) {
          items.forEach(item => {
            try {
              saveData(VOCABULARY_INDEXED_DB_STORE, item)
                .catch(error => console.error('Error saving item to IndexedDB:', error));
            } catch (err) {
              console.error('Error processing item for IndexedDB storage:', err);
            }
          });
        }
        
        console.log('Vocabulary data saved for offline use:', items.length, 'items');
        
        // Also save test history
        if (testHistory.length > 0) {
          localStorage.setItem('vocabulary_test_history', JSON.stringify(testHistory));
        }
      } catch (error) {
        console.error('Error saving vocabulary for offline use:', error);
      }
    }
  }, [isOffline, items, testHistory]);

  // When coming back online, check for any offline data to restore
  useEffect(() => {
    if (!isOffline) {
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
            const offlineItems = await getAllData(VOCABULARY_INDEXED_DB_STORE);
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
                }
              }
            }
          } catch (error) {
            console.error('Error restoring from IndexedDB:', error);
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
  }, [isOffline, bulkAddVocabularyItems, items.length]);

  return <>{children}</>;
};

const VocabularyManager: React.FC<VocabularyManagerProps> = ({ children }) => {
  return (
    <VocabularyProvider>
      <VocabularySync>
        {children}
      </VocabularySync>
    </VocabularyProvider>
  );
};

export { useVocabularyContext };
export default VocabularyManager;

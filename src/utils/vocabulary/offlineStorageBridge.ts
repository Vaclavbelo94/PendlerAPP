
import { VocabularyItem } from '@/models/VocabularyItem';
import { TestResult } from '@/components/language/vocabulary/VocabularyTest';
import { 
  saveData, 
  getAllData, 
  clearStore, 
  bulkSaveData 
} from '@/utils/offlineStorage';
import { saveVocabularyItems, loadVocabularyItems as loadVocabularyItemsFromLocalStorage } from './storageCore';
import { saveTestHistory } from './testHistory';

// Async functions for loading/saving vocabulary with IndexedDB support

// Save vocabulary items to localStorage and IndexedDB
export const saveVocabularyToOfflineStorage = async (items: VocabularyItem[]): Promise<void> => {
  try {
    // Save to localStorage
    saveVocabularyItems(items);
    
    // Save to IndexedDB if available
    if ('indexedDB' in window) {
      // First clear the vocabulary store
      await clearStore('vocabulary');
      
      // Then bulk save all items
      await bulkSaveData('vocabulary', items);
      console.log('Vocabulary saved to offline storage:', items.length, 'items');
    }
  } catch (error) {
    console.error('Failed to save vocabulary to offline storage:', error);
  }
};

// Load vocabulary items from IndexedDB or localStorage
export const loadVocabularyFromOfflineStorage = async (initialItems: VocabularyItem[] = []): Promise<VocabularyItem[]> => {
  try {
    // First try IndexedDB
    if ('indexedDB' in window) {
      try {
        const items = await getAllData<VocabularyItem>('vocabulary');
        if (items && items.length > 0) {
          console.log('Loaded vocabulary from IndexedDB:', items.length, 'items');
          return items;
        }
      } catch (indexedDBError) {
        console.error('Error loading from IndexedDB, falling back to localStorage:', indexedDBError);
      }
    }
    
    // Fall back to localStorage
    return loadVocabularyItemsFromLocalStorage(initialItems);
  } catch (error) {
    console.error('Failed to load vocabulary from offline storage:', error);
    return initialItems;
  }
};

// Save test history to both localStorage and IndexedDB
export const saveTestHistoryToOfflineStorage = async (testHistory: TestResult[]): Promise<void> => {
  // Save to localStorage
  saveTestHistory(testHistory);
  
  // Save to IndexedDB if available
  if ('indexedDB' in window && testHistory.length > 0) {
    for (const result of testHistory) {
      try {
        await saveData('testHistory', {
          id: result.id || `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          ...result,
          startTime: result.startTime.toISOString(),
          endTime: result.endTime.toISOString()
        });
      } catch (err) {
        console.error('Error saving test history item to IndexedDB:', err);
      }
    }
  }
};

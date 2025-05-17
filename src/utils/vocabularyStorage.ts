
import { VocabularyItem } from '@/models/VocabularyItem';
import { TestResult } from '@/components/language/vocabulary/VocabularyTest';
import { saveData, getAllData } from '@/utils/offlineStorage';

// Save vocabulary items to localStorage and IndexedDB
export const saveVocabularyItems = async (items: VocabularyItem[]): Promise<void> => {
  try {
    // Save to localStorage
    localStorage.setItem('vocabulary_items', JSON.stringify(items));
    
    // Save to IndexedDB if available
    if ('indexedDB' in window) {
      for (const item of items) {
        await saveData('vocabulary', item);
      }
    }
  } catch (error) {
    console.error('Error saving vocabulary items:', error);
  }
};

// Load vocabulary items from localStorage and IndexedDB
export const loadVocabularyItems = async (initialItems: VocabularyItem[] = []): Promise<VocabularyItem[]> => {
  try {
    // Try to get items from IndexedDB first
    if ('indexedDB' in window) {
      try {
        const items = await getAllData<VocabularyItem>('vocabulary');
        if (items && items.length > 0) {
          return items;
        }
      } catch (indexedDBError) {
        console.error('Error loading from IndexedDB, falling back to localStorage:', indexedDBError);
      }
    }
    
    // Fall back to localStorage if IndexedDB fails or is empty
    const storedItems = localStorage.getItem('vocabulary_items');
    if (storedItems) {
      return JSON.parse(storedItems);
    } 
    
    // If no stored items but we have initial items, save and return those
    if (initialItems.length > 0) {
      localStorage.setItem('vocabulary_items', JSON.stringify(initialItems));
    }
    return initialItems;
    
  } catch (error) {
    console.error('Error loading vocabulary items:', error);
    return initialItems;
  }
};

// Save and load test history
export const saveTestHistory = (testHistory: TestResult[]): void => {
  try {
    localStorage.setItem('vocabulary_test_history', JSON.stringify(testHistory));
  } catch (error) {
    console.error('Error saving test history:', error);
  }
};

export const loadTestHistory = (): TestResult[] => {
  try {
    const savedTestHistory = localStorage.getItem('vocabulary_test_history');
    if (savedTestHistory) {
      const parsedHistory = JSON.parse(savedTestHistory);
      return parsedHistory.map((test: any) => ({
        ...test,
        startTime: new Date(test.startTime),
        endTime: new Date(test.endTime)
      }));
    }
  } catch (error) {
    console.error('Error loading test history:', error);
  }
  return [];
};

// Save daily progress
export const saveDailyProgress = (completedToday: number): void => {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(`vocab_progress_${today}`, completedToday.toString());
};

// Load daily progress
export const loadDailyProgress = (): number => {
  const today = new Date().toISOString().split('T')[0];
  const dailyProgress = localStorage.getItem(`vocab_progress_${today}`);
  return dailyProgress ? parseInt(dailyProgress, 10) : 0;
};

// Save daily goal
export const saveDailyGoal = (goal: number): void => {
  localStorage.setItem('vocab_daily_goal', goal.toString());
};

// Load daily goal
export const loadDailyGoal = (defaultGoal: number = 10): number => {
  const savedGoal = localStorage.getItem('vocab_daily_goal');
  return savedGoal ? parseInt(savedGoal, 10) : defaultGoal;
};

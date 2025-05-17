
import { VocabularyItem } from '@/models/VocabularyItem';

// Save vocabulary items to localStorage
export const saveVocabularyItems = (items: VocabularyItem[]): void => {
  try {
    localStorage.setItem('vocabulary_items', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving vocabulary items:', error);
  }
};

// Load vocabulary items from localStorage
export const loadVocabularyItems = (initialItems: VocabularyItem[] = []): VocabularyItem[] => {
  try {
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


import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { 
  saveVocabularyItems, 
  loadVocabularyItems,
  saveDailyProgress,
  loadDailyProgress,
  saveDailyGoal,
  loadDailyGoal
} from '@/services/vocabularyStorage';

export const useVocabularyStorage = (initialItems: VocabularyItem[] = []) => {
  const [items, setItems] = useState<VocabularyItem[]>(initialItems);
  const [dailyGoal, setDailyGoal] = useState(10); // Default daily goal
  const [completedToday, setCompletedToday] = useState(0);
  const { isOffline } = useOfflineStatus();

  // Load items from localStorage on component mount
  useEffect(() => {
    const loadItems = async () => {
      const loadedItems = await loadVocabularyItems(initialItems);
      setItems(loadedItems);
      
      // Load daily progress
      const progress = loadDailyProgress();
      setCompletedToday(progress);
      
      // Load daily goal
      const goal = loadDailyGoal(10);
      setDailyGoal(goal);
    };
    
    loadItems();
  }, [initialItems]);

  // Save items to localStorage whenever they change
  useEffect(() => {
    saveVocabularyItems(items);
  }, [items]);

  // Update daily progress whenever completedToday changes
  useEffect(() => {
    saveDailyProgress(completedToday);
  }, [completedToday]);

  // Set daily goal
  const setVocabularyDailyGoal = (goal: number) => {
    setDailyGoal(goal);
    saveDailyGoal(goal);
  };

  // Add a function to load items manually (for the provider to use)
  const loadInitialItems = async () => {
    const loadedItems = await loadVocabularyItems(initialItems);
    return loadedItems;
  };

  return {
    items,
    setItems,
    dailyGoal,
    completedToday,
    setCompletedToday,
    setDailyGoal: setVocabularyDailyGoal,
    loadInitialItems,
  };
};

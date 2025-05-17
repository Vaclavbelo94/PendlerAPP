
import { useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export const useVocabularyStorage = (items: VocabularyItem[]) => {
  const { isOffline } = useOfflineStatus();

  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('vocabulary_items', JSON.stringify(items));
      
      if (!isOffline) {
        // If we're online, we can attempt to sync with the server/database if needed
        // For now we're just using localStorage, but this could be expanded
      }
    } catch (error) {
      console.error('Error saving vocabulary items to localStorage:', error);
    }
  }, [items, isOffline]);

  // Load initial items from localStorage
  const loadInitialItems = (): VocabularyItem[] => {
    try {
      const storedItems = localStorage.getItem('vocabulary_items');
      if (storedItems) {
        return JSON.parse(storedItems);
      }
    } catch (error) {
      console.error('Error loading vocabulary items from localStorage:', error);
    }
    return [];
  };

  return {
    loadInitialItems
  };
};

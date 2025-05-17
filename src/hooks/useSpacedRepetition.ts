
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { useOfflineStatus } from './useOfflineStatus';
import { calculateNextReviewDate } from '@/utils/dateUtils';
import { calculateVocabularyStatistics } from '@/utils/vocabularyStats';
import { 
  saveVocabularyItems, 
  loadVocabularyItems,
  saveDailyProgress,
  loadDailyProgress,
  saveDailyGoal,
  loadDailyGoal
} from '@/services/vocabularyStorage';

export const useSpacedRepetition = (initialItems: VocabularyItem[] = []) => {
  const [items, setItems] = useState<VocabularyItem[]>(initialItems);
  const [dueItems, setDueItems] = useState<VocabularyItem[]>([]);
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [dailyGoal, setDailyGoal] = useState(10); // Default daily goal
  const [completedToday, setCompletedToday] = useState(0);
  const { isOffline } = useOfflineStatus();
  const { toast } = useToast();

  // Load items from localStorage on component mount
  useEffect(() => {
    const loadedItems = loadVocabularyItems(initialItems);
    setItems(loadedItems);
    
    // Load daily progress
    const progress = loadDailyProgress();
    setCompletedToday(progress);
    
    // Load daily goal
    const goal = loadDailyGoal(10);
    setDailyGoal(goal);
  }, [initialItems]);

  // Calculate due items whenever items change
  useEffect(() => {
    const now = new Date();
    const due = items.filter(item => {
      // If it's a new word (no next review date)
      if (!item.nextReviewDate) return true;
      
      // If the review date has passed
      const reviewDate = new Date(item.nextReviewDate);
      return reviewDate <= now;
    });
    
    setDueItems(due);
    
    // If there's no current item but we have due items, set the first one
    if (!currentItem && due.length > 0) {
      setCurrentItem(due[0]);
    }
  }, [items, currentItem]);

  // Save items to localStorage whenever they change
  useEffect(() => {
    saveVocabularyItems(items);
  }, [items]);

  // Update daily progress whenever completedToday changes
  useEffect(() => {
    saveDailyProgress(completedToday);
    
    // Check if daily goal is met
    if (completedToday >= dailyGoal) {
      toast({
        title: "Denní cíl splněn!",
        description: `Gratuluji! Dokončili jste ${completedToday} z ${dailyGoal} slov.`,
      });
    }
  }, [completedToday, dailyGoal, toast]);

  // Mark a word as correct
  const markCorrect = (itemId: string) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const newRepetitionLevel = Math.min((item.repetitionLevel || 0) + 1, 6); // Max level is 6
          return {
            ...item,
            lastReviewed: new Date().toISOString(),
            nextReviewDate: calculateNextReviewDate(newRepetitionLevel),
            repetitionLevel: newRepetitionLevel,
            correctCount: (item.correctCount || 0) + 1
          };
        }
        return item;
      });
    });
    setCompletedToday(prev => prev + 1);
    goToNextItem();
  };

  // Mark a word as incorrect
  const markIncorrect = (itemId: string) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          // Reset repetition level to 0 when incorrect
          return {
            ...item,
            lastReviewed: new Date().toISOString(),
            nextReviewDate: calculateNextReviewDate(0),
            repetitionLevel: 0,
            incorrectCount: (item.incorrectCount || 0) + 1
          };
        }
        return item;
      });
    });
    setCompletedToday(prev => prev + 1);
    goToNextItem();
  };

  // Go to the next due item
  const goToNextItem = () => {
    const remainingItems = dueItems.filter(item => item.id !== currentItem?.id);
    if (remainingItems.length > 0) {
      setCurrentItem(remainingItems[0]);
    } else {
      setCurrentItem(null);
      toast({
        title: "Hotovo!",
        description: "Všechna slovíčka na dnes jsou hotová.",
      });
    }
  };

  // Add a new vocabulary item
  const addVocabularyItem = (item: Omit<VocabularyItem, 'id'> & Partial<VocabularyItem>) => {
    const newItem: VocabularyItem = {
      ...item,
      id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      repetitionLevel: item.repetitionLevel !== undefined ? item.repetitionLevel : 0,
      correctCount: item.correctCount !== undefined ? item.correctCount : 0,
      incorrectCount: item.incorrectCount !== undefined ? item.incorrectCount : 0,
    };
    
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  // Bulk add vocabulary items (for import)
  const bulkAddVocabularyItems = (newItems: VocabularyItem[]) => {
    setItems(prev => [...prev, ...newItems]);
    
    toast({
      title: "Import dokončen",
      description: `Úspěšně importováno ${newItems.length} slovíček.`,
    });
  };

  // Get statistics for vocabulary learning
  const getStatistics = () => {
    return calculateVocabularyStatistics(items, dueItems, completedToday, dailyGoal);
  };

  // Set daily goal
  const setVocabularyDailyGoal = (goal: number) => {
    setDailyGoal(goal);
    saveDailyGoal(goal);
  };

  return {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    bulkAddVocabularyItems,
    markCorrect,
    markIncorrect,
    goToNextItem,
    getStatistics,
    setDailyGoal: setVocabularyDailyGoal,
  };
};

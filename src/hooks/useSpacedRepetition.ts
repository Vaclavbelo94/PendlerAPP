import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { useOfflineStatus } from './useOfflineStatus';
import { addDays } from 'date-fns';

// Spaced repetition intervals (in days)
const REPETITION_INTERVALS = [
  1,    // Level 0: Review after 1 day
  3,    // Level 1: Review after 3 days
  7,    // Level 2: Review after 7 days
  14,   // Level 3: Review after 14 days
  30,   // Level 4: Review after 30 days
  60,   // Level 5: Review after 60 days
  90,   // Level 6: Review after 90 days
];

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
    try {
      const storedItems = localStorage.getItem('vocabulary_items');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else if (initialItems.length > 0) {
        setItems(initialItems);
        localStorage.setItem('vocabulary_items', JSON.stringify(initialItems));
      }
      
      // Load daily progress
      const today = new Date().toISOString().split('T')[0];
      const dailyProgress = localStorage.getItem(`vocab_progress_${today}`);
      if (dailyProgress) {
        setCompletedToday(parseInt(dailyProgress, 10));
      } else {
        setCompletedToday(0);
      }
      
    } catch (error) {
      console.error('Error loading vocabulary items:', error);
    }
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
    try {
      localStorage.setItem('vocabulary_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving vocabulary items:', error);
    }
  }, [items]);

  // Update daily progress whenever completedToday changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`vocab_progress_${today}`, completedToday.toString());
    
    // Check if daily goal is met
    if (completedToday >= dailyGoal) {
      toast({
        title: "Denní cíl splněn!",
        description: `Gratuluji! Dokončili jste ${completedToday} z ${dailyGoal} slov.`,
      });
    }
  }, [completedToday, dailyGoal, toast]);

  // Function to calculate the next review date based on repetition level
  const calculateNextReviewDate = (level: number): string => {
    const interval = level < REPETITION_INTERVALS.length 
      ? REPETITION_INTERVALS[level] 
      : REPETITION_INTERVALS[REPETITION_INTERVALS.length - 1];
    
    return addDays(new Date(), interval).toISOString();
  };

  // Mark a word as correct
  const markCorrect = (itemId: string) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const newRepetitionLevel = Math.min((item.repetitionLevel || 0) + 1, REPETITION_INTERVALS.length - 1);
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
    
    // Update localStorage
    try {
      const updatedItems = [...items, ...newItems];
      localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving vocabulary items:', error);
    }
    
    toast({
      title: "Import dokončen",
      description: `Úspěšně importováno ${newItems.length} slovíček.`,
    });
  };

  // Get statistics for vocabulary learning
  const getStatistics = () => {
    const totalWords = items.length;
    const newWords = items.filter(item => item.repetitionLevel === 0).length;
    const learningWords = items.filter(item => item.repetitionLevel > 0 && item.repetitionLevel < 4).length;
    const masteredWords = items.filter(item => item.repetitionLevel >= 4).length;
    
    const correctRate = items.reduce((acc, item) => {
      const total = (item.correctCount || 0) + (item.incorrectCount || 0);
      return total > 0 ? acc + ((item.correctCount || 0) / total) : acc;
    }, 0) / (totalWords || 1);
    
    return {
      totalWords,
      newWords,
      learningWords,
      masteredWords,
      correctRate: correctRate * 100, // as percentage
      dueToday: dueItems.length,
      completedToday,
      dailyGoal,
    };
  };

  // Set daily goal
  const setVocabularyDailyGoal = (goal: number) => {
    setDailyGoal(goal);
    localStorage.setItem('vocab_daily_goal', goal.toString());
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

import { useState, useEffect } from 'react';
import { BasicVocabularyItem } from '@/types/language';
import { calculateVocabularyStatistics } from '@/utils/vocabularyStats';

// Pomocné funkce pro spaced repetition algoritmus
const getNextReviewDate = (repetitionLevel: number): Date => {
  const now = new Date();
  const days = Math.pow(2, repetitionLevel); // Exponenciální nárůst: 1, 2, 4, 8, 16... dní
  now.setDate(now.getDate() + days);
  return now;
};

const isItemDueToday = (item: BasicVocabularyItem): boolean => {
  if (!item.nextReviewDate) return true;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reviewDate = new Date(item.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  
  return reviewDate <= today;
};

// Simple localStorage functions (minimal implementation)
const saveDailyProgress = (progress: number) => {
  localStorage.setItem('daily_progress', progress.toString());
};

const loadDailyProgress = (): number => {
  const stored = localStorage.getItem('daily_progress');
  return stored ? parseInt(stored, 10) : 0;
};

const loadDailyGoal = (): number => {
  const stored = localStorage.getItem('daily_goal');
  return stored ? parseInt(stored, 10) : 10;
};

const saveDailyGoal = (goal: number) => {
  localStorage.setItem('daily_goal', goal.toString());
};

export const useSpacedRepetition = (initialItems: BasicVocabularyItem[] = []) => {
  const [items, setItems] = useState<BasicVocabularyItem[]>([]);
  const [dueItems, setDueItems] = useState<BasicVocabularyItem[]>([]);
  const [currentItem, setCurrentItem] = useState<BasicVocabularyItem | null>(null);
  const [dailyGoal, setDailyGoalValue] = useState<number>(10);
  const [completedToday, setCompletedToday] = useState<number>(0);
  
  // Inicializace dat když jsou k dispozici
  useEffect(() => {
    if (initialItems.length > 0 && items.length === 0) {
      console.log('Initializing spaced repetition with items:', initialItems.length);
      setItems(initialItems);
    }
  }, [initialItems, items.length]);
  
  // Načtení denního cíle a pokroku
  useEffect(() => {
    const goalValue = loadDailyGoal();
    setDailyGoalValue(goalValue);
    
    const progress = loadDailyProgress();
    setCompletedToday(progress);
  }, []);
  
  // Aktualizovat seznam slovíček ke zkoušení
  useEffect(() => {
    if (items.length > 0) {
      const dueTodayItems = items.filter(isItemDueToday);
      console.log('Due items today:', dueTodayItems.length);
      setDueItems(dueTodayItems);
      
      if (dueTodayItems.length > 0 && !currentItem) {
        setCurrentItem(dueTodayItems[0]);
      }
    }
  }, [items, currentItem]);
  
  // Přidat nové slovíčko
  const addVocabularyItem = (item: Omit<BasicVocabularyItem, 'id'> & Partial<BasicVocabularyItem>) => {
    const newItem: BasicVocabularyItem = {
      ...item,
      id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      repetitionLevel: item.repetitionLevel !== undefined ? item.repetitionLevel : 0,
      correctCount: item.correctCount !== undefined ? item.correctCount : 0,
      incorrectCount: item.incorrectCount !== undefined ? item.incorrectCount : 0,
      word: item.word || '',
      translation: item.translation || ''
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    
    return newItem;
  };
  
  // Přidat více slovíček najednou
  const bulkAddVocabularyItems = (newItems: BasicVocabularyItem[]) => {
    if (newItems.length > 0) {
      console.log('Bulk adding vocabulary items:', newItems.length);
      setItems(newItems);
    }
  };
  
  // Označit správnou odpověď
  const markCorrect = (itemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const nextLevel = item.repetitionLevel + 1;
        const nextReview = getNextReviewDate(nextLevel);
        
        return {
          ...item,
          repetitionLevel: nextLevel,
          lastReviewed: new Date().toISOString(),
          nextReviewDate: nextReview.toISOString(),
          correctCount: item.correctCount + 1
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Aktualizovat denní pokrok
    const newCompletedToday = completedToday + 1;
    setCompletedToday(newCompletedToday);
    saveDailyProgress(newCompletedToday);
  };
  
  // Označit špatnou odpověď
  const markIncorrect = (itemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        // Vrátit na úroveň 0 a naplánovat na zítra
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return {
          ...item,
          repetitionLevel: 0,
          lastReviewed: new Date().toISOString(),
          nextReviewDate: tomorrow.toISOString(),
          incorrectCount: item.incorrectCount + 1
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Aktualizovat denní pokrok
    const newCompletedToday = completedToday + 1;
    setCompletedToday(newCompletedToday);
    saveDailyProgress(newCompletedToday);
  };
  
  // Přejít na další slovíčko
  const goToNextItem = () => {
    // Odstranit aktuální slovíčko z dueItems
    const remainingItems = dueItems.filter(item => item.id !== currentItem?.id);
    setDueItems(remainingItems);
    
    // Nastavit další slovíčko jako aktuální
    if (remainingItems.length > 0) {
      setCurrentItem(remainingItems[0]);
    } else {
      setCurrentItem(null);
    }
  };
  
  // Získat statistiky
  const getStatistics = () => {
    return calculateVocabularyStatistics(items, dueItems, completedToday, dailyGoal);
  };
  
  // Nastavit denní cíl
  const setDailyGoal = (goal: number) => {
    setDailyGoalValue(goal);
    saveDailyGoal(goal);
  };
  
  return {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    markCorrect,
    markIncorrect,
    goToNextItem,
    getStatistics,
    setDailyGoal,
    bulkAddVocabularyItems
  };
};


import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { 
  saveVocabularyItems,
  loadVocabularyItems,
  saveDailyProgress,
  loadDailyProgress,
  loadDailyGoal,
  saveDailyGoal
} from '@/utils/vocabularyStorage';
import { calculateVocabularyStatistics } from '@/utils/vocabularyStats';

// Pomocné funkce pro spaced repetition algoritmus
const getNextReviewDate = (repetitionLevel: number): Date => {
  const now = new Date();
  const days = Math.pow(2, repetitionLevel); // Exponenciální nárůst: 1, 2, 4, 8, 16... dní
  now.setDate(now.getDate() + days);
  return now;
};

const isItemDueToday = (item: VocabularyItem): boolean => {
  if (!item.nextReviewDate) return true;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reviewDate = new Date(item.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  
  return reviewDate <= today;
};

export const useSpacedRepetition = (initialItems: VocabularyItem[] = []) => {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [dueItems, setDueItems] = useState<VocabularyItem[]>([]);
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [dailyGoal, setDailyGoalValue] = useState<number>(10);
  const [completedToday, setCompletedToday] = useState<number>(0);
  
  // Načtení slovíček a denního cíle
  useEffect(() => {
    const loadedItems = loadVocabularyItems(initialItems);
    setItems(loadedItems);
    
    const goalValue = loadDailyGoal();
    setDailyGoalValue(goalValue);
    
    const progress = loadDailyProgress();
    setCompletedToday(progress);
  }, []);
  
  // Aktualizovat seznam slovíček ke zkoušení
  useEffect(() => {
    const dueTodayItems = items.filter(isItemDueToday);
    setDueItems(dueTodayItems);
    
    if (dueTodayItems.length > 0 && !currentItem) {
      setCurrentItem(dueTodayItems[0]);
    }
  }, [items]);
  
  // Přidat nové slovíčko
  const addVocabularyItem = (item: Omit<VocabularyItem, 'id'> & Partial<VocabularyItem>) => {
    const newItem: VocabularyItem = {
      ...item,
      id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      repetitionLevel: item.repetitionLevel !== undefined ? item.repetitionLevel : 0,
      correctCount: item.correctCount !== undefined ? item.correctCount : 0,
      incorrectCount: item.incorrectCount !== undefined ? item.incorrectCount : 0,
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveVocabularyItems(updatedItems);
    
    return newItem;
  };
  
  // Přidat více slovíček najednou
  const bulkAddVocabularyItems = (newItems: VocabularyItem[]) => {
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    saveVocabularyItems(updatedItems);
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
    saveVocabularyItems(updatedItems);
    
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
    saveVocabularyItems(updatedItems);
    
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
  
  // Získat statistiky - upraveno, aby vracelo data odpovídající VocabularyStatistics
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

import { useState, useEffect } from 'react';
import { BasicVocabularyItem } from '@/types/language';
import { calculateNextReviewDate, calculateKnowledgeScore, optimizeReviewTime } from '@/utils/dateUtils';

export const useRepetitionAlgorithm = (items: BasicVocabularyItem[]) => {
  const [dueItems, setDueItems] = useState<BasicVocabularyItem[]>([]);
  const [currentItem, setCurrentItem] = useState<BasicVocabularyItem | null>(null);

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
    
    // Sort due items by spaced repetition priority
    const sortedDue = [...due].sort((a, b) => {
      // Prioritize new items
      if (!a.lastReviewed && b.lastReviewed) return -1;
      if (a.lastReviewed && !b.lastReviewed) return 1;
      
      // Then prioritize by repetition level (lower levels first)
      if (a.repetitionLevel !== b.repetitionLevel) {
        return a.repetitionLevel - b.repetitionLevel;
      }
      
      // If same level, prioritize those with closer review dates
      if (a.nextReviewDate && b.nextReviewDate) {
        return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
      }
      
      return 0;
    });
    
    setDueItems(sortedDue);
    
    // If there's no current item but we have due items, set the first one
    if (!currentItem && sortedDue.length > 0) {
      setCurrentItem(sortedDue[0]);
    }
  }, [items, currentItem]);

  // Handle marking items as correct or incorrect
  const markCorrect = (itemId: string, onComplete: () => void) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const correctCount = (item.correctCount || 0) + 1;
        const incorrectCount = item.incorrectCount || 0;
        const knowledgeScore = calculateKnowledgeScore(correctCount, incorrectCount);
        
        // Increase repetition level, but cap at maximum level
        const newRepetitionLevel = Math.min((item.repetitionLevel || 0) + 1, 6);
        
        // Calculate next review date based on optimized interval
        const nextReviewDate = optimizeReviewTime(newRepetitionLevel, knowledgeScore);
        
        return {
          ...item,
          lastReviewed: new Date().toISOString(),
          nextReviewDate,
          repetitionLevel: newRepetitionLevel,
          correctCount
        };
      }
      return item;
    });
    
    onComplete();
    return updatedItems;
  };

  const markIncorrect = (itemId: string, onComplete: () => void) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const correctCount = item.correctCount || 0;
        const incorrectCount = (item.incorrectCount || 0) + 1;
        const knowledgeScore = calculateKnowledgeScore(correctCount, incorrectCount);
        
        // Reset repetition level to 0 when incorrect
        const newRepetitionLevel = 0;
        
        // Použití optimalizované funkce pro výpočet dalšího data opakování
        const nextReviewDate = optimizeReviewTime(newRepetitionLevel, knowledgeScore);
        
        return {
          ...item,
          lastReviewed: new Date().toISOString(),
          nextReviewDate,
          repetitionLevel: newRepetitionLevel,
          incorrectCount
        };
      }
      return item;
    });
    
    onComplete();
    return updatedItems;
  };

  // Go to the next due item
  const goToNextItem = () => {
    const remainingItems = dueItems.filter(item => item.id !== currentItem?.id);
    if (remainingItems.length > 0) {
      setCurrentItem(remainingItems[0]);
      return true;
    } else {
      setCurrentItem(null);
      return false;
    }
  };

  return {
    dueItems,
    currentItem,
    markCorrect,
    markIncorrect,
    goToNextItem,
  };
};

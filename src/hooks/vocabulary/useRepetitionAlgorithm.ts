
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { calculateNextReviewDate } from '@/utils/dateUtils';

export const useRepetitionAlgorithm = (items: VocabularyItem[]) => {
  const [dueItems, setDueItems] = useState<VocabularyItem[]>([]);
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);

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

  // Handle marking items as correct or incorrect
  const markCorrect = (itemId: string, onComplete: () => void) => {
    const updatedItems = items.map(item => {
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
    
    onComplete();
    return updatedItems;
  };

  const markIncorrect = (itemId: string, onComplete: () => void) => {
    const updatedItems = items.map(item => {
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

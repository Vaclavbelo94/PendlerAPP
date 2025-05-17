
import { useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { useVocabularyStorage } from './vocabulary/useVocabularyStorage';
import { useRepetitionAlgorithm } from './vocabulary/useRepetitionAlgorithm';
import { useItemManagement } from './vocabulary/useItemManagement';
import { useVocabularyStatistics } from './vocabulary/useVocabularyStatistics';

export const useSpacedRepetition = (initialItems: VocabularyItem[] = []) => {
  const { toast } = useToast();
  
  // Use the newly created hooks
  const {
    items,
    setItems,
    dailyGoal,
    completedToday,
    setCompletedToday,
    setDailyGoal
  } = useVocabularyStorage(initialItems);

  const {
    dueItems,
    currentItem,
    markCorrect: markItemCorrect,
    markIncorrect: markItemIncorrect,
    goToNextItem
  } = useRepetitionAlgorithm(items);

  const {
    addVocabularyItem,
    bulkAddVocabularyItems
  } = useItemManagement(items, setItems);

  const { getStatistics } = useVocabularyStatistics(items, dueItems, completedToday, dailyGoal);

  // Wrapper for marking items as correct
  const markCorrect = (itemId: string) => {
    const updatedItems = markItemCorrect(itemId, () => {
      setCompletedToday(prev => prev + 1);
    });
    setItems(updatedItems);
  };

  // Wrapper for marking items as incorrect
  const markIncorrect = (itemId: string) => {
    const updatedItems = markItemIncorrect(itemId, () => {
      setCompletedToday(prev => prev + 1);
    });
    setItems(updatedItems);
  };

  // Check if daily goal is met
  useEffect(() => {
    if (completedToday >= dailyGoal) {
      toast({
        title: "Denní cíl splněn!",
        description: `Gratuluji! Dokončili jste ${completedToday} z ${dailyGoal} slov.`,
      });
    }
  }, [completedToday, dailyGoal, toast]);

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
    setDailyGoal,
  };
};

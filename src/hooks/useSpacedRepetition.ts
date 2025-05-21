
import { useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { useVocabularyStorage } from './vocabulary/useVocabularyStorage';
import { useRepetitionAlgorithm } from './vocabulary/useRepetitionAlgorithm';
import { useItemManagement } from './vocabulary/useItemManagement';
import { useVocabularyStatistics } from './vocabulary/useVocabularyStatistics';

export const useSpacedRepetition = (initialItems: VocabularyItem[] = []) => {
  const { toast } = useToast();
  
  // Použití nově vytvořených hooků
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

  // Wrapper pro označení položek jako správné
  const markCorrect = (itemId: string) => {
    const updatedItems = markItemCorrect(itemId, () => {
      setCompletedToday(prev => prev + 1);
    });
    setItems(updatedItems);
  };

  // Wrapper pro označení položek jako nesprávné
  const markIncorrect = (itemId: string) => {
    const updatedItems = markItemIncorrect(itemId, () => {
      setCompletedToday(prev => prev + 1);
    });
    setItems(updatedItems);
  };

  // Kontrola, zda je splněn denní cíl
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

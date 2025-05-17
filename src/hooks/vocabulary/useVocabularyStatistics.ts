
import { VocabularyItem } from '@/models/VocabularyItem';
import { calculateVocabularyStatistics } from '@/utils/vocabularyStats';

export const useVocabularyStatistics = (
  items: VocabularyItem[],
  dueItems: VocabularyItem[],
  completedToday: number,
  dailyGoal: number
) => {
  // Get statistics for vocabulary learning
  const getStatistics = () => {
    return calculateVocabularyStatistics(items, dueItems, completedToday, dailyGoal);
  };

  return {
    getStatistics,
  };
};

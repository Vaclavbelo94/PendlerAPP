
import { VocabularyItem } from '@/models/VocabularyItem';

export const calculateVocabularyStatistics = (items: VocabularyItem[], dueItems: VocabularyItem[], completedToday: number, dailyGoal: number) => {
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

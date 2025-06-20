
import { BasicVocabularyItem } from '@/types/language';

export const calculateVocabularyStatistics = (
  items: BasicVocabularyItem[], 
  dueItems: BasicVocabularyItem[], 
  completedToday: number, 
  dailyGoal: number
) => {
  const totalWords = items.length;
  const newWords = items.filter(item => !item.lastReviewed).length;
  const learningWords = items.filter(item => item.repetitionLevel > 0 && item.repetitionLevel < 5).length;
  const masteredWords = items.filter(item => item.repetitionLevel >= 5).length;
  
  const categoryDistribution: Record<string, number> = {};
  items.forEach(item => {
    if (item.category) {
      categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1;
    }
  });
  
  const difficultyBreakdown = {
    easy: items.filter(item => item.difficulty === 'easy').length,
    medium: items.filter(item => item.difficulty === 'medium').length,
    hard: items.filter(item => item.difficulty === 'hard').length,
    unspecified: items.filter(item => !item.difficulty).length
  };
  
  const totalReviewed = items.filter(item => item.lastReviewed).length;
  const totalCorrect = items.reduce((sum, item) => sum + item.correctCount, 0);
  const totalIncorrect = items.reduce((sum, item) => sum + item.incorrectCount, 0);
  const accuracy = totalReviewed > 0 ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;
  
  return {
    totalWords,
    newWords,
    learningWords,
    masteredWords,
    dueToday: dueItems.length,
    categoryDistribution,
    difficultyBreakdown,
    progress: {
      today: completedToday,
      yesterday: 0, // TODO: implementovat načtení včerejších dat
      lastWeek: 0   // TODO: implementovat načtení týdenních dat
    },
    accuracy: Math.round(accuracy),
    dailyGoalCompletion: dailyGoal > 0 ? Math.round((completedToday / dailyGoal) * 100) : 0,
    completedToday,
    dailyGoal,
    correctRate: accuracy
  };
};


import { VocabularyItem } from '@/models/VocabularyItem';

export interface VocabularyStatistics {
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
  correctRate: number;
  dueToday: number;
  completedToday: number;
  dailyGoal: number;
  averageTimeToMastery: number; // v dnech
  learningEfficiency: number; // procento
  difficultWords: VocabularyItem[];
  mostMistakenWords: VocabularyItem[];
  fastestLearned: VocabularyItem[];
  recentActivity: {
    date: string;
    reviewedWords: number;
    correctCount: number;
  }[];
}

export const calculateVocabularyStatistics = (
  items: VocabularyItem[],
  dueItems: VocabularyItem[],
  completedToday: number,
  dailyGoal: number
): VocabularyStatistics => {
  const now = new Date();
  const totalWords = items.length;
  
  // Calculate word counts by level
  const newWords = items.filter(item => item.repetitionLevel === 0).length;
  const learningWords = items.filter(item => item.repetitionLevel > 0 && item.repetitionLevel < 4).length;
  const masteredWords = items.filter(item => item.repetitionLevel >= 4).length;
  
  // Calculate correct rate
  const totalAnswers = items.reduce((sum, item) => sum + item.correctCount + item.incorrectCount, 0);
  const correctAnswers = items.reduce((sum, item) => sum + item.correctCount, 0);
  const correctRate = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  
  // Find difficult words (high incorrect count)
  const difficultWords = [...items]
    .filter(item => item.incorrectCount > 0)
    .sort((a, b) => {
      const aRate = a.incorrectCount / (a.correctCount + a.incorrectCount);
      const bRate = b.incorrectCount / (b.correctCount + b.incorrectCount);
      return bRate - aRate;
    })
    .slice(0, 5);
  
  // Most mistaken words (absolute number of mistakes)
  const mostMistakenWords = [...items]
    .sort((a, b) => b.incorrectCount - a.incorrectCount)
    .slice(0, 5);
  
  // Fastest learned words
  const fastestLearned = [...items]
    .filter(item => item.repetitionLevel >= 4 && item.lastReviewed)
    .sort((a, b) => {
      const aTime = new Date(a.lastReviewed!).getTime() - (a.incorrectCount * 86400000); // penalty for mistakes
      const bTime = new Date(b.lastReviewed!).getTime() - (b.incorrectCount * 86400000);
      return bTime - aTime;
    })
    .slice(0, 5);
  
  // Average time to mastery (estimate based on repetition level progress)
  // This is a simplified calculation, real spaced repetition systems use more complex algorithms
  const averageTimeToMastery = items.length > 0 
    ? items.reduce((sum, item) => {
        const reviewCount = item.correctCount + item.incorrectCount;
        return sum + (reviewCount > 0 ? (4 - Math.min(item.repetitionLevel, 4)) / reviewCount : 0);
      }, 0) / items.length * 5 // rough estimate of days
    : 0;
  
  // Learning efficiency (correct answers vs. total attempts)
  const learningEfficiency = items.reduce((sum, item) => {
    const total = item.correctCount + item.incorrectCount;
    return sum + (total > 0 ? item.correctCount / total : 0);
  }, 0) / Math.max(1, items.length) * 100;
  
  // Recent activity for the last 7 days
  const recentActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dateStr = date.toISOString().split('T')[0];
    const dayItems = items.filter(item => 
      item.lastReviewed && item.lastReviewed.startsWith(dateStr)
    );
    
    return {
      date: dateStr,
      reviewedWords: dayItems.length,
      correctCount: dayItems.reduce((sum, item) => sum + (item.correctCount || 0), 0)
    };
  }).reverse();
  
  return {
    totalWords,
    newWords,
    learningWords,
    masteredWords,
    correctRate,
    dueToday: dueItems.length,
    completedToday,
    dailyGoal,
    averageTimeToMastery,
    learningEfficiency,
    difficultWords,
    mostMistakenWords,
    fastestLearned,
    recentActivity
  };
};

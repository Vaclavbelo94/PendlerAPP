
import { BasicVocabularyItem, VocabularyStatistics } from '@/types/language';
import { calculateKnowledgeScore } from '@/utils/dateUtils';

export const useVocabularyStatistics = (
  items: BasicVocabularyItem[], 
  dueItems: BasicVocabularyItem[],
  completedToday: number, 
  dailyGoal: number
) => {
  // Get statistics for display
  const getStatistics = (): VocabularyStatistics => {
    const totalItems = items.length;
    const dueItemsCount = dueItems.length;
    const completionPercentage = dailyGoal > 0 ? Math.min(100, Math.round((completedToday / dailyGoal) * 100)) : 0;
    
    // Total learning statistics
    const totalReviewed = items.filter(item => item.lastReviewed).length;
    const totalNew = items.filter(item => !item.lastReviewed).length;
    
    // Calculate average knowledge score
    let totalScore = 0;
    let itemsWithScore = 0;
    
    items.forEach(item => {
      const correctCount = item.correctCount || 0;
      const incorrectCount = item.incorrectCount || 0;
      
      if (correctCount + incorrectCount > 0) {
        totalScore += calculateKnowledgeScore(correctCount, incorrectCount);
        itemsWithScore++;
      }
    });
    
    const averageScore = itemsWithScore > 0 ? Math.round(totalScore / itemsWithScore) : 0;
    
    // Statistics by repetition levels
    const levelCounts = items.reduce((acc, item) => {
      const level = item.repetitionLevel || 0;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Word counts by levels
    const byLevel = {
      new: totalNew,
      learning: items.filter(item => item.repetitionLevel !== undefined && item.repetitionLevel < 4 && item.lastReviewed).length,
      mastered: items.filter(item => item.repetitionLevel !== undefined && item.repetitionLevel >= 4).length
    };

    // Category distribution
    const categoryDistribution: Record<string, number> = {};
    items.forEach(item => {
      const category = item.category || 'Obecné';
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });

    // Difficulty breakdown
    const difficultyBreakdown = {
      easy: items.filter(item => item.difficulty === 'easy').length,
      medium: items.filter(item => item.difficulty === 'medium').length,
      hard: items.filter(item => item.difficulty === 'hard').length,
      unspecified: items.filter(item => !item.difficulty).length
    };
    
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
    
    // Calculate average time to mastery (estimate based on repetition level progress)
    const averageTimeToMastery = items.length > 0 
      ? items.reduce((sum, item) => {
          const reviewCount = item.correctCount + item.incorrectCount;
          return sum + (reviewCount > 0 ? (4 - Math.min(item.repetitionLevel, 4)) / reviewCount : 0);
        }, 0) / items.length * 5 // rough estimate of days
      : 0;
    
    // Calculate learning efficiency (correct answers vs. total attempts)
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
      totalWords: totalItems,
      newWords: totalNew,
      learningWords: byLevel.learning,
      masteredWords: byLevel.mastered,
      correctRate: averageScore,
      dueToday: dueItemsCount,
      completedToday,
      dailyGoal,
      categoryDistribution,
      difficultyBreakdown,
      progress: {
        today: completedToday,
        yesterday: 0,
        lastWeek: 0
      },
      accuracy: averageScore,
      dailyGoalCompletion: completionPercentage,
      averageTimeToMastery,
      learningEfficiency,
      difficultWords,
      mostMistakenWords,
      fastestLearned,
      recentActivity
    };
  };
  
  return { getStatistics };
};

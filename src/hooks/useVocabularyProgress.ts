
import { useState, useEffect } from 'react';
import { UserProgress, VocabularyItem } from '@/models/VocabularyItem';
import { generateDailyStats, calculateStreakDays, calculateAverageAccuracy } from '@/utils/progressCalculations';
import { calculateCategoryDistribution, calculateDifficultyDistribution, findLastStudyDate } from '@/utils/vocabularyDistribution';

export const useVocabularyProgress = (vocabularyItems: VocabularyItem[] = []) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    dailyStats: [],
    totalReviewed: 0,
    streakDays: 0,
    averageAccuracy: 0,
    categoryDistribution: {},
    difficultyDistribution: {
      easy: 0,
      medium: 0,
      hard: 0,
      unspecified: 0
    }
  });

  // Generate user progress from vocabulary items
  useEffect(() => {
    if (!vocabularyItems.length) {
      return;
    }

    // Calculate daily stats for the last 7 days
    const last7Days = generateDailyStats(vocabularyItems, 7);
    
    // Calculate streak days
    const streakCount = calculateStreakDays(vocabularyItems);

    // Calculate category and difficulty distributions
    const categoryDist = calculateCategoryDistribution(vocabularyItems);
    const difficultyDist = calculateDifficultyDistribution(vocabularyItems);

    // Calculate average accuracy
    const accuracy = calculateAverageAccuracy(vocabularyItems);

    // Find last study date
    const lastStudyDate = findLastStudyDate(vocabularyItems);

    // Update progress state
    setUserProgress({
      dailyStats: last7Days,
      totalReviewed: vocabularyItems.filter(item => item.lastReviewed).length,
      streakDays: streakCount,
      lastStudyDate,
      averageAccuracy: accuracy,
      categoryDistribution: categoryDist,
      difficultyDistribution: difficultyDist
    });
  }, [vocabularyItems]);

  return { userProgress };
};

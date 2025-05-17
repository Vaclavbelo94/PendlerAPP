
import { useState, useEffect } from 'react';
import { UserProgress, VocabularyItem, DailyProgressStat } from '@/models/VocabularyItem';
import { format, subDays, parseISO } from 'date-fns';

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
    const last7Days: DailyProgressStat[] = [];
    const now = new Date();
    
    // Populate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find words reviewed on this day
      const reviewedToday = vocabularyItems.filter(item => 
        item.lastReviewed?.startsWith(dateStr)
      );
      
      const correct = reviewedToday.filter(item => 
        item.correctCount > item.incorrectCount
      ).length;
      
      last7Days.push({
        date: dateStr,
        wordsReviewed: reviewedToday.length,
        correctCount: correct,
        incorrectCount: reviewedToday.length - correct
      });
    }

    // Calculate streak days
    let streakCount = 0;
    const today = format(now, 'yyyy-MM-dd');
    
    // Check if studied today
    const studiedToday = vocabularyItems.some(item => 
      item.lastReviewed?.startsWith(today)
    );
    
    if (studiedToday) {
      streakCount = 1;
      let checkDate = subDays(now, 1);
      let keepChecking = true;
      
      while (keepChecking) {
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        const studiedOnDate = vocabularyItems.some(item => 
          item.lastReviewed?.startsWith(dateStr)
        );
        
        if (studiedOnDate) {
          streakCount++;
          checkDate = subDays(checkDate, 1);
        } else {
          keepChecking = false;
        }
      }
    }

    // Calculate category distribution
    const categoryDist: {[category: string]: number} = {};
    vocabularyItems.forEach(item => {
      const category = item.category || 'Obecné';
      categoryDist[category] = (categoryDist[category] || 0) + 1;
    });

    // Calculate difficulty distribution
    const difficultyDist = {
      easy: 0,
      medium: 0, 
      hard: 0,
      unspecified: 0
    };
    
    vocabularyItems.forEach(item => {
      if (item.difficulty === 'easy') {
        difficultyDist.easy++;
      } else if (item.difficulty === 'medium') {
        difficultyDist.medium++;
      } else if (item.difficulty === 'hard') {
        difficultyDist.hard++;
      } else {
        difficultyDist.unspecified++;
      }
    });

    // Calculate average accuracy
    let totalCorrect = 0;
    let totalAttempts = 0;
    
    vocabularyItems.forEach(item => {
      totalCorrect += item.correctCount || 0;
      totalAttempts += (item.correctCount || 0) + (item.incorrectCount || 0);
    });
    
    const accuracy = totalAttempts > 0 
      ? Math.round((totalCorrect / totalAttempts) * 100) 
      : 0;

    // Find last study date
    const reviewDates = vocabularyItems
      .map(item => item.lastReviewed)
      .filter(Boolean) as string[];
    
    const lastStudyDate = reviewDates.length > 0
      ? reviewDates.sort().reverse()[0]
      : undefined;

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

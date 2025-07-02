import { BasicVocabularyItem, DailyProgressStat } from '@/types/language';
import { format, subDays, parseISO } from 'date-fns';

// Generate daily stats for a specified number of days
export const generateDailyStats = (
  vocabularyItems: BasicVocabularyItem[], 
  days: number = 7
): DailyProgressStat[] => {
  const stats: DailyProgressStat[] = [];
  const now = new Date();
  
  // Populate days
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Find words reviewed on this day
    const reviewedToday = vocabularyItems.filter(item => 
      item.lastReviewed?.startsWith(dateStr)
    );
    
    const correct = reviewedToday.filter(item => 
      item.correctCount > item.incorrectCount
    ).length;
    
    stats.push({
      date: dateStr,
      wordsReviewed: reviewedToday.length,
      correctCount: correct,
      incorrectCount: reviewedToday.length - correct
    });
  }
  
  return stats;
};

// Calculate user streak days
export const calculateStreakDays = (vocabularyItems: BasicVocabularyItem[]): number => {
  let streakCount = 0;
  const now = new Date();
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
  
  return streakCount;
};

// Calculate average accuracy from items
export const calculateAverageAccuracy = (vocabularyItems: BasicVocabularyItem[]): number => {
  let totalCorrect = 0;
  let totalAttempts = 0;
  
  vocabularyItems.forEach(item => {
    totalCorrect += item.correctCount || 0;
    totalAttempts += (item.correctCount || 0) + (item.incorrectCount || 0);
  });
  
  return totalAttempts > 0 
    ? Math.round((totalCorrect / totalAttempts) * 100) 
    : 0;
};

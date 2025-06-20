
import { format, parseISO, isSameDay, subDays, isToday } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DailyProgressStat } from '@/types/language';

export interface DayInfo {
  date: Date;
  dayName: string;
  formattedDate: string;
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  activityLevel: number;
  isToday: boolean;
}

// Helper function to get activity level from word count
export const getActivityLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count < 5) return 1;  
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
};

export const getDayClassName = (level: number): string => {
  switch (level) {
    case 0: return 'bg-gray-100 dark:bg-gray-800';
    case 1: return 'bg-green-100 dark:bg-green-900';
    case 2: return 'bg-green-300 dark:bg-green-700';
    case 3: return 'bg-green-500 dark:bg-green-600';
    case 4: return 'bg-green-700 dark:bg-green-500';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
};

// Generate days for current week offset
export const generateDays = (
  weekOffset: number,
  dailyStats: DailyProgressStat[]
): DayInfo[] => {
  // Calculate start date (Sunday of the week)
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 6 + (weekOffset * 7)); // Go back 6 days for week start
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    // Find corresponding stats
    const dayStat = dailyStats.find(stat => 
      isSameDay(parseISO(stat.date), date)
    );
    
    return {
      date,
      dayName: format(date, 'eeeeee', { locale: cs }), // Short day name
      formattedDate: format(date, 'd. MMM', { locale: cs }),
      wordsReviewed: dayStat?.wordsReviewed || 0,
      correctCount: dayStat?.correctCount || 0,
      incorrectCount: dayStat?.incorrectCount || 0,
      activityLevel: getActivityLevel(dayStat?.wordsReviewed || 0),
      isToday: isToday(date)
    };
  });
};

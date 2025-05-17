
import { addDays } from 'date-fns';
import { REPETITION_INTERVALS } from '@/constants/spacedRepetition';

// Calculate the next review date based on repetition level
export const calculateNextReviewDate = (level: number): string => {
  const interval = level < REPETITION_INTERVALS.length 
    ? REPETITION_INTERVALS[level] 
    : REPETITION_INTERVALS[REPETITION_INTERVALS.length - 1];
  
  return addDays(new Date(), interval).toISOString();
};

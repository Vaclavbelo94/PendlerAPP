
/**
 * Format date to localized string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format date to ISO string for inputs
 */
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch (error) {
    return false;
  }
};

/**
 * Check if date is in the future
 */
export const isDateInFuture = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  } catch (error) {
    return false;
  }
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (startDate: string, endDate: string): number => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    return 0;
  }
};

/**
 * Calculate next review date for vocabulary (placeholder implementation)
 */
export const calculateNextReviewDate = (lastReview: Date, difficulty: number): Date => {
  const now = new Date();
  const daysToAdd = Math.max(1, difficulty * 2);
  const nextDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return nextDate;
};

/**
 * Calculate knowledge score (placeholder implementation)
 */
export const calculateKnowledgeScore = (correctAnswers: number, totalAnswers: number): number => {
  if (totalAnswers === 0) return 0;
  return Math.round((correctAnswers / totalAnswers) * 100);
};

/**
 * Optimize review time based on repetition level and knowledge score
 */
export const optimizeReviewTime = (repetitionLevel: number, knowledgeScore: number): string => {
  const now = new Date();
  
  // Calculate interval based on repetition level (spaced repetition algorithm)
  let intervalDays = 1;
  switch (repetitionLevel) {
    case 0:
      intervalDays = 1; // Review again tomorrow
      break;
    case 1:
      intervalDays = 3; // Review in 3 days
      break;
    case 2:
      intervalDays = 7; // Review in a week
      break;
    case 3:
      intervalDays = 14; // Review in 2 weeks
      break;
    case 4:
      intervalDays = 30; // Review in a month
      break;
    case 5:
      intervalDays = 90; // Review in 3 months
      break;
    default:
      intervalDays = 180; // Review in 6 months for higher levels
  }
  
  // Adjust interval based on knowledge score
  if (knowledgeScore < 50) {
    intervalDays = Math.max(1, Math.floor(intervalDays * 0.5)); // Halve the interval for low scores
  } else if (knowledgeScore > 80) {
    intervalDays = Math.floor(intervalDays * 1.5); // Increase interval for high scores
  }
  
  const nextDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return nextDate.toISOString();
};


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
 * Optimize review time (placeholder implementation)
 */
export const optimizeReviewTime = (userPreference: string): Date => {
  const now = new Date();
  // Default to current time
  return now;
};

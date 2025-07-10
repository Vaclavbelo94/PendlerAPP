/**
 * Simplified DHL Woche calculation
 * Based on current user's Woche and weeks offset
 */

/**
 * Calculate simple Woche based on current Woche and weeks offset
 * @param currentWoche - User's current Woche (1-15)
 * @param weeksOffset - Number of weeks to add/subtract
 * @returns Calculated Woche (1-15)
 */
export function calculateSimpleWoche(currentWoche: number, weeksOffset: number = 0): number {
  if (!currentWoche || currentWoche < 1 || currentWoche > 15) {
    console.warn('Invalid currentWoche:', currentWoche);
    return 1;
  }

  let result = currentWoche + weeksOffset;
  
  // Handle overflow/underflow with 15-week cycle
  while (result > 15) {
    result -= 15;
  }
  while (result < 1) {
    result += 15;
  }
  
  return result;
}

/**
 * Get Woche for specific date based on user's current setup
 * @param userCurrentWoche - User's current Woche
 * @param targetDate - Date to calculate Woche for
 * @returns Woche for the target date
 */
export function getWocheForDate(userCurrentWoche: number, targetDate: Date): number {
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
  
  const targetWeekStart = new Date(targetDate);
  targetWeekStart.setDate(targetDate.getDate() - targetDate.getDay() + 1); // Monday
  
  const weeksDiff = Math.round((targetWeekStart.getTime() - currentWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  return calculateSimpleWoche(userCurrentWoche, weeksDiff);
}
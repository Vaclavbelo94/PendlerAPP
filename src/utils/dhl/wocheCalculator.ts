
// Utility for calculating DHL Woche cycles and shift schedules

export interface WocheReference {
  referenceDate: Date;
  referenceWoche: number;
}

export interface WocheCalculation {
  currentWoche: number;
  weekStartDate: Date;
  weekEndDate: Date;
  cyclePosition: number; // Position in 15-week cycle
}

/**
 * Calculate current Woche for a user based on their reference point
 */
export const calculateCurrentWoche = (reference: WocheReference, targetDate: Date = new Date()): WocheCalculation => {
  const { referenceDate, referenceWoche } = reference;
  
  // Calculate weeks difference from reference
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksDiff = Math.floor((targetDate.getTime() - referenceDate.getTime()) / msPerWeek);
  
  // Calculate current Woche (1-15 cycle)
  let currentWoche = ((referenceWoche - 1 + weeksDiff) % 15) + 1;
  if (currentWoche <= 0) {
    currentWoche += 15;
  }
  
  // Calculate week start date (Monday)
  const weekStartDate = new Date(targetDate);
  const dayOfWeek = weekStartDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  weekStartDate.setDate(weekStartDate.getDate() + mondayOffset);
  weekStartDate.setHours(0, 0, 0, 0);
  
  // Calculate week end date (Sunday)
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  weekEndDate.setHours(23, 59, 59, 999);
  
  return {
    currentWoche,
    weekStartDate,
    weekEndDate,
    cyclePosition: weeksDiff % 15
  };
};

/**
 * Generate Woche dates for a range
 */
export const generateWocheRange = (
  reference: WocheReference, 
  startDate: Date, 
  endDate: Date
): WocheCalculation[] => {
  const result: WocheCalculation[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    result.push(calculateCurrentWoche(reference, new Date(current)));
    current.setDate(current.getDate() + 7); // Move to next week
  }
  
  return result;
};

/**
 * Find the matching shift data for a specific date and Woche
 */
export const findShiftForDate = (scheduleData: any, woche: number, date: Date): any => {
  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  
  // First try to find data by exact date
  if (scheduleData[dateStr]) {
    return scheduleData[dateStr];
  }
  
  // For yearly plans, look for data by woche key
  const wocheKey = `woche_${woche}`;
  if (scheduleData[wocheKey]) {
    const wocheData = scheduleData[wocheKey];
    
    // Get day of week (0=Sunday, 1=Monday, etc.)
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    // Check if data exists for this day in this woche
    if (wocheData[dayName] !== undefined) {
      // If null, user has day off
      if (wocheData[dayName] === null) {
        return null; // Explicitly null = day off
      }
      return wocheData[dayName];
    }
  }
  
  // Fallback to day pattern matching if available
  const dayOfWeek = date.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek];
  
  // Check for day-based patterns in the schedule
  if (scheduleData.pattern && scheduleData.pattern[dayName]) {
    return scheduleData.pattern[dayName];
  }
  
  return null;
};

/**
 * Parse time string to minutes from midnight
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Format minutes to HH:MM time string
 */
export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Get Monday of the current week
 */
export const getCurrentWeekMonday = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Determine shift type based on start time
 */
export const determineShiftType = (startTime: string): 'morning' | 'afternoon' | 'night' => {
  const startMinutes = parseTimeToMinutes(startTime);
  
  if (startMinutes >= 360 && startMinutes < 780) { // 6:00 - 13:00
    return 'morning';
  } else if (startMinutes >= 780 && startMinutes < 1320) { // 13:00 - 22:00
    return 'afternoon';
  } else {
    return 'night';
  }
};

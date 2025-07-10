
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
  calendarWeek: number; // Current calendar week (1-53)
  rotatedWoche: number; // User's rotated woche position for this calendar week
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
  
  // Calculate current calendar week
  const calendarWeek = getCalendarWeek(targetDate);
  
  // Calculate rotated woche position for annual system
  const rotatedWoche = calculateRotatedWoche(referenceWoche, calendarWeek);

  return {
    currentWoche,
    weekStartDate,
    weekEndDate,
    cyclePosition: weeksDiff % 15,
    calendarWeek,
    rotatedWoche
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
 * Check if a position is active in a given Woche (rotation logic)
 */
export const isPositionActiveInWoche = (positionCycleWeeks: number[], currentWoche: number): boolean => {
  return positionCycleWeeks.includes(currentWoche);
};

/**
 * Get active Woche Dienst groups for a given calendar week (Jahrwoche)
 */
export const getActiveWocheDienstGroups = (jahrwoche: number, positionCycleWeeks: number[]): number[] => {
  // For positions with rotation patterns, determine which groups are active
  // This is a simplified logic - in reality, DHL has complex rotation schedules
  const cycleLength = 15; // DHL uses 15-week cycles
  const weekInCycle = ((jahrwoche - 1) % cycleLength) + 1;
  
  // Return groups that are active in this week based on position's cycle
  return positionCycleWeeks.filter(woche => {
    // Check if this woche group is active based on the rotation pattern
    return isPositionActiveInWoche(positionCycleWeeks, weekInCycle);
  });
};

/**
 * Find the matching shift data for a specific date and Woche
 */
export const findShiftForDate = (scheduleData: any, woche: number, date: Date, positionCycleWeeks?: number[]): any => {
  // If position cycle weeks are provided, check if this position is active in this woche
  if (positionCycleWeeks && !isPositionActiveInWoche(positionCycleWeeks, woche)) {
    console.log(`Position not active in Woche ${woche}, cycle: [${positionCycleWeeks.join(',')}]`);
    return null; // Position not active this week
  }
  
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

/**
 * Get current calendar week (1-53)
 */
export const getCalendarWeek = (date: Date = new Date()): number => {
  const target = new Date(date);
  const january4 = new Date(target.getFullYear(), 0, 4);
  const dayOfWeek = january4.getDay() || 7; // Sunday = 7
  const jan4Monday = new Date(january4.getTime() - (dayOfWeek - 1) * 24 * 60 * 60 * 1000);
  
  const diff = target.getTime() - jan4Monday.getTime();
  const daysDiff = Math.floor(diff / (24 * 60 * 60 * 1000));
  const week = Math.floor(daysDiff / 7) + 1;
  
  return Math.max(1, Math.min(53, week));
};

/**
 * Calculate rotated woche position for annual system
 * User with woche=1 in KW01 has woche1, in KW02 has woche2, etc.
 */
export const calculateRotatedWoche = (userWoche: number, calendarWeek: number): number => {
  // Rotation: user starts at their assigned woche in week 1, then rotates
  const rotated = ((userWoche - 1 + calendarWeek - 1) % 15) + 1;
  return rotated;
};

/**
 * Find shift data for annual rotational system
 */
export const findAnnualShiftForDate = (
  annualSchedule: any, 
  userWoche: number, 
  date: Date
): any => {
  const calendarWeek = getCalendarWeek(date);
  const rotatedWoche = calculateRotatedWoche(userWoche, calendarWeek);
  
  console.log(`findAnnualShiftForDate: Date ${date.toISOString().split('T')[0]}, CW${calendarWeek}, userWoche ${userWoche}, rotatedWoche ${rotatedWoche}`);
  
  // Format calendar week as KW01, KW02, etc.
  const calendarWeekKey = `KW${calendarWeek.toString().padStart(2, '0')}`;
  const wocheKey = `woche${rotatedWoche}`;
  
  console.log(`Looking for: ${calendarWeekKey}.${wocheKey}`);
  console.log('Available calendar weeks:', Object.keys(annualSchedule));
  
  // Check if we have data for this calendar week
  if (annualSchedule[calendarWeekKey]) {
    console.log(`Found data for ${calendarWeekKey}:`, Object.keys(annualSchedule[calendarWeekKey]));
    
    // Check if we have data for this woche group
    if (annualSchedule[calendarWeekKey][wocheKey]) {
      const dayOfWeek = date.getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeek];
      
      console.log(`Found woche data for ${wocheKey}, looking for day: ${dayName}`);
      console.log('Available days:', Object.keys(annualSchedule[calendarWeekKey][wocheKey]));
      
      const shiftData = annualSchedule[calendarWeekKey][wocheKey][dayName];
      
      console.log(`Shift data for ${dayName}:`, shiftData);
      
      // Return null if explicitly marked as day off or no data
      if (shiftData === null || shiftData === undefined || shiftData?.is_off === true) {
        console.log('Day off detected');
        return null;
      }
      
      return shiftData;
    } else {
      console.log(`No data found for woche group ${wocheKey}`);
    }
  } else {
    console.log(`No data found for calendar week ${calendarWeekKey}`);
  }
  
  return null; // No shift data found
};


export interface WocheReference {
  referenceDate: Date;
  referenceWoche: number;
}

export interface WocheCalculationResult {
  currentWoche: number;
  weekStartDate: Date;
  weekEndDate: Date;
  cyclePosition: number;
}

/**
 * Calculate current Woche based on reference point
 */
export const calculateCurrentWoche = (
  reference: WocheReference,
  targetDate: Date
): WocheCalculationResult => {
  const refDate = new Date(reference.referenceDate);
  const target = new Date(targetDate);
  
  // Get start of week (Monday) for both dates
  const refWeekStart = getWeekStart(refDate);
  const targetWeekStart = getWeekStart(target);
  
  // Calculate difference in weeks
  const diffInWeeks = Math.floor((targetWeekStart.getTime() - refWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  // Calculate current Woche (1-15 cycle)
  let currentWoche = ((reference.referenceWoche - 1 + diffInWeeks) % 15) + 1;
  if (currentWoche <= 0) {
    currentWoche += 15;
  }
  
  // Calculate week boundaries
  const weekStartDate = new Date(targetWeekStart);
  const weekEndDate = new Date(targetWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  
  return {
    currentWoche,
    weekStartDate,
    weekEndDate,
    cyclePosition: ((currentWoche - 1) % 15) + 1
  };
};

/**
 * Get Monday of the week for a given date
 */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(d.setDate(diff));
};

/**
 * Find shift data for a specific date and Woche from schedule
 */
export const findShiftForDate = (
  scheduleData: any,
  woche: number,
  date: Date
): { start_time?: string; end_time?: string } | null => {
  if (!scheduleData || typeof scheduleData !== 'object') {
    return null;
  }

  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const wocheKey = `woche_${woche}`;
  
  // Check if this Woche exists in schedule
  if (!scheduleData[wocheKey]) {
    return null;
  }

  const wocheData = scheduleData[wocheKey];
  
  // Map day of week to day name
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek];
  
  // Get shift for this day
  const dayShift = wocheData[dayName];
  
  if (dayShift && dayShift.start_time && dayShift.end_time) {
    return {
      start_time: dayShift.start_time,
      end_time: dayShift.end_time
    };
  }
  
  return null;
};

/**
 * Get Woche for a specific date given a reference point
 */
export const getWocheForDate = (
  referenceDate: Date,
  referenceWoche: number,
  targetDate: Date
): number => {
  const result = calculateCurrentWoche(
    { referenceDate, referenceWoche },
    targetDate
  );
  
  return result.currentWoche;
};

/**
 * Check if a position works in a specific Woche
 */
export const isPositionActiveInWoche = (
  positionCycleWeeks: number[],
  woche: number
): boolean => {
  return positionCycleWeeks.includes(woche);
};

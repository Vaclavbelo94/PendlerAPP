import { Shift } from '@/types/shifts';

// Standardní pracovní doba pro každý typ směny (v hodinách)
const STANDARD_SHIFT_HOURS: Record<string, number> = {
  morning: 8,   // 6:00 - 14:00
  afternoon: 8, // 14:00 - 22:00  
  night: 8,     // 22:00 - 6:00
  custom: 8     // default pro custom směny
};

/**
 * Vypočítá délku směny v hodinách
 */
export const calculateShiftDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;
  
  // Pokud končí následující den (např. noční směna)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60; // přidej 24 hodin
  }
  
  const durationMinutes = endMinutes - startMinutes;
  return durationMinutes / 60; // převeď na hodiny
};

/**
 * Vypočítá přesčasové hodiny pro jednu směnu
 */
export const calculateOvertimeForShift = (shift: Shift): number => {
  const actualHours = calculateShiftDuration(shift.start_time, shift.end_time);
  const standardHours = STANDARD_SHIFT_HOURS[shift.type] || 8;
  
  const overtime = actualHours - standardHours;
  return Math.max(0, overtime); // přesčasy nemůžou být záporné
};

/**
 * Vypočítá celkové přesčasy pro seznam směn
 */
export const calculateTotalOvertime = (shifts: Shift[]): number => {
  return shifts.reduce((total, shift) => {
    return total + calculateOvertimeForShift(shift);
  }, 0);
};

/**
 * Vrátí statistiky přesčasů podle typu směny
 */
export const getOvertimeStatsByType = (shifts: Shift[]): Record<string, number> => {
  const overtimeByType: Record<string, number> = {};
  
  shifts.forEach(shift => {
    const overtime = calculateOvertimeForShift(shift);
    if (overtime > 0) {
      overtimeByType[shift.type] = (overtimeByType[shift.type] || 0) + overtime;
    }
  });
  
  return overtimeByType;
};

/**
 * Vrátí detailní statistiky směn včetně přesčasů
 */
export interface ShiftStatistics {
  totalShifts: number;
  totalHours: number;
  totalStandardHours: number;
  totalOvertime: number;
  averageHoursPerShift: number;
  overtimeByType: Record<string, number>;
}

export const calculateShiftStatistics = (shifts: Shift[]): ShiftStatistics => {
  const totalShifts = shifts.length;
  
  let totalHours = 0;
  let totalStandardHours = 0;
  const overtimeByType: Record<string, number> = {};
  
  shifts.forEach(shift => {
    const actualHours = calculateShiftDuration(shift.start_time, shift.end_time);
    const standardHours = STANDARD_SHIFT_HOURS[shift.type] || 8;
    const overtime = calculateOvertimeForShift(shift);
    
    totalHours += actualHours;
    totalStandardHours += standardHours;
    
    if (overtime > 0) {
      overtimeByType[shift.type] = (overtimeByType[shift.type] || 0) + overtime;
    }
  });
  
  const totalOvertime = totalHours - totalStandardHours;
  const averageHoursPerShift = totalShifts > 0 ? totalHours / totalShifts : 0;
  
  return {
    totalShifts,
    totalHours,
    totalStandardHours,
    totalOvertime: Math.max(0, totalOvertime),
    averageHoursPerShift,
    overtimeByType
  };
};
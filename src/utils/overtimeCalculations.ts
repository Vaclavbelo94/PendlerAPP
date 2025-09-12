import { Shift } from '@/types/shifts';

// Standardní pracovní doba pro každý typ směny (v hodinách)
const STANDARD_SHIFT_HOURS: Record<string, number> = {
  morning: 8,   // 6:00 - 14:00
  afternoon: 8, // 14:00 - 22:00  
  night: 8,     // 22:00 - 6:00
  custom: 8     // default pro custom směny
};

// Firma-specifické standardy pracovní doby
export const getCompanyStandardHours = (
  company?: string, 
  positionType?: string, 
  shiftType?: string
): number => {
  if (company === 'dhl') {
    // DHL Technik má standardní 8h směny
    if (positionType === 'technik') {
      return 8;
    }
    // DHL Wechselschicht má 30h týdně = 6h denně
    return 6;
  }
  
  // Ostatní firmy (Adecco, Randstad) - standardní 8h
  return 8;
};

/**
 * Vypočítá týdenní přesčasy pro DHL Wechselschicht pozice (30h/týden)
 */
export const calculateWeeklyOvertimeForDHLWechselschicht = (weeklyShifts: Shift[]): number => {
  const totalWeeklyHours = weeklyShifts.reduce((total, shift) => {
    return total + calculateShiftDuration(shift.start_time, shift.end_time);
  }, 0);
  
  const standardWeeklyHours = 30; // DHL Wechselschicht standard
  return Math.max(0, totalWeeklyHours - standardWeeklyHours);
};

/**
 * Kontrolluje zda je pozice DHL Wechselschicht (30h týdně)
 */
export const isDHLWechselschichtPosition = (company?: string, positionType?: string): boolean => {
  return company === 'dhl' && positionType !== 'technik';
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
export const calculateOvertimeForShift = (shift: Shift, standardHours?: number): number => {
  const actualHours = calculateShiftDuration(shift.start_time, shift.end_time);
  const shiftStandardHours = standardHours || STANDARD_SHIFT_HOURS[shift.type] || 8;
  
  const overtime = actualHours - shiftStandardHours;
  return Math.max(0, overtime); // přesčasy nemůžou být záporné
};

/**
 * Vypočítá přesčasové hodiny pro jednu směnu s firma-specifickými standardy
 */
export const calculateOvertimeForShiftWithCompany = (
  shift: Shift, 
  company?: string, 
  positionType?: string
): number => {
  const standardHours = getCompanyStandardHours(company, positionType, shift.type);
  return calculateOvertimeForShift(shift, standardHours);
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
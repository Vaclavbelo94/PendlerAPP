import { useState, useEffect, useMemo } from 'react';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { useCompany } from '@/hooks/useCompany';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { calculateShiftDuration, calculateOvertimeForShift, getOvertimeStatsByType, isDHLWechselschichtPosition } from '@/utils/overtimeCalculations';
import { Shift } from '@/types/shifts';

interface OvertimeData {
  morning: number;
  afternoon: number;
  night: number;
  total: number;
}

interface UseOvertimeDataOptions {
  userId: string | undefined;
  month?: number;
  year?: number;
  customStandardHours?: number;
}

export const useOvertimeData = ({ userId, month, year, customStandardHours }: UseOvertimeDataOptions) => {
  const { shifts, isLoading: shiftsLoading, error: shiftsError } = useShiftsData({ userId });
  const { company, isDHL } = useCompany();
  const { userAssignment } = useDHLData(userId);
  
  const [overtimeData, setOvertimeData] = useState<OvertimeData>({
    morning: 0,
    afternoon: 0,
    night: 0,
    total: 0
  });

  // Get company-specific standard hours
  const getStandardHours = (shiftType: string, position?: any): number => {
    // If custom standard hours is provided, use that
    if (customStandardHours !== undefined) {
      return customStandardHours;
    }

    // For DHL employees, default to 6h/day unless Technik role (8h)
    if (isDHL) {
      if (userAssignment?.dhl_position?.position_type === 'technik') {
        return 8; // Technik positions have 8h standard
      }
      return 6; // DHL default: 30h/week ÷ 5 days = 6h per day
    }

    // Default for other companies
    return 8;
  };

  // Filter shifts for current month if specified
  const filteredShifts = useMemo(() => {
    if (!shifts.length) return [];
    
    if (month !== undefined && year !== undefined) {
      return shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.getMonth() === month && shiftDate.getFullYear() === year;
      });
    }
    
    // Default to current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
    });
  }, [shifts, month, year]);

  // Calculate overtime data
  useEffect(() => {
    if (!filteredShifts.length) {
      setOvertimeData({
        morning: 0,
        afternoon: 0,
        night: 0,
        total: 0
      });
      return;
    }

    // Check if DHL Wechselschicht position (30h/week)
    const isWechselschicht = isDHL && isDHLWechselschichtPosition(
      company, 
      userAssignment?.dhl_position?.position_type,
      userAssignment?.dhl_position?.name
    );
    
    if (isWechselschicht) {
      // For DHL Wechselschicht: calculate weekly overtime (30h/week standard)
      const totalWeeklyHours = filteredShifts.reduce((total, shift) => {
        return total + calculateShiftDuration(shift.start_time, shift.end_time);
      }, 0);
      
      const weeklyOvertime = Math.max(0, totalWeeklyHours - 30);
      
      // Distribute weekly overtime proportionally by shift type
      const totalActualHours = totalWeeklyHours || 1; // Avoid division by zero
      const overtimeByType = {
        morning: 0,
        afternoon: 0,
        night: 0
      };
      
      filteredShifts.forEach(shift => {
        const shiftHours = calculateShiftDuration(shift.start_time, shift.end_time);
        const proportion = shiftHours / totalActualHours;
        overtimeByType[shift.type] += weeklyOvertime * proportion;
      });

      setOvertimeData({
        morning: Math.round(overtimeByType.morning * 10) / 10,
        afternoon: Math.round(overtimeByType.afternoon * 10) / 10,
        night: Math.round(overtimeByType.night * 10) / 10,
        total: Math.round(weeklyOvertime * 10) / 10
      });
    } else {
      // For other positions: calculate daily overtime
      const shiftsWithOvertime = filteredShifts.map(shift => {
        const actualHours = calculateShiftDuration(shift.start_time, shift.end_time);
        const standardHours = getStandardHours(shift.type, userAssignment?.dhl_position);
        const overtime = Math.max(0, actualHours - standardHours);
        
        return {
          ...shift,
          actualHours,
          standardHours,
          overtime
        };
      });

      // Group overtime by shift type
      const overtimeByType = {
        morning: 0,
        afternoon: 0,
        night: 0
      };

      shiftsWithOvertime.forEach(shift => {
        overtimeByType[shift.type] += shift.overtime;
      });

      const total = overtimeByType.morning + overtimeByType.afternoon + overtimeByType.night;

      setOvertimeData({
        morning: Math.round(overtimeByType.morning * 10) / 10,
        afternoon: Math.round(overtimeByType.afternoon * 10) / 10,
        night: Math.round(overtimeByType.night * 10) / 10,
        total: Math.round(total * 10) / 10
      });
    }

  }, [filteredShifts, userAssignment, isDHL]);

  return {
    overtimeData,
    isLoading: shiftsLoading,
    error: shiftsError,
    company,
    isDHL,
    shiftsCount: filteredShifts.length
  };
};
import { useState, useEffect, useMemo } from 'react';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { useCompany } from '@/hooks/useCompany';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { calculateShiftDuration, calculateOvertimeForShift, getOvertimeStatsByType } from '@/utils/overtimeCalculations';
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
}

export const useOvertimeData = ({ userId, month, year }: UseOvertimeDataOptions) => {
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
    if (isDHL && userAssignment) {
      // DHL Wechselschicht has 30h/week = 6h per day standard
      if (userAssignment.dhl_position?.position_type === 'technik') {
        return 8; // Technik positions have 8h standard
      }
      // Wechselschicht and other DHL positions
      return 6; // 30h/week ÷ 5 days = 6h per day
    }
    
    // Default for Adecco, Randstad and others
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

    // Calculate overtime for each shift with company-specific standards
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
      morning: Math.round(overtimeByType.morning * 10) / 10, // Round to 1 decimal
      afternoon: Math.round(overtimeByType.afternoon * 10) / 10,
      night: Math.round(overtimeByType.night * 10) / 10,
      total: Math.round(total * 10) / 10
    });

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
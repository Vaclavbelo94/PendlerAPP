
import { useMemo } from 'react';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { DHLUserAssignment } from '@/hooks/dhl/useDHLData';

interface DHLShift extends Shift {
  isDHLManaged?: boolean;
  dhl_position_name?: string;
  dhl_work_group_name?: string;
  original_dhl_data?: any;
}

export const useDHLShiftsIntegration = (
  shifts: Shift[], 
  userAssignment: DHLUserAssignment | null
) => {
  const enhancedShifts = useMemo(() => {
    if (!userAssignment) return shifts;

    return shifts.map(shift => {
      const dhlShift: DHLShift = {
        ...shift,
        isDHLManaged: shift.is_dhl_managed || false,
        dhl_position_name: userAssignment.dhl_position?.name,
        dhl_work_group_name: userAssignment.dhl_work_group?.name,
        original_dhl_data: shift.original_dhl_data
      };
      return dhlShift;
    });
  }, [shifts, userAssignment]);

  const dhlStats = useMemo(() => {
    const dhlShifts = enhancedShifts.filter(s => (s as DHLShift).isDHLManaged);
    const manualShifts = enhancedShifts.filter(s => !(s as DHLShift).isDHLManaged);

    return {
      totalShifts: enhancedShifts.length,
      dhlManagedShifts: dhlShifts.length,
      manualShifts: manualShifts.length,
      dhlPosition: userAssignment?.dhl_position?.name || 'Neznámá pozice',
      workGroup: userAssignment?.dhl_work_group?.name || 'Neznámá skupina'
    };
  }, [enhancedShifts, userAssignment]);

  return {
    enhancedShifts,
    dhlStats,
    hasDHLData: !!userAssignment
  };
};


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DHLShift, DHLShiftTemplate } from '@/types/dhl';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

interface UseDHLShiftsReturn {
  dhlShifts: DHLShift[];
  shiftTemplates: DHLShiftTemplate[];
  isLoading: boolean;
  error: string | null;
  generateDHLShifts: (startDate: string, endDate: string) => Promise<void>;
  overrideDHLShift: (shiftId: string, overrideData: Partial<DHLShift>) => Promise<void>;
  restoreDHLShift: (shiftId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useDHLShifts = (userId?: string): UseDHLShiftsReturn => {
  const [dhlShifts, setDhlShifts] = useState<DHLShift[]>([]);
  const [shiftTemplates, setShiftTemplates] = useState<DHLShiftTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useStandardizedToast();

  const fetchDHLData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user's DHL assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (assignmentError) throw assignmentError;

      if (!assignment) {
        setDhlShifts([]);
        setShiftTemplates([]);
        setIsLoading(false);
        return;
      }

      // Fetch DHL-managed shifts
      const { data: shifts, error: shiftsError } = await supabase
        .from('shifts')
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .eq('user_id', userId)
        .eq('is_dhl_managed', true)
        .order('date', { ascending: true });

      if (shiftsError) throw shiftsError;

      // Convert and validate shift data
      const validatedShifts: DHLShift[] = (shifts || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night' // Type assertion for database compatibility
      }));

      // Fetch shift templates for user's assignment
      const { data: templates, error: templatesError } = await supabase
        .from('dhl_shift_templates')
        .select(`
          *,
          position:dhl_positions(*),
          work_group:dhl_work_groups(*)
        `)
        .eq('position_id', assignment.dhl_position_id)
        .eq('work_group_id', assignment.dhl_work_group_id)
        .order('day_of_week');

      if (templatesError) throw templatesError;

      setDhlShifts(validatedShifts);
      setShiftTemplates(templates || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se načíst DHL směny';
      setError(errorMessage);
      showError('Chyba', errorMessage);
      console.error('Error fetching DHL shifts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, showError]);

  const generateDHLShifts = useCallback(async (startDate: string, endDate: string) => {
    if (!userId || shiftTemplates.length === 0) return;

    try {
      setIsLoading(true);

      // Get user's DHL assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (assignmentError) throw assignmentError;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const shifts: Omit<DHLShift, 'id' | 'created_at' | 'updated_at'>[] = [];

      // Generate shifts for each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0];

        // Find templates for this day of week
        const dayTemplates = shiftTemplates.filter(t => t.day_of_week === dayOfWeek);

        for (const template of dayTemplates) {
          // Determine shift type based on start time
          let shiftType: 'morning' | 'afternoon' | 'night' = 'morning';
          const startHour = parseInt(template.start_time.split(':')[0]);
          
          if (startHour >= 6 && startHour < 14) {
            shiftType = 'morning';
          } else if (startHour >= 14 && startHour < 22) {
            shiftType = 'afternoon';
          } else {
            shiftType = 'night';
          }

          shifts.push({
            user_id: userId,
            date: dateString,
            type: shiftType,
            notes: `Automaticky vygenerováno - ${template.start_time} - ${template.end_time}`,
            dhl_position_id: assignment.dhl_position_id,
            dhl_work_group_id: assignment.dhl_work_group_id,
            is_dhl_managed: true,
            dhl_override: false,
            original_dhl_data: {
              template_id: template.id,
              start_time: template.start_time,
              end_time: template.end_time,
              break_duration: template.break_duration
            }
          });
        }
      }

      if (shifts.length > 0) {
        const { error: insertError } = await supabase
          .from('shifts')
          .insert(shifts);

        if (insertError) throw insertError;

        success('DHL směny vygenerovány', `Vytvořeno ${shifts.length} směn pro období ${startDate} - ${endDate}`);
        await fetchDHLData();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se vygenerovat DHL směny';
      showError('Chyba', errorMessage);
      console.error('Error generating DHL shifts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, shiftTemplates, success, showError, fetchDHLData]);

  const overrideDHLShift = useCallback(async (shiftId: string, overrideData: Partial<DHLShift>) => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .update({
          ...overrideData,
          dhl_override: true
        })
        .eq('id', shiftId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      success('Směna upravena', 'DHL směna byla úspěšně přepsána');
      await fetchDHLData();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se upravit směnu';
      showError('Chyba', errorMessage);
      console.error('Error overriding DHL shift:', err);
    }
  }, [userId, success, showError, fetchDHLData]);

  const restoreDHLShift = useCallback(async (shiftId: string) => {
    try {
      const shift = dhlShifts.find(s => s.id === shiftId);
      if (!shift || !shift.original_dhl_data) return;

      const { error } = await supabase
        .from('shifts')
        .update({
          type: shift.type, // Keep original type
          notes: `Automaticky vygenerováno - ${shift.original_dhl_data.start_time} - ${shift.original_dhl_data.end_time}`,
          dhl_override: false
        })
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (error) throw error;

      success('Směna obnovena', 'DHL směna byla obnovena na původní stav');
      await fetchDHLData();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se obnovit směnu';
      showError('Chyba', errorMessage);
      console.error('Error restoring DHL shift:', err);
    }
  }, [userId, dhlShifts, success, showError, fetchDHLData]);

  useEffect(() => {
    fetchDHLData();
  }, [fetchDHLData]);

  return {
    dhlShifts,
    shiftTemplates,
    isLoading,
    error,
    generateDHLShifts,
    overrideDHLShift,
    restoreDHLShift,
    refetch: fetchDHLData
  };
};

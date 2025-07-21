import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface WechselschichtPattern {
  id: string;
  woche_number: number;
  pattern_name: string;
  monday_shift: string | null;
  tuesday_shift: string | null;
  wednesday_shift: string | null;
  thursday_shift: string | null;
  friday_shift: string | null;
  saturday_shift: string | null;
  sunday_shift: string | null;
  morning_start_time: string;
  morning_end_time: string;
  afternoon_start_time: string;
  afternoon_end_time: string;
  night_start_time: string;
  night_end_time: string;
}

interface UserAssignment {
  id: string;
  current_woche: number;
  dhl_position_id: string;
  dhl_work_group_id: string;
  position: {
    name: string;
    position_type: string;
  };
}

interface GeneratedShift {
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  woche_number: number;
  pattern_name?: string;
  is_wechselschicht_generated: boolean;
  has_time_override?: boolean;
}

export const useWechselschichtGenerator = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPreview, setGenerationPreview] = useState<GeneratedShift[]>([]);

  const checkUserEligibility = async () => {
    if (!user) {
      toast.error("Uživatel není přihlášen");
      return null;
    }

    const { data: assignment, error } = await supabase
      .from('user_dhl_assignments')
      .select(`
        id,
        current_woche,
        dhl_position_id,
        dhl_work_group_id,
        dhl_positions!inner(name, position_type)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error || !assignment) {
      toast.error("Uživatel nemá aktivní DHL assignment");
      return null;
    }

    // Check if user has Wechselschicht position (30h indicates Wechselschicht)
    const positionName = assignment.dhl_positions.name.toLowerCase();
    if (!positionName.includes('wechselschicht') && !positionName.includes('30h')) {
      toast.error("Uživatel není na Wechselschicht pozici");
      return null;
    }

    return {
      id: assignment.id,
      current_woche: assignment.current_woche,
      dhl_position_id: assignment.dhl_position_id,
      dhl_work_group_id: assignment.dhl_work_group_id,
      position: assignment.dhl_positions
    } as UserAssignment;
  };

  const getNextWoche = (currentWoche: number): number => {
    return currentWoche >= 15 ? 1 : currentWoche + 1;
  };

  const getShiftTimes = (shiftType: string, pattern: WechselschichtPattern) => {
    switch (shiftType.toLowerCase()) {
      case 'ranní':
      case 'morning':
        return {
          start_time: pattern.morning_start_time,
          end_time: pattern.morning_end_time
        };
      case 'odpolední':
      case 'afternoon':
        return {
          start_time: pattern.afternoon_start_time,
          end_time: pattern.afternoon_end_time
        };
      case 'noční':
      case 'night':
        return {
          start_time: pattern.night_start_time,
          end_time: pattern.night_end_time
        };
      default:
        return null;
    }
  };

  const checkForTimeChanges = async (wocheNumber: number, calendarWeek: number, date: string) => {
    const { data: timeChanges } = await supabase
      .from('dhl_shift_time_changes')
      .select('*')
      .or(`and(woche_number.eq.${wocheNumber},calendar_week.eq.${calendarWeek}),and(affects_all_woche.eq.true,calendar_week.eq.${calendarWeek})`)
      .order('created_at', { ascending: false })
      .limit(1);

    return timeChanges?.[0] || null;
  };

  const generateShiftsPreview = async (weeksToGenerate: number = 4) => {
    try {
      const assignment = await checkUserEligibility();
      if (!assignment) return [];

      const generatedShifts: GeneratedShift[] = [];
      
      // Start from current Monday
      const today = new Date();
      const currentDay = today.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // 0 = Sunday
      const startMonday = new Date(today);
      startMonday.setDate(today.getDate() + mondayOffset);

      // Get all active patterns at once for better performance
      const { data: patterns, error: patternsError } = await supabase
        .from('dhl_wechselschicht_patterns')
        .select('*')
        .eq('is_active', true)
        .order('woche_number');

      if (patternsError || !patterns) {
        toast.error('Chyba při načítání vzorců směn');
        return [];
      }

      for (let week = 0; week < weeksToGenerate; week++) {
        // Calculate current woche using correct 15-week rotation
        const currentWoche = ((assignment.current_woche - 1 + week) % 15) + 1;
        
        // Find pattern for current woche
        const pattern = patterns.find(p => p.woche_number === currentWoche);
        if (!pattern) {
          console.log(`Pattern for Woche ${currentWoche} not found`);
          continue;
        }

        // Calculate week start date and calendar week
        const weekStart = new Date(startMonday);
        weekStart.setDate(startMonday.getDate() + (week * 7));
        
        // Calculate calendar week
        const yearStart = new Date(weekStart.getFullYear(), 0, 1);
        const calendarWeek = Math.ceil(((weekStart.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7);

        // Check for time changes/exceptions for this week
        const timeChange = await checkForTimeChanges(currentWoche, calendarWeek, weekStart.toISOString().split('T')[0]);

        // Generate shifts for Monday to Friday (skip weekends as they're 'volno')
        const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const dayShifts = [
          pattern.monday_shift,
          pattern.tuesday_shift,
          pattern.wednesday_shift,
          pattern.thursday_shift,
          pattern.friday_shift
        ];

        weekDays.forEach((dayName, dayIndex) => {
          const shiftType = dayShifts[dayIndex];
          if (!shiftType || shiftType.toLowerCase() === 'volno') return;

          const shiftDate = new Date(weekStart);
          shiftDate.setDate(weekStart.getDate() + dayIndex);

          // Get base shift times
          let times = getShiftTimes(shiftType, pattern);
          if (!times) return;

          let hasTimeOverride = false;

          // Apply time changes if they exist
          if (timeChange) {
            // Check if this day is marked as day off
            if (timeChange.is_day_off && timeChange.affected_days?.includes(dayName)) {
              return; // Skip this day - it's marked as day off
            }
            
            // Apply time changes if this day is affected
            if (timeChange.affected_days?.includes(dayName) || timeChange.affected_days?.length === 0) {
              times = {
                start_time: timeChange.new_start_time,
                end_time: timeChange.new_end_time
              };
              hasTimeOverride = true;
            }
          }

          // Convert Czech shift names to standard types
          let standardType: string;
          switch (shiftType.toLowerCase()) {
            case 'ranní':
              standardType = 'morning';
              break;
            case 'odpolední':
              standardType = 'afternoon';
              break;
            case 'noční':
              standardType = 'night';
              break;
            default:
              standardType = shiftType;
          }

          generatedShifts.push({
            user_id: assignment.id,
            date: shiftDate.toISOString().split('T')[0],
            start_time: times.start_time,
            end_time: times.end_time,
            type: standardType,
            woche_number: currentWoche,
            pattern_name: pattern.pattern_name,
            is_wechselschicht_generated: true,
            has_time_override: hasTimeOverride
          });
        });
      }

      setGenerationPreview(generatedShifts);
      return generatedShifts;
    } catch (error) {
      console.error('Error generating shifts preview:', error);
      toast.error('Chyba při generování náhledu směn');
      return [];
    }
  };

  const executeGeneration = async (shifts: GeneratedShift[]) => {
    if (!user) return false;

    setIsGenerating(true);
    try {
      // Check for existing shifts in the date range
      const dateRange = shifts.map(s => s.date);
      const { data: existingShifts } = await supabase
        .from('shifts')
        .select('date')
        .eq('user_id', user.id)
        .in('date', dateRange);

      // Filter out dates that already have shifts
      const existingDates = new Set(existingShifts?.map(s => s.date) || []);
      const newShifts = shifts.filter(s => !existingDates.has(s.date));

      if (newShifts.length === 0) {
        toast.info("Všechny směny pro zvolené období již existují");
        return true;
      }

      // Insert new shifts
      const shiftsToInsert = newShifts.map(shift => ({
        user_id: user.id,
        date: shift.date,
        start_time: shift.start_time,
        end_time: shift.end_time,
        type: shift.type,
        notes: `${shift.pattern_name || `Woche ${shift.woche_number}`} - Automaticky generováno${shift.has_time_override ? ' (upravené časy)' : ''}`,
        is_wechselschicht_generated: true
      }));

      const { error } = await supabase
        .from('shifts')
        .insert(shiftsToInsert);

      if (error) {
        console.error('Chyba při generování směn:', error);
        toast.error("Chyba při generování směn");
        return false;
      }

      toast.success(`Vygenerováno ${newShifts.length} nových směn`);
      setGenerationPreview([]);
      
      // Call success callback to refresh shifts
      if (onSuccess) {
        onSuccess();
      }
      
      return true;

    } catch (error) {
      console.error('Neočekávaná chyba:', error);
      toast.error("Neočekávaná chyba při generování směn");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    checkUserEligibility,
    generateShiftsPreview,
    executeGeneration,
    isGenerating,
    generationPreview,
    setGenerationPreview
  };
};
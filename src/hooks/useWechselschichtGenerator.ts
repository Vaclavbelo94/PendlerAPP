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
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  woche_number: number;
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

  const generateShiftsPreview = async (weeksToGenerate: number = 4) => {
    const assignment = await checkUserEligibility();
    if (!assignment) return [];

    const generatedShifts: GeneratedShift[] = [];
    let currentWoche = assignment.current_woche;
    
    // Start from current Monday
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // 0 = Sunday
    const startMonday = new Date(today);
    startMonday.setDate(today.getDate() + mondayOffset);

    for (let week = 0; week < weeksToGenerate; week++) {
      // Get pattern for current woche
      const { data: pattern, error } = await supabase
        .from('dhl_wechselschicht_patterns')
        .select('*')
        .eq('woche_number', currentWoche)
        .eq('is_active', true)
        .single();

      if (error || !pattern) {
        toast.error(`Vzorec pro Woche ${currentWoche} nebyl nalezen`);
        continue;
      }

      // Generate shifts for each day of the week
      const weekStart = new Date(startMonday);
      weekStart.setDate(startMonday.getDate() + (week * 7));

      const dayShifts = [
        pattern.monday_shift,
        pattern.tuesday_shift,
        pattern.wednesday_shift,
        pattern.thursday_shift,
        pattern.friday_shift,
        pattern.saturday_shift,
        pattern.sunday_shift
      ];

      dayShifts.forEach((shiftType, dayIndex) => {
        if (shiftType && shiftType.toLowerCase() !== 'volno' && shiftType.toLowerCase() !== 'free') {
          const shiftDate = new Date(weekStart);
          shiftDate.setDate(weekStart.getDate() + dayIndex);

          const times = getShiftTimes(shiftType, pattern);
          if (times) {
            generatedShifts.push({
              date: shiftDate.toISOString().split('T')[0],
              start_time: times.start_time,
              end_time: times.end_time,
              type: shiftType,
              woche_number: currentWoche
            });
          }
        }
      });

      currentWoche = getNextWoche(currentWoche);
    }

    setGenerationPreview(generatedShifts);
    return generatedShifts;
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
        notes: `Woche ${shift.woche_number} - Automaticky generováno`,
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
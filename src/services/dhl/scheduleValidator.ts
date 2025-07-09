
import { supabase } from '@/integrations/supabase/client';

export interface ValidationError {
  field: string;
  message: string;
  line?: number;
}

export interface ValidationWarning {
  field: string;
  message: string;
  line?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: {
    totalDays: number;
    totalShifts: number;
    dateRange: { start: string; end: string } | null;
    detectedWoche: number | null;
  };
}

/**
 * Validate DHL schedule data before import
 */
export const validateScheduleData = async (
  data: any, 
  fileName: string,
  positionId?: string
): Promise<ValidationResult> => {
  console.log('Validating schedule data:', { data, fileName, positionId });
  
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let totalDays = 0;
  let totalShifts = 0;
  let detectedWoche: number | null = null;
  let dateRange: { start: string; end: string } | null = null;

  try {
    // Basic structure validation
    if (!data || typeof data !== 'object') {
      errors.push({
        field: 'root',
        message: 'Neplatný formát dat - očekává se JSON objekt'
      });
      return { isValid: false, errors, warnings, summary: { totalDays, totalShifts, dateRange, detectedWoche } };
    }

    // Detect Wechselschicht format (calendar weeks)
    if (Array.isArray(data) && data.length > 0 && data[0].kalenderwoche) {
      console.log('Detected Wechselschicht 30h format');
      
      // Group by woche to find which groups are present
      const wochenGroups = new Set();
      let totalWorkDays = 0;
      
      data.forEach((entry: any) => {
        if (entry.woche) {
          wochenGroups.add(entry.woche);
        }
        if (entry.start && entry.start !== null) {
          totalWorkDays++;
        }
      });
      
      totalShifts = totalWorkDays;
      detectedWoche = wochenGroups.size === 1 ? Array.from(wochenGroups)[0] as number : null;
      
      // Extract date range from calendar weeks
      const kalenderWochen = data.map((entry: any) => entry.kalenderwoche).filter(Boolean);
      if (kalenderWochen.length > 0) {
        const uniqueWeeks = [...new Set(kalenderWochen)].sort();
        warnings.push({
          field: 'dateRange',
          message: `Detekován roční plán: ${uniqueWeeks[0]} - ${uniqueWeeks[uniqueWeeks.length - 1]} (${uniqueWeeks.length} týdnů)`
        });
      }
      
      // Validate Wechselschicht structure
      for (const entry of data) {
        if (!entry.kalenderwoche || !entry.woche || !entry.den) {
          errors.push({
            field: 'structure',
            message: 'Chybí povinná pole: kalenderwoche, woche, nebo den'
          });
          break;
        }
        
        // Validate German day names
        const validDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        if (!validDays.includes(entry.den)) {
          errors.push({
            field: 'den',
            message: `Neplatný den "${entry.den}". Očekávané hodnoty: ${validDays.join(', ')}`
          });
        }
        
        // Validate woche range
        if (entry.woche < 1 || entry.woche > 15) {
          errors.push({
            field: 'woche',
            message: `Neplatný týden ${entry.woche} - musí být mezi 1 a 15`
          });
        }
      }
      
      if (wochenGroups.size > 1) {
        warnings.push({
          field: 'multiple_groups',
          message: `Detekováno více pracovních skupin: ${Array.from(wochenGroups).sort().join(', ')}`
        });
      }
      
    } else if (data.shifts && Array.isArray(data.shifts)) {
      // New shifts format
      detectedWoche = data.woche;
      totalShifts = data.shifts.filter((shift: any) => shift.date && (shift.start || shift.start_time)).length;
      
      const validDates = data.shifts
        .filter((shift: any) => shift.date)
        .map((shift: any) => shift.date)
        .sort();
      
      if (validDates.length > 0) {
        dateRange = { start: validDates[0], end: validDates[validDates.length - 1] };
      }
    } else if (data.entries && Array.isArray(data.entries)) {
      // Entries format
      detectedWoche = data.entries.length > 0 ? data.entries[0].woche : null;
      totalShifts = data.entries.filter((entry: any) => entry.date && (entry.start || entry.start_time)).length;
      
      const validDates = data.entries
        .filter((entry: any) => entry.date)
        .map((entry: any) => entry.date)
        .sort();
      
      if (validDates.length > 0) {
        dateRange = { start: validDates[0], end: validDates[validDates.length - 1] };
      }
    } else {
      // Direct format
      detectedWoche = data.woche;
      
      // Count date-based shifts
      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      totalShifts = dateKeys.filter(key => data[key] && data[key].start_time).length;
      
      if (dateKeys.length > 0) {
        const sortedDates = dateKeys.sort();
        dateRange = { start: sortedDates[0], end: sortedDates[sortedDates.length - 1] };
      }
    }

    totalDays = totalShifts; // Each shift is typically one day

    // Validate woche is present
    if (!detectedWoche) {
      errors.push({
        field: 'woche',
        message: 'Chybí informace o týdnu (woche) v datech'
      });
    } else if (detectedWoche < 1 || detectedWoche > 15) {
      errors.push({
        field: 'woche',
        message: `Neplatný týden ${detectedWoche} - musí být mezi 1 a 15`
      });
    }

    // Validate against position's cycle weeks if position is provided
    if (positionId && detectedWoche) {
      try {
        const { data: position, error: positionError } = await supabase
          .from('dhl_positions')
          .select('name, cycle_weeks')
          .eq('id', positionId)
          .single();

        if (positionError) {
          warnings.push({
            field: 'position',
            message: 'Nelze ověřit kompatibilitu s pozicí - pozice nenalezena'
          });
        } else if (position.cycle_weeks && position.cycle_weeks.length > 0) {
          if (!position.cycle_weeks.includes(detectedWoche)) {
            errors.push({
              field: 'woche',
              message: `Týden ${detectedWoche} není podporován pozicí "${position.name}". Podporované týdny: ${position.cycle_weeks.join(', ')}`
            });
          }
        }
      } catch (positionValidationError) {
        console.error('Error validating position compatibility:', positionValidationError);
        warnings.push({
          field: 'position',
          message: 'Chyba při ověřování kompatibility s pozicí'
        });
      }
    }

    // Validate shifts have required fields
    if (totalShifts === 0) {
      errors.push({
        field: 'shifts',
        message: 'Nenalezeny žádné platné směny v datech'
      });
    }

    // Add warnings for common issues
    if (totalShifts < 5) {
      warnings.push({
        field: 'shifts',
        message: `Pouze ${totalShifts} směn nalezeno - je to správně?`
      });
    }

    if (!dateRange) {
      warnings.push({
        field: 'dates',
        message: 'Nelze určit časový rozsah směn'
      });
    }

    console.log('Validation completed:', {
      isValid: errors.length === 0,
      errors: errors.length,
      warnings: warnings.length,
      totalShifts,
      detectedWoche
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalDays,
        totalShifts,
        dateRange,
        detectedWoche
      }
    };

  } catch (error) {
    console.error('Validation error:', error);
    errors.push({
      field: 'validation',
      message: 'Chyba při validaci dat'
    });

    return {
      isValid: false,
      errors,
      warnings,
      summary: { totalDays, totalShifts, dateRange, detectedWoche }
    };
  }
};

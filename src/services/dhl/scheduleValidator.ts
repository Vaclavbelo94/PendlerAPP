import { parseTimeToMinutes } from '@/utils/dhl/wocheCalculator';

export interface ValidationError {
  field: string;
  message: string;
  line?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: {
    totalDays: number;
    totalShifts: number;
    dateRange: { start: string; end: string } | null;
    detectedWoche: number | null;
  };
}

/**
 * Convert entries-based JSON format to internal format
 */
const convertEntriesToInternalFormat = (data: any): any => {
  console.log('Converting entries format to internal format...');
  
  if (!data.entries || !Array.isArray(data.entries)) {
    console.log('No entries array found, assuming already in internal format');
    return data;
  }

  const converted: any = {
    base_date: data.base_date || null,
    woche: null, // Will be extracted from first entry
    position: data.position || null,
    description: data.description || null
  };

  // Convert entries to date-keyed format
  data.entries.forEach((entry: any, index: number) => {
    if (!entry.date) {
      console.warn(`Entry ${index} missing date field`);
      return;
    }

    // Extract Woche from first valid entry
    if (converted.woche === null && entry.woche) {
      converted.woche = entry.woche;
    }

    converted[entry.date] = {
      start_time: entry.start || entry.start_time,
      end_time: entry.end || entry.end_time,
      day: entry.day,
      woche: entry.woche
    };
  });

  console.log('Converted format:', converted);
  return converted;
};

/**
 * Validate imported DHL schedule JSON data
 */
export const validateScheduleData = (data: any, fileName: string): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let totalShifts = 0;
  let totalDays = 0;
  let minDate: string | null = null;
  let maxDate: string | null = null;
  let detectedWoche: number | null = null;

  console.log('=== SCHEDULE VALIDATION START ===');
  console.log('File name:', fileName);
  console.log('Original data structure:', data);

  // Check basic structure
  if (!data || typeof data !== 'object') {
    errors.push({
      field: 'root',
      message: 'Invalid JSON structure. Expected object.'
    });
    return {
      isValid: false,
      errors,
      warnings,
      summary: { totalDays: 0, totalShifts: 0, dateRange: null, detectedWoche: null }
    };
  }

  // Convert to internal format if needed
  const internalData = convertEntriesToInternalFormat(data);
  console.log('Using internal format:', internalData);

  // Check for required root fields
  if (internalData.base_date) {
    if (!isValidDate(internalData.base_date)) {
      errors.push({
        field: 'base_date',
        message: 'Invalid base_date format. Expected YYYY-MM-DD.'
      });
    }
  } else {
    warnings.push({
      field: 'base_date',
      message: 'No base_date found. Using current date as fallback.'
    });
  }

  if (internalData.woche) {
    const woche = parseInt(internalData.woche);
    if (isNaN(woche) || woche < 1 || woche > 15) {
      errors.push({
        field: 'woche',
        message: 'Invalid woche value. Must be between 1 and 15.'
      });
    } else {
      detectedWoche = woche;
    }
  } else {
    warnings.push({
      field: 'woche',
      message: 'No woche found. Please specify Woche number (1-15).'
    });
  }

  // Validate shift entries - improved to handle different JSON structures
  Object.keys(internalData).forEach(key => {
    console.log('Processing key:', key, 'Value:', internalData[key]);
    
    // Skip metadata fields
    if (['base_date', 'woche', 'position', 'description'].includes(key)) {
      return;
    }

    // Check if key is a date (YYYY-MM-DD format)
    if (isValidDate(key)) {
      totalDays++;
      
      // Track date range
      if (!minDate || key < minDate) minDate = key;
      if (!maxDate || key > maxDate) maxDate = key;

      const dayData = internalData[key];
      console.log('Processing date:', key, 'Data:', dayData);
      
      if (!dayData || typeof dayData !== 'object') {
        errors.push({
          field: key,
          message: 'Invalid day data structure. Expected object with shift information.'
        });
        return;
      }

      // Check for shift data - handle different possible structures
      let hasShiftData = false;
      
      // Check for direct time fields
      if (dayData.start_time || dayData.end_time) {
        hasShiftData = true;
        
        // Validate start time
        if (dayData.start_time) {
          if (!isValidTime(dayData.start_time)) {
            errors.push({
              field: `${key}.start_time`,
              message: `Invalid start_time format: "${dayData.start_time}". Expected HH:MM.`
            });
          }
        } else {
          warnings.push({
            field: `${key}.start_time`,
            message: 'Missing start_time for shift.'
          });
        }

        // Validate end time
        if (dayData.end_time) {
          if (!isValidTime(dayData.end_time)) {
            errors.push({
              field: `${key}.end_time`,
              message: `Invalid end_time format: "${dayData.end_time}". Expected HH:MM.`
            });
          }
        } else {
          warnings.push({
            field: `${key}.end_time`,
            message: 'Missing end_time for shift.'
          });
        }

        // Validate time logic
        if (dayData.start_time && dayData.end_time && isValidTime(dayData.start_time) && isValidTime(dayData.end_time)) {
          const startMinutes = parseTimeToMinutes(dayData.start_time);
          const endMinutes = parseTimeToMinutes(dayData.end_time);
          
          if (startMinutes >= endMinutes) {
            warnings.push({
              field: `${key}`,
              message: 'End time should be after start time (night shifts crossing midnight need special handling).'
            });
          }

          // Check for reasonable shift duration (4-12 hours)
          const durationMinutes = endMinutes > startMinutes ? 
            endMinutes - startMinutes : 
            (24 * 60) - startMinutes + endMinutes;
            
          if (durationMinutes < 240) { // Less than 4 hours
            warnings.push({
              field: `${key}`,
              message: `Shift duration is ${Math.round(durationMinutes/60)}h which is less than 4 hours.`
            });
          } else if (durationMinutes > 720) { // More than 12 hours
            warnings.push({
              field: `${key}`,
              message: `Shift duration is ${Math.round(durationMinutes/60)}h which is more than 12 hours.`
            });
          }
          
          totalShifts++;
        }
      }
      
      // Check for nested shift objects or arrays
      if (!hasShiftData) {
        const dayKeys = Object.keys(dayData);
        if (dayKeys.length > 0) {
          warnings.push({
            field: key,
            message: `Found data for ${key} but no recognizable shift structure. Expected start_time and end_time fields.`
          });
        }
      }

      // Check day of week consistency
      if (dayData.day) {
        const actualDay = new Date(key).toLocaleDateString('cs-CZ', { weekday: 'long' }).toLowerCase();
        const providedDay = dayData.day.toLowerCase();
        if (actualDay !== providedDay) {
          warnings.push({
            field: `${key}.day`,
            message: `Day mismatch: ${key} is ${actualDay}, but data says ${providedDay}.`
          });
        }
      }
    }
  });

  console.log('Validation summary:', {
    totalDays,
    totalShifts,
    dateRange: minDate && maxDate ? { start: minDate, end: maxDate } : null,
    detectedWoche,
    errorsCount: errors.length,
    warningsCount: warnings.length
  });

  // Check for empty schedule
  if (totalShifts === 0 && totalDays > 0) {
    warnings.push({
      field: 'schedule',
      message: `Found ${totalDays} date entries but no valid shifts. Check that each date has start_time and end_time fields.`
    });
  } else if (totalDays === 0) {
    errors.push({
      field: 'schedule',
      message: 'No date entries found. Schedule should contain dates in YYYY-MM-DD format.'
    });
  }

  // Check date consistency
  if (minDate && maxDate) {
    const daysDiff = Math.ceil((new Date(maxDate).getTime() - new Date(minDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 105) { // More than 15 weeks
      warnings.push({
        field: 'dateRange',
        message: `Schedule spans ${daysDiff} days (more than 15 weeks), which exceeds typical Woche cycle.`
      });
    }
  }

  console.log('=== SCHEDULE VALIDATION END ===');

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalDays,
      totalShifts,
      dateRange: minDate && maxDate ? { start: minDate, end: maxDate } : null,
      detectedWoche
    }
  };
};

/**
 * Check if string is valid date format (YYYY-MM-DD)
 */
const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime()) && 
         date.toISOString().split('T')[0] === dateStr;
};

/**
 * Check if string is valid time format (HH:MM or H:MM)
 */
const isValidTime = (timeStr: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
};

/**
 * Check if day name is valid
 */
const isValidDayOfWeek = (day: string): boolean => {
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return validDays.includes(day.toLowerCase());
};

/**
 * Extract metadata from schedule for preview - updated for entries format
 */
export const extractScheduleMetadata = (data: any) => {
  // Convert to internal format first
  const internalData = convertEntriesToInternalFormat(data);
  
  const metadata = {
    baseDate: internalData.base_date || null,
    woche: internalData.woche || null,
    position: internalData.position || null,
    description: internalData.description || null,
    shiftCount: 0,
    dateRange: null as { start: string; end: string } | null,
    weekDays: [] as string[]
  };

  const dates: string[] = [];
  const weekDays = new Set<string>();

  Object.keys(internalData).forEach(key => {
    if (isValidDate(key)) {
      dates.push(key);
      const date = new Date(key);
      const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'long' });
      weekDays.add(dayName);
      
      if (internalData[key] && (internalData[key].start_time || internalData[key].end_time)) {
        metadata.shiftCount++;
      }
    }
  });

  if (dates.length > 0) {
    dates.sort();
    metadata.dateRange = {
      start: dates[0],
      end: dates[dates.length - 1]
    };
  }

  metadata.weekDays = Array.from(weekDays);

  return metadata;
};

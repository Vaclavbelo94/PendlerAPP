import { ValidationResult } from './scheduleValidator';

export interface JsonFormatAnalysis {
  formatType: 'wechselschicht_yearly' | 'wechselschicht_weekly' | 'standard' | 'unknown';
  detectedGroups: number[];
  suggestedGroup?: number;
  suggestedName: string;
  calendarWeeks?: string[];
  totalRecords: number;
  workingDays: number;
  yearlyData?: boolean;
  confidence: number; // 0-100
  recommendations: string[];
}

/**
 * Intelligent JSON format detection and work group suggestion
 */
export const analyzeJsonFormat = (data: any, fileName: string): JsonFormatAnalysis => {
  console.log('Analyzing JSON format for:', fileName);
  
  const analysis: JsonFormatAnalysis = {
    formatType: 'unknown',
    detectedGroups: [],
    suggestedName: '',
    totalRecords: 0,
    workingDays: 0,
    confidence: 0,
    recommendations: []
  };

  if (!data) {
    return analysis;
  }

  // Detect Wechselschicht yearly format
  if (Array.isArray(data) && data.length > 0) {
    const firstEntry = data[0];
    
    // Check for Wechselschicht yearly format
    if (firstEntry.kalenderwoche && firstEntry.woche && firstEntry.den) {
      analysis.formatType = 'wechselschicht_yearly';
      analysis.totalRecords = data.length;
      
      // Analyze calendar weeks and work groups
      const wochenGroups = new Set<number>();
      const kalenderWochen = new Set<string>();
      let workingEntries = 0;
      
      data.forEach((entry: any) => {
        if (entry.woche) {
          wochenGroups.add(entry.woche);
        }
        if (entry.kalenderwoche) {
          kalenderWochen.add(entry.kalenderwoche);
        }
        if (entry.start && entry.start !== null) {
          workingEntries++;
        }
      });
      
      analysis.detectedGroups = Array.from(wochenGroups).sort((a, b) => a - b);
      analysis.calendarWeeks = Array.from(kalenderWochen).sort();
      analysis.workingDays = workingEntries;
      analysis.yearlyData = kalenderWochen.size >= 50; // Likely full year
      
      // Determine confidence based on data completeness
      if (analysis.detectedGroups.length === 15 && kalenderWochen.size >= 52) {
        analysis.confidence = 95;
        analysis.recommendations.push('🎯 Kompletní roční plán pro všech 15 pracovních skupin');
        analysis.suggestedName = `Wechselschicht 30h - Kompletní ${new Date().getFullYear()}`;
      } else if (analysis.detectedGroups.length === 1) {
        analysis.confidence = 90;
        analysis.suggestedGroup = analysis.detectedGroups[0];
        analysis.recommendations.push(`🎯 Plán pouze pro pracovní skupinu ${analysis.suggestedGroup}`);
        analysis.suggestedName = `Wechselschicht 30h - Skupina ${analysis.suggestedGroup} - ${new Date().getFullYear()}`;
      } else if (analysis.detectedGroups.length > 1 && analysis.detectedGroups.length < 15) {
        analysis.confidence = 85;
        analysis.recommendations.push(`🔄 Částečný plán pro ${analysis.detectedGroups.length} pracovních skupin (${analysis.detectedGroups.join(', ')})`);
        analysis.suggestedName = `Wechselschicht 30h - Skupiny ${analysis.detectedGroups.join(',')} - ${new Date().getFullYear()}`;
      } else {
        analysis.confidence = 70;
        analysis.recommendations.push('⚠️ Neočekávaný počet pracovních skupin v datech');
      }
      
      // Add analysis details
      if (analysis.yearlyData) {
        analysis.recommendations.push(`📅 Roční data: ${analysis.calendarWeeks![0]} - ${analysis.calendarWeeks![analysis.calendarWeeks!.length - 1]}`);
      }
      analysis.recommendations.push(`💼 ${analysis.workingDays} pracovních směn z ${analysis.totalRecords} záznamů`);
      
      return analysis;
    }
  }

  // Check for shifts format
  if (data.shifts && Array.isArray(data.shifts)) {
    analysis.formatType = 'standard';
    analysis.confidence = 80;
    analysis.totalRecords = data.shifts.length;
    analysis.workingDays = data.shifts.filter((shift: any) => shift.date && (shift.start || shift.start_time)).length;
    
    if (data.woche) {
      analysis.detectedGroups = [data.woche];
      analysis.suggestedGroup = data.woche;
      analysis.suggestedName = `Plán směn - Skupina ${data.woche}`;
    } else {
      analysis.suggestedName = 'Plán směn - Standardní formát';
    }
    
    analysis.recommendations.push('📋 Standardní formát s polem "shifts"');
    return analysis;
  }

  // Check for entries format
  if (data.entries && Array.isArray(data.entries)) {
    analysis.formatType = 'standard';
    analysis.confidence = 75;
    analysis.totalRecords = data.entries.length;
    analysis.workingDays = data.entries.filter((entry: any) => entry.date && (entry.start || entry.start_time)).length;
    
    if (data.entries.length > 0 && data.entries[0].woche) {
      analysis.detectedGroups = [data.entries[0].woche];
      analysis.suggestedGroup = data.entries[0].woche;
      analysis.suggestedName = `Plán směn - Skupina ${data.entries[0].woche}`;
    } else {
      analysis.suggestedName = 'Plán směn - Formát entries';
    }
    
    analysis.recommendations.push('📋 Standardní formát s polem "entries"');
    return analysis;
  }

  // Check for direct format (date keys)
  const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
  if (dateKeys.length > 0) {
    analysis.formatType = 'standard';
    analysis.confidence = 70;
    analysis.totalRecords = dateKeys.length;
    analysis.workingDays = dateKeys.filter(key => data[key] && data[key].start_time).length;
    
    if (data.woche) {
      analysis.detectedGroups = [data.woche];
      analysis.suggestedGroup = data.woche;
      analysis.suggestedName = `Plán směn - Skupina ${data.woche}`;
    } else {
      analysis.suggestedName = 'Plán směn - Přímý formát';
    }
    
    analysis.recommendations.push('📋 Přímý formát s datum klíči');
    return analysis;
  }

  // Unknown format
  analysis.confidence = 0;
  analysis.recommendations.push('❌ Nerozpoznaný formát JSON souboru');
  analysis.recommendations.push('💡 Zkontrolujte, zda soubor obsahuje podporovaná pole');
  
  return analysis;
};

/**
 * Smart work group suggestion based on filename and existing data
 */
export const suggestWorkGroupFromFilename = (fileName: string, detectedGroups: number[]): number | null => {
  // Extract numbers from filename
  const numbers = fileName.match(/\d+/g);
  if (!numbers) return null;
  
  // Look for group indicators in filename
  const groupPatterns = [
    /(?:gruppe|group|woche|week)[-_\s]*(\d{1,2})/i,
    /w(\d{1,2})/i,
    /g(\d{1,2})/i
  ];
  
  for (const pattern of groupPatterns) {
    const match = fileName.match(pattern);
    if (match) {
      const groupNum = parseInt(match[1]);
      if (groupNum >= 1 && groupNum <= 15) {
        return groupNum;
      }
    }
  }
  
  // If we have detected groups and only one, use it
  if (detectedGroups.length === 1) {
    return detectedGroups[0];
  }
  
  return null;
};

import { DHLPosition, DHLWorkGroup, DHLShiftTemplate, DHLPositionType } from '@/types/dhl';

// Konstanta pro mapování čísel dní na názvy
export const DAY_NAMES = {
  0: 'Neděle',
  1: 'Pondělí',
  2: 'Úterý',
  3: 'Středa',
  4: 'Čtvrtek',
  5: 'Pátek',
  6: 'Sobota'
} as const;

// Konstanta pro mapování typů pozic na české názvy
export const POSITION_TYPE_NAMES: Record<DHLPositionType, string> = {
  technik: 'Technik',
  rangierer: 'Rangierer',
  verlader: 'Verlader',
  sortierer: 'Sortierer',
  fahrer: 'Fahrer',
  other: 'Ostatní'
};

// Funkce pro formátování času
export const formatTime = (time: string): string => {
  return time.slice(0, 5); // "HH:MM:SS" -> "HH:MM"
};

// Funkce pro výpočet délky směny v hodinách
export const calculateShiftDuration = (startTime: string, endTime: string, breakDuration: number = 30): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = durationMs / (1000 * 60);
  return Math.max(0, (durationMinutes - breakDuration) / 60);
};

// Funkce pro kontrolu, zda je uživatel přiřazen k DHL
export const isUserDHLAssigned = (assignments: any[]): boolean => {
  return assignments && assignments.length > 0 && assignments.some(a => a.is_active);
};

// Funkce pro získání aktivního DHL přiřazení uživatele  
export const getUserActiveDHLAssignment = (assignments: any[]) => {
  return assignments?.find(assignment => assignment.is_active);
};

// Funkce pro generování týdenního vzoru směn
export const generateWeeklyShiftPattern = (templates: DHLShiftTemplate[]): Record<number, DHLShiftTemplate[]> => {
  const pattern: Record<number, DHLShiftTemplate[]> = {};
  
  for (let day = 0; day <= 6; day++) {
    pattern[day] = templates.filter(template => template.day_of_week === day);
  }
  
  return pattern;
};

// Funkce pro kontrolu konfliktu směn
export const hasShiftConflict = (shift1: { start_time: string; end_time: string }, shift2: { start_time: string; end_time: string }): boolean => {
  const start1 = new Date(`2000-01-01T${shift1.start_time}`);
  const end1 = new Date(`2000-01-01T${shift1.end_time}`);
  const start2 = new Date(`2000-01-01T${shift2.start_time}`);
  const end2 = new Date(`2000-01-01T${shift2.end_time}`);

  return start1 < end2 && start2 < end1;
};

// Funkce pro validaci DHL2026 promo kódu
export const isDHL2026PromoCode = (code: string): boolean => {
  return code.trim().toUpperCase() === 'DHL2026';
};

// Funkce pro generování automatického názvu směny
export const generateShiftName = (position: DHLPosition, workGroup: DHLWorkGroup, date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('cs-CZ', { 
    day: '2-digit', 
    month: '2-digit' 
  });
  return `${position.name} - ${workGroup.name} (${formattedDate})`;
};

// Funkce pro výpočet týdenní hodinové dotace
export const calculateWeeklyHours = (templates: DHLShiftTemplate[]): number => {
  return templates.reduce((total, template) => {
    return total + calculateShiftDuration(template.start_time, template.end_time, template.break_duration);
  }, 0);
};

// Funkce pro kontrolu, zda je datum v budoucnosti
export const isFutureDate = (date: string): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= today;
};

// Funkce pro formátování mzdy
export const formatHourlyRate = (rate?: number): string => {
  if (!rate) return 'Neuvedeno';
  return `${rate.toFixed(2)} €/hod`;
};

// Funkce pro získání barvy podle typu pozice
export const getPositionTypeColor = (type: DHLPositionType): string => {
  const colors: Record<DHLPositionType, string> = {
    technik: 'bg-blue-100 text-blue-800',
    rangierer: 'bg-green-100 text-green-800',
    verlader: 'bg-orange-100 text-orange-800',
    sortierer: 'bg-purple-100 text-purple-800',
    fahrer: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  };
  return colors[type] || colors.other;
};

// Funkce pro získání ikony podle typu pozice
export const getPositionTypeIcon = (type: DHLPositionType): string => {
  const icons: Record<DHLPositionType, string> = {
    technik: '🔧',
    rangierer: '🚛',
    verlader: '📦',
    sortierer: '📋',
    fahrer: '🚐',
    other: '👷'
  };
  return icons[type] || icons.other;
};

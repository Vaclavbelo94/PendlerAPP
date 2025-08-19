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
  rangierer: 'Rangiérer', 
  verlader: 'Verlader',
  sortierer: 'Sortiérer',
  fahrer: 'Řidič',
  pakettiere: 'Pakettiere',
  cutter: 'Cutter',
  shipper: 'Shipper',
  buehne: 'Bühne',
  teamleiter: 'Vedoucí týmu',
  standortleiter: 'Vedoucí stanoviště',
  schichtleiter: 'Vedoucí směny',
  wartung: 'Údržba',
  qualitaetskontrolle: 'Kontrola kvality',
  reinigung: 'Úklid',
  andere: 'Jiné',
  other: 'Ostatní'
};

// Funkce pro získání názvu dne v týdnu z čísla
export const getDayName = (dayNumber: number): string => {
  return DAY_NAMES[dayNumber as keyof typeof DAY_NAMES] || 'Neznámý den';
};

// Funkce pro získání českého názvu pozice z typu pozice
export const getPositionTypeName = (positionType: DHLPositionType): string => {
  return POSITION_TYPE_NAMES[positionType] || 'Neznámá pozice';
};

// Funkce pro formátování data
export const formatDate = (date: string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatTime = (time: string): string => {
  return time.slice(0, 5); // "HH:MM:SS" -> "HH:MM"
};

export const calculateShiftDuration = (startTime: string, endTime: string, breakDuration: number = 30): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = durationMs / (1000 * 60);
  return Math.max(0, (durationMinutes - breakDuration) / 60);
};

export const isUserDHLAssigned = (assignments: any[]): boolean => {
  return assignments && assignments.length > 0 && assignments.some(a => a.is_active);
};

export const getUserActiveDHLAssignment = (assignments: any[]) => {
  return assignments?.find(assignment => assignment.is_active);
};

export const generateWeeklyShiftPattern = (templates: DHLShiftTemplate[]): Record<number, DHLShiftTemplate[]> => {
  const pattern: Record<number, DHLShiftTemplate[]> = {};
  
  templates.forEach(template => {
    if (!pattern[template.day_of_week]) {
      pattern[template.day_of_week] = [];
    }
    pattern[template.day_of_week].push(template);
  });
  
  return pattern;
};

export const hasShiftConflict = (
  shift1: { start_time: string; end_time: string },
  shift2: { start_time: string; end_time: string }
): boolean => {
  const start1 = new Date(`2000-01-01T${shift1.start_time}`);
  const end1 = new Date(`2000-01-01T${shift1.end_time}`);
  const start2 = new Date(`2000-01-01T${shift2.start_time}`);
  const end2 = new Date(`2000-01-01T${shift2.end_time}`);
  
  return start1 < end2 && start2 < end1;
};

export const isDHL2026PromoCode = (code: string): boolean => {
  return code === 'DHL2026';
};

export const generateShiftName = (position: DHLPosition, workGroup: DHLWorkGroup, date: string): string => {
  return `${position.name} - ${workGroup.name} (${date})`;
};

export const calculateWeeklyHours = (templates: DHLShiftTemplate[]): number => {
  return templates.reduce((total, template) => {
    return total + calculateShiftDuration(template.start_time, template.end_time, template.break_duration || 30);
  }, 0);
};

export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};

export const formatHourlyRate = (rate?: number): string => {
  if (!rate) return 'Neuvedeno';
  return `${rate.toFixed(2)} €/hod`;
};

export const getPositionTypeColor = (type: DHLPositionType): string => {
  const colors: Record<DHLPositionType, string> = {
    technik: 'bg-blue-100 text-blue-700',
    rangierer: 'bg-green-100 text-green-700',
    verlader: 'bg-purple-100 text-purple-700',
    sortierer: 'bg-amber-100 text-amber-700',
    fahrer: 'bg-red-100 text-red-700',
    pakettiere: 'bg-cyan-100 text-cyan-700',
    cutter: 'bg-pink-100 text-pink-700',
    shipper: 'bg-indigo-100 text-indigo-700',
    buehne: 'bg-orange-100 text-orange-700',
    teamleiter: 'bg-emerald-100 text-emerald-700',
    standortleiter: 'bg-rose-100 text-rose-700',
    schichtleiter: 'bg-teal-100 text-teal-700',
    wartung: 'bg-lime-100 text-lime-700',
    qualitaetskontrolle: 'bg-violet-100 text-violet-700',
    reinigung: 'bg-sky-100 text-sky-700',
    andere: 'bg-slate-100 text-slate-700',
    other: 'bg-gray-100 text-gray-700'
  };
  return colors[type] || colors.other;
};

export const getPositionTypeIcon = (type: DHLPositionType): string => {
  const icons: Record<DHLPositionType, string> = {
    technik: '🔧',
    rangierer: '🚛',
    verlader: '📦',
    sortierer: '🎯',
    fahrer: '🚚',
    pakettiere: '📮',
    cutter: '✂️',
    shipper: '🚢',
    buehne: '🎪',
    teamleiter: '👨‍💼',
    standortleiter: '🏢',
    schichtleiter: '⚡',
    wartung: '🔨',
    qualitaetskontrolle: '✅',
    reinigung: '🧹',
    andere: '📋',
    other: '❓'
  };
  return icons[type] || icons.other;
};


import { addMinutes, addHours, addDays, addWeeks, addMonths, format } from 'date-fns';
import { REPETITION_INTERVALS } from '@/constants/spacedRepetition';

// Funkce pro výpočet dalšího data opakování podle úrovně
export const calculateNextReviewDate = (repetitionLevel: number): string => {
  const now = new Date();
  let nextDate: Date;
  
  // Upravený algoritmus pro opakování založený na úrovni
  switch (repetitionLevel) {
    case 0: // Nové slovo - opakovat během 30 minut
      nextDate = addMinutes(now, 30);
      break;
    case 1: // První úroveň - opakovat za 8 hodin
      nextDate = addHours(now, 8);
      break;
    case 2: // Druhá úroveň - opakovat za 1 den
      nextDate = addDays(now, 1);
      break;
    case 3: // Třetí úroveň - opakovat za 3 dny
      nextDate = addDays(now, 3);
      break;
    case 4: // Čtvrtá úroveň - opakovat za týden
      nextDate = addWeeks(now, 1);
      break;
    case 5: // Pátá úroveň - opakovat za 2 týdny
      nextDate = addWeeks(now, 2);
      break;
    case 6: // Poslední úroveň - opakovat za měsíc
    default:
      nextDate = addMonths(now, 1);
      break;
  }
  
  // Vrátí ISO string, který je vhodný pro ukládání a porovnávání dat
  return nextDate.toISOString();
};

// Pomocná funkce pro formátování data do lokálního formátu
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'dd.MM.yyyy');
};

// Vypočítá čas do dalšího opakování v relativním formátu
export const timeToNextReview = (nextReviewDate: string): string => {
  const now = new Date();
  const reviewDate = new Date(nextReviewDate);
  const diffMs = reviewDate.getTime() - now.getTime();
  
  if (diffMs < 0) {
    return 'Nyní';
  }
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 60) {
    return `za ${diffMins} min`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffHours < 24) {
    return `za ${diffHours} h`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays < 30) {
    return `za ${diffDays} ${diffDays === 1 ? 'den' : diffDays < 5 ? 'dny' : 'dní'}`;
  }
  
  return format(reviewDate, 'dd.MM.yyyy');
};

// Nová funkce pro výpočet skóre znalosti slova na základě historie odpovědí
export const calculateKnowledgeScore = (correct: number, incorrect: number): number => {
  if (correct + incorrect === 0) return 0;
  return Math.round((correct / (correct + incorrect)) * 100);
};

// Nová funkce pro výpočet optimálního času pro další opakování
export const optimizeReviewTime = (
  repetitionLevel: number, 
  knowledgeScore: number
): string => {
  const now = new Date();
  const baseInterval = REPETITION_INTERVALS[Math.min(repetitionLevel, REPETITION_INTERVALS.length - 1)];
  
  // Úprava intervalu podle skóre znalosti
  let multiplier = 1;
  if (knowledgeScore > 90) multiplier = 1.2; // Prodloužíme interval
  if (knowledgeScore < 60) multiplier = 0.8; // Zkrátíme interval
  
  const intervalDays = Math.round(baseInterval * multiplier);
  const nextDate = addDays(now, intervalDays);
  
  return nextDate.toISOString();
};

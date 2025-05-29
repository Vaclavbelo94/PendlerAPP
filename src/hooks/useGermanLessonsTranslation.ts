
import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Simple translation function for German lessons
const translations: Record<string, Record<string, string>> = {
  cs: {
    'basic-greetings': 'Základní pozdravy',
    'numbers-time': 'Čísla a čas',
    'family-relationships': 'Rodina a vztahy',
    'food-drinks': 'Jídlo a nápoje',
    'directions-transport': 'Směry a doprava',
    'workplace-communication': 'Komunikace na pracovišti',
    'learning-tip': 'Tip k učení',
    'practical-german': 'Praktická němčina',
    
    // Hlavní nadpisy
    'lessons.title': 'Lekce němčiny',
    'lessons.subtitle': 'Interaktivní výuka němčiny pro české a polské pracovníky v balíkovém centru',
    
    // Title keys pro kategorie - používají se přímo
    'first-day.title': 'První den',
    'daily-communication.title': 'Denní komunikace', 
    'technical-terms.title': 'Technické termíny',
    'shift-work.title': 'Směnová práce',
    'work-evaluation.title': 'Hodnocení práce',
    'numbers-time.title': 'Čísla a čas',
    'problems-help.title': 'Problémy a pomoc',
    'end-of-shift.title': 'Konec směny',
    
    // Navigace kategorií - všechny kategorie z extendedGermanLessons
    'nav.first-day': 'První den',
    'nav.daily-communication': 'Denní komunikace',
    'nav.technical-terms': 'Technické termíny',
    'nav.shift-work': 'Směnová práce',
    'nav.work-evaluation': 'Hodnocení práce',
    'nav.numbers-time': 'Čísla a čas',
    'nav.problems-help': 'Problémy a pomoc',
    'nav.end-of-shift': 'Konec směny',
    
    // Legacy klíče pro zpětnou kompatibilitu
    'nav.daily-conversations': 'Denní konverzace',
    'nav.at-work': 'V práci',
    'nav.shopping': 'Nakupování',
    'nav.transportation': 'Doprava'
  },
  en: {
    'basic-greetings': 'Basic Greetings',
    'numbers-time': 'Numbers and Time',
    'family-relationships': 'Family and Relationships',
    'food-drinks': 'Food and Drinks',
    'directions-transport': 'Directions and Transport',
    'workplace-communication': 'Workplace Communication',
    'learning-tip': 'Learning Tip',
    'practical-german': 'Practical German',
    
    // Hlavní nadpisy
    'lessons.title': 'German Lessons',
    'lessons.subtitle': 'Interactive German learning for Czech and Polish workers in package center',
    
    // Title keys pro kategorie
    'first-day.title': 'First Day',
    'daily-communication.title': 'Daily Communication',
    'technical-terms.title': 'Technical Terms',
    'shift-work.title': 'Shift Work',
    'work-evaluation.title': 'Work Evaluation',
    'numbers-time.title': 'Numbers and Time',
    'problems-help.title': 'Problems and Help',
    'end-of-shift.title': 'End of Shift',
    
    // Navigace kategorií - všechny kategorie z extendedGermanLessons
    'nav.first-day': 'First Day',
    'nav.daily-communication': 'Daily Communication',
    'nav.technical-terms': 'Technical Terms',
    'nav.shift-work': 'Shift Work',
    'nav.work-evaluation': 'Work Evaluation',
    'nav.numbers-time': 'Numbers and Time',
    'nav.problems-help': 'Problems and Help',
    'nav.end-of-shift': 'End of Shift',
    
    // Legacy klíče pro zpětnou kompatibilitu
    'nav.daily-conversations': 'Daily Conversations',
    'nav.at-work': 'At Work',
    'nav.shopping': 'Shopping',
    'nav.transportation': 'Transportation'
  },
  sk: {
    'basic-greetings': 'Základné pozdravy',
    'numbers-time': 'Čísla a čas',
    'family-relationships': 'Rodina a vzťahy',
    'food-drinks': 'Jedlo a nápoje',
    'directions-transport': 'Smery a doprava',
    'workplace-communication': 'Komunikácia na pracovisku',
    'learning-tip': 'Tip na učenie',
    'practical-german': 'Praktická nemčina',
    
    // Hlavní nadpisy
    'lessons.title': 'Lekcie nemčiny',
    'lessons.subtitle': 'Interaktívna výuka nemčiny pre českých a poľských pracovníkov v balíkovom centre',
    
    // Title keys pro kategorie
    'first-day.title': 'Prvý deň',
    'daily-communication.title': 'Denná komunikácia',
    'technical-terms.title': 'Technické termíny',
    'shift-work.title': 'Zmenová práca',
    'work-evaluation.title': 'Hodnotenie práce',
    'numbers-time.title': 'Čísla a čas',
    'problems-help.title': 'Problémy a pomoc',
    'end-of-shift.title': 'Koniec zmeny',
    
    // Navigace kategorií - všechny kategorie z extendedGermanLessons
    'nav.first-day': 'Prvý deň',
    'nav.daily-communication': 'Denná komunikácia',
    'nav.technical-terms': 'Technické termíny',
    'nav.shift-work': 'Zmenová práca',
    'nav.work-evaluation': 'Hodnotenie práce',
    'nav.numbers-time': 'Čísla a čas',
    'nav.problems-help': 'Problémy a pomoc',
    'nav.end-of-shift': 'Koniec zmeny',
    
    // Legacy klíče pro zpětnou kompatibilitu
    'nav.daily-conversations': 'Denné rozhovory',
    'nav.at-work': 'V práci',
    'nav.shopping': 'Nakupovanie',
    'nav.transportation': 'Doprava'
  }
};

export const useGermanLessonsTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('cs');
  
  const availableLanguages: Language[] = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' }
  ];

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('lessons_language', langCode);
    // In real app, this would update lesson interface language
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['cs'][key] || key;
  };

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    t
  };
};

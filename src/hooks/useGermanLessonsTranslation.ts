
import { useState, useEffect, useCallback } from 'react';

type Language = 'cs' | 'en' | 'de' | 'sk';

interface LessonsTranslations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const lessonsTranslations: LessonsTranslations = {
  // Page headers
  'lessons.title': {
    cs: 'Praktické lekce němčiny',
    en: 'Practical German Lessons',
    de: 'Praktische Deutschstunden',
    sk: 'Praktické lekcie nemčiny'
  },
  'lessons.subtitle': {
    cs: 'Naučte se základní německé fráze pro práci v balíkovém centru',
    en: 'Learn basic German phrases for working in a package center',
    de: 'Lernen Sie grundlegende deutsche Phrasen für die Arbeit im Paketzentrum',
    sk: 'Naučte sa základné nemecké frázy pre prácu v balíkovom centre'
  },
  
  // Navigation
  'nav.firstDay': {
    cs: 'První den',
    en: 'First Day',
    de: 'Erster Tag',
    sk: 'Prvý deň'
  },
  'nav.dailyCommunication': {
    cs: 'Každodenní komunikace',
    en: 'Daily Communication',
    de: 'Tägliche Kommunikation',
    sk: 'Každodenná komunikácia'
  },
  'nav.problemsHelp': {
    cs: 'Problémy a pomoc',
    en: 'Problems & Help',
    de: 'Probleme & Hilfe',
    sk: 'Problémy a pomoc'
  },
  'nav.endOfShift': {
    cs: 'Konec směny',
    en: 'End of Shift',
    de: 'Schichtende',
    sk: 'Koniec zmeny'
  },
  
  // Actions
  'action.playAudio': {
    cs: 'Přehrát zvuk',
    en: 'Play Audio',
    de: 'Audio abspielen',
    sk: 'Prehrať zvuk'
  },
  'action.slowSpeech': {
    cs: 'Pomalé tempo',
    en: 'Slow Speed',
    de: 'Langsame Geschwindigkeit',
    sk: 'Pomalé tempo'
  },
  'action.normalSpeech': {
    cs: 'Normální tempo',
    en: 'Normal Speed',
    de: 'Normale Geschwindigkeit',
    sk: 'Normálne tempo'
  },
  
  // Categories
  'category.greetings': {
    cs: 'Pozdravy',
    en: 'Greetings',
    de: 'Begrüßungen',
    sk: 'Pozdravy'
  },
  'category.workTasks': {
    cs: 'Pracovní úkoly',
    en: 'Work Tasks',
    de: 'Arbeitsaufgaben',
    sk: 'Pracovné úlohy'
  },
  'category.breaks': {
    cs: 'Přestávky',
    en: 'Breaks',
    de: 'Pausen',
    sk: 'Prestávky'
  },
  'category.help': {
    cs: 'Potřebuji pomoc',
    en: 'Need Help',
    de: 'Brauche Hilfe',
    sk: 'Potrebujem pomoc'
  },
  
  // Instructions
  'instruction.tapToPlay': {
    cs: 'Klepněte pro přehrání',
    en: 'Tap to play',
    de: 'Tippen zum Abspielen',
    sk: 'Klepnite pre prehranie'
  },
  'instruction.phonetic': {
    cs: 'Fonetický zápis',
    en: 'Phonetic notation',
    de: 'Phonetische Notation',
    sk: 'Fonetický zápis'
  }
};

export const useGermanLessonsTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('cs');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app_language') as Language;
    if (savedLanguage && ['cs', 'en', 'de', 'sk'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('app_language', language);
  }, []);
  
  const t = useCallback((key: string, fallback?: string): string => {
    const translation = lessonsTranslations[key];
    if (translation && translation[currentLanguage]) {
      return translation[currentLanguage];
    }
    
    if (translation && translation.cs) {
      return translation.cs;
    }
    
    return fallback || key;
  }, [currentLanguage]);
  
  return {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' }
    ] as const
  };
};

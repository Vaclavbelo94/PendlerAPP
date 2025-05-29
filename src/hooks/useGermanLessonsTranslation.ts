
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
    'practical-german': 'Praktická němčina'
  },
  en: {
    'basic-greetings': 'Basic Greetings',
    'numbers-time': 'Numbers and Time',
    'family-relationships': 'Family and Relationships',
    'food-drinks': 'Food and Drinks',
    'directions-transport': 'Directions and Transport',
    'workplace-communication': 'Workplace Communication',
    'learning-tip': 'Learning Tip',
    'practical-german': 'Practical German'
  },
  sk: {
    'basic-greetings': 'Základné pozdravy',
    'numbers-time': 'Čísla a čas',
    'family-relationships': 'Rodina a vzťahy',
    'food-drinks': 'Jedlo a nápoje',
    'directions-transport': 'Smery a doprava',
    'workplace-communication': 'Komunikácia na pracovisku',
    'learning-tip': 'Tip na učenie',
    'practical-german': 'Praktická nemčina'
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

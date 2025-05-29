
import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Simple translation function for basic strings
const translations: Record<string, Record<string, string>> = {
  cs: {
    search: 'Hledat',
    filter: 'Filtrovat',
    all: 'Vše',
    beginner: 'Začátečník',
    intermediate: 'Pokročilý',
    advanced: 'Pokročilý',
    'daily-conversations': 'Denní konverzace',
    'at-work': 'V práci',
    'shopping': 'Nakupování',
    'transportation': 'Doprava'
  },
  en: {
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    'daily-conversations': 'Daily Conversations',
    'at-work': 'At Work',
    'shopping': 'Shopping',
    'transportation': 'Transportation'
  },
  de: {
    search: 'Suchen',
    filter: 'Filtern',
    all: 'Alle',
    beginner: 'Anfänger',
    intermediate: 'Fortgeschritten',
    advanced: 'Fortgeschritten',
    'daily-conversations': 'Tägliche Gespräche',
    'at-work': 'Bei der Arbeit',
    'shopping': 'Einkaufen',
    'transportation': 'Transport'
  },
  sk: {
    search: 'Hľadať',
    filter: 'Filtrovať',
    all: 'Všetko',
    beginner: 'Začiatočník',
    intermediate: 'Pokročilý',
    advanced: 'Pokročilý',
    'daily-conversations': 'Denné rozhovory',
    'at-work': 'V práci',
    'shopping': 'Nakupovanie',
    'transportation': 'Doprava'
  }
};

export const useInternationalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState('cs');
  
  const availableLanguages: Language[] = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' }
  ];

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('app_language', langCode);
    // In real app, this would trigger language change
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


import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

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

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage
  };
};

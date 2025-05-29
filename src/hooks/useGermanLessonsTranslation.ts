
import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

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

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage
  };
};

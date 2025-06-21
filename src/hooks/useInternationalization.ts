
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface Language {
  code: string;
  name: string;
  flag: string;
}

export const useInternationalization = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const availableLanguages: Language[] = [
    { code: 'cs', name: t('czech') || 'Čeština', flag: '🇨🇿' },
    { code: 'pl', name: t('polish') || 'Polski', flag: '🇵🇱' },
    { code: 'de', name: t('german') || 'Deutsch', flag: '🇩🇪' }
  ];

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode as any);
    localStorage.setItem('app_language', langCode);
  };

  return {
    currentLanguage: language,
    availableLanguages,
    changeLanguage,
    t
  };
};

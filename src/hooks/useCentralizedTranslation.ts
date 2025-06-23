
import { useState, useEffect } from 'react';
import { getCentralizedTranslation, CentralizedLanguage } from '@/lib/i18n/centralized-translations';

export const useCentralizedTranslation = () => {
  const [language, setLanguageState] = useState<CentralizedLanguage>(() => {
    // Získat uložený jazyk nebo použít výchozí
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && ['cs', 'pl', 'de'].includes(savedLanguage)) {
      return savedLanguage as CentralizedLanguage;
    }
    
    // Automatická detekce podle prohlížeče
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('cs')) return 'cs';
    if (browserLang.startsWith('pl')) return 'pl';
    if (browserLang.startsWith('de')) return 'de';
    
    return 'cs'; // Výchozí jazyk
  });

  const setLanguage = (lang: CentralizedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    console.log(`Language changed to: ${lang}`);
  };

  const t = (key: string): string => {
    return getCentralizedTranslation(language, key);
  };

  return { language, setLanguage, t };
};

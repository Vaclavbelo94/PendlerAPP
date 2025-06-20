
import { useState, useEffect, createContext, useContext } from 'react';
import { Language, translations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageProvider = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Detekce jazyka prohlížeče nebo použití uložené preference
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && ['cs', 'pl', 'de'].includes(savedLanguage)) {
      return savedLanguage as Language;
    }
    
    // Automatická detekce podle prohlížeče
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('cs')) return 'cs';
    if (browserLang.startsWith('pl')) return 'pl';
    if (browserLang.startsWith('de')) return 'de';
    
    return 'cs'; // Výchozí jazyk
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    console.log(`Language changed to: ${lang}`);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key; // Vrátí klíč jako fallback
    }
    
    return value;
  };

  return { language, setLanguage, t };
};

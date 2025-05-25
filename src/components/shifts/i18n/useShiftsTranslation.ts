
import { useMemo } from 'react';
import { translations, Language } from './translations';

export const useShiftsTranslation = (language: Language = 'cs') => {
  const t = useMemo(() => {
    const lang = translations[language] || translations.cs;
    
    return (key: string) => {
      const keys = key.split('.');
      let value: any = lang.shifts;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    };
  }, [language]);

  return { t };
};

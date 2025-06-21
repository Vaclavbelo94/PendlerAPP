
import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { translations, Language } from './translations';

export const useShiftsTranslation = () => {
  const { language } = useLanguage();
  
  const t = useMemo(() => {
    const lang = translations[language as Language] || translations.cs;
    
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

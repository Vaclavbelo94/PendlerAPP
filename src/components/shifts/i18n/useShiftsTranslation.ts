
import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { translations, Language } from './translations';

export const useShiftsTranslation = () => {
  const { language, t } = useLanguage();
  
  const shiftsT = useMemo(() => {
    return (key: string) => {
      // Try to get from main translations first with shifts prefix
      const mainTranslation = t(`shifts.${key}`);
      if (mainTranslation && mainTranslation !== `shifts.${key}`) {
        return mainTranslation;
      }

      // Fallback to local shifts translations if available
      const lang = translations[language as Language] || translations.cs;
      const keys = key.split('.');
      let value: any = lang.shifts;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    };
  }, [language, t]);

  return { t: shiftsT };
};

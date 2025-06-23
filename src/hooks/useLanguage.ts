
import { useTranslation } from 'react-i18next';

export type Language = 'cs' | 'de' | 'pl';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  
  const language = (i18n.language || 'cs') as Language;
  
  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  return {
    language,
    setLanguage,
    t
  };
};

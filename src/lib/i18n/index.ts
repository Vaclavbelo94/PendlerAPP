
// Re-export legacy compatibility
import type { Language, LanguageInfo, Translations } from './types';
import { languages, defaultLanguage } from './languages';
import { commonTranslations } from './translations/common';
import { lawsTranslations } from './translations/laws';

// New centralized system
export { useCentralizedTranslation } from '@/hooks/useCentralizedTranslation';
export { getCentralizedTranslation, centralizedTranslations } from './centralized-translations';
export type { CentralizedLanguage } from './centralized-translations';

// Combine all translations for legacy compatibility
const allTranslations = {
  cs: {
    ...commonTranslations.cs,
    ...lawsTranslations.cs,
  },
  de: {
    ...commonTranslations.de,
    ...lawsTranslations.de,
  },
  pl: {
    ...commonTranslations.pl,
    ...lawsTranslations.pl,
  },
};

// Legacy helper function
export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = allTranslations[language];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  if (!value) {
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return key;
  }
  
  return typeof value === 'string' ? value : key;
};

// Legacy hook
export const useTranslation = (language: Language) => {
  return (key: string) => getTranslation(language, key);
};

// Export everything needed for backward compatibility
export type { Language, LanguageInfo, Translations };
export { languages, defaultLanguage };

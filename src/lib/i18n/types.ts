
export type Language = 'cs' | 'de' | 'pl';

export interface LanguageInfo {
  code: Language;
  name: string;
  flag: string;
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface Translations {
  [namespace: string]: TranslationNamespace;
}

export type LanguageTranslations = {
  [lang in Language]: Translations;
};

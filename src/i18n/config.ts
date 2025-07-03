
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonCs from './translations/cs/common.json';
import commonDe from './translations/de/common.json';
import commonPl from './translations/pl/common.json';

import navigationCs from './translations/cs/navigation.json';
import navigationDe from './translations/de/navigation.json';
import navigationPl from './translations/pl/navigation.json';

import profileCs from './translations/cs/profile.json';
import profileDe from './translations/de/profile.json';
import profilePl from './translations/pl/profile.json';

import settingsCs from './translations/cs/settings.json';
import settingsDe from './translations/de/settings.json';
import settingsPl from './translations/pl/settings.json';

import errorsCs from './translations/cs/errors.json';
import errorsDe from './translations/de/errors.json';
import errorsPl from './translations/pl/errors.json';

const resources = {
  cs: {
    common: commonCs,
    navigation: navigationCs,
    profile: profileCs,
    settings: settingsCs,
    errors: errorsCs,
  },
  de: {
    common: commonDe,
    navigation: navigationDe,
    profile: profileDe,
    settings: settingsDe,
    errors: errorsDe,
  },
  pl: {
    common: commonPl,
    navigation: navigationPl,
    profile: profilePl,
    settings: settingsPl,
    errors: errorsPl,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cs',
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;


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

import shiftsCs from './translations/cs/shifts.json';
import shiftsDe from './translations/de/shifts.json';
import shiftsPl from './translations/pl/shifts.json';

import formsCs from './translations/cs/forms.json';
import formsDe from './translations/de/forms.json';
import formsPl from './translations/pl/forms.json';

// Import new namespace translations
import dashboardCs from './translations/cs/dashboard.json';
import dashboardDe from './translations/de/dashboard.json';
import dashboardPl from './translations/pl/dashboard.json';

import authCs from './translations/cs/auth.json';
import authDe from './translations/de/auth.json';
import authPl from './translations/pl/auth.json';

import translatorCs from './translations/cs/translator.json';
import translatorDe from './translations/de/translator.json';
import translatorPl from './translations/pl/translator.json';

import travelCs from './translations/cs/travel.json';
import travelDe from './translations/de/travel.json';
import travelPl from './translations/pl/travel.json';

import lawsCs from './translations/cs/laws.json';
import lawsDe from './translations/de/laws.json';
import lawsPl from './translations/pl/laws.json';

import taxAdvisorCs from './translations/cs/taxAdvisor.json';
import taxAdvisorDe from './translations/de/taxAdvisor.json';
import taxAdvisorPl from './translations/pl/taxAdvisor.json';

import vehicleCs from './translations/cs/vehicle.json';
import vehicleDe from './translations/de/vehicle.json';
import vehiclePl from './translations/pl/vehicle.json';

import premiumCs from './translations/cs/premium.json';
import premiumDe from './translations/de/premium.json';
import premiumPl from './translations/pl/premium.json';

const resources = {
  cs: {
    common: commonCs,
    navigation: navigationCs,
    profile: profileCs,
    settings: settingsCs,
    errors: errorsCs,
    shifts: shiftsCs,
    forms: formsCs,
    dashboard: dashboardCs,
    auth: authCs,
    translator: translatorCs,
    travel: travelCs,
    laws: lawsCs,
    taxAdvisor: taxAdvisorCs,
    vehicle: vehicleCs,
    premium: premiumCs,
  },
  de: {
    common: commonDe,
    navigation: navigationDe,
    profile: profileDe,
    settings: settingsDe,
    errors: errorsDe,
    shifts: shiftsDe,
    forms: formsDe,
    dashboard: dashboardDe,
    auth: authDe,
    translator: translatorDe,
    travel: travelDe,
    laws: lawsDe,
    taxAdvisor: taxAdvisorDe,
    vehicle: vehicleDe,
    premium: premiumDe,
  },
  pl: {
    common: commonPl,
    navigation: navigationPl,
    profile: profilePl,
    settings: settingsPl,
    errors: errorsPl,
    shifts: shiftsPl,
    forms: formsPl,
    dashboard: dashboardPl,
    auth: authPl,
    translator: translatorPl,
    travel: travelPl,
    laws: lawsPl,
    taxAdvisor: taxAdvisorPl,
    vehicle: vehiclePl,
    premium: premiumPl,
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

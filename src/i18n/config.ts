
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import csCommon from './translations/cs/common.json';
import csNavigation from './translations/cs/navigation.json';
import csDashboard from './translations/cs/dashboard.json';
import csLaws from './translations/cs/laws.json';
import csShifts from './translations/cs/shifts.json';
import csTravel from './translations/cs/travel.json';
import csTranslator from './translations/cs/translator.json';
import csTaxAdvisor from './translations/cs/taxAdvisor.json';
import csVehicle from './translations/cs/vehicle.json';
import csForms from './translations/cs/forms.json';
import csUI from './translations/cs/ui.json';
import csProfile from './translations/cs/profile.json';
import csSettings from './translations/cs/settings.json';
import csAuth from './translations/cs/auth.json';
import csPremium from './translations/cs/premium.json';

import deCommon from './translations/de/common.json';
import deNavigation from './translations/de/navigation.json';
import deDashboard from './translations/de/dashboard.json';
import deLaws from './translations/de/laws.json';
import deShifts from './translations/de/shifts.json';
import deTravel from './translations/de/travel.json';
import deTranslator from './translations/de/translator.json';
import deTaxAdvisor from './translations/de/taxAdvisor.json';
import deVehicle from './translations/de/vehicle.json';
import deForms from './translations/de/forms.json';
import deUI from './translations/de/ui.json';
import deProfile from './translations/de/profile.json';
import deSettings from './translations/de/settings.json';
import deAuth from './translations/de/auth.json';
import dePremium from './translations/de/premium.json';

import plCommon from './translations/pl/common.json';
import plNavigation from './translations/pl/navigation.json';
import plDashboard from './translations/pl/dashboard.json';
import plLaws from './translations/pl/laws.json';
import plShifts from './translations/pl/shifts.json';
import plTravel from './translations/pl/travel.json';
import plTranslator from './translations/pl/translator.json';
import plTaxAdvisor from './translations/pl/taxAdvisor.json';
import plVehicle from './translations/pl/vehicle.json';
import plForms from './translations/pl/forms.json';
import plUI from './translations/pl/ui.json';
import plProfile from './translations/pl/profile.json';
import plSettings from './translations/pl/settings.json';
import plAuth from './translations/pl/auth.json';
import plPremium from './translations/pl/premium.json';

export const resources = {
  cs: {
    common: csCommon,
    navigation: csNavigation,
    dashboard: csDashboard,
    laws: csLaws,
    shifts: csShifts,
    travel: csTravel,
    translator: csTranslator,
    taxAdvisor: csTaxAdvisor,
    vehicle: csVehicle,
    forms: csForms,
    ui: csUI,
    profile: csProfile,
    settings: csSettings,
    auth: csAuth,
    premium: csPremium,
  },
  de: {
    common: deCommon,
    navigation: deNavigation,
    dashboard: deDashboard,
    laws: deLaws,
    shifts: deShifts,
    travel: deTravel,
    translator: deTranslator,
    taxAdvisor: deTaxAdvisor,
    vehicle: deVehicle,
    forms: deForms,
    ui: deUI,
    profile: deProfile,
    settings: deSettings,
    auth: deAuth,
    premium: dePremium,
  },
  pl: {
    common: plCommon,
    navigation: plNavigation,
    dashboard: plDashboard,
    laws: plLaws,
    shifts: plShifts,
    travel: plTravel,
    translator: plTranslator,
    taxAdvisor: plTaxAdvisor,
    vehicle: plVehicle,
    forms: plForms,
    ui: plUI,
    profile: plProfile,
    settings: plSettings,
    auth: plAuth,
    premium: plPremium,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cs',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    defaultNS: 'common',
    ns: ['common', 'navigation', 'dashboard', 'laws', 'shifts', 'travel', 'translator', 'taxAdvisor', 'vehicle', 'forms', 'ui', 'profile', 'settings', 'auth', 'premium'],
  });

export default i18n;

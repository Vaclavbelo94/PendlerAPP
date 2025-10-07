
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import new company translations
import csCompanySelector from './locales/cs/companySelector.json';
import csCompany from './locales/cs/company.json';
import deCompanySelector from './locales/de/companySelector.json';
import deCompany from './locales/de/company.json';
import plCompanySelector from './locales/pl/companySelector.json';
import plCompany from './locales/pl/company.json';
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

// Import new auth locale files
import localAuthCs from '../locales/cs/auth.json';
import localAuthDe from '../locales/de/auth.json';
import localAuthPl from '../locales/pl/auth.json';

import translatorCs from './translations/cs/translator.json';
import translatorDe from './translations/de/translator.json';
import translatorPl from './translations/pl/translator.json';

import travelCs from './translations/cs/travel.json';
import travelDe from './translations/de/travel.json';
import travelPl from './translations/pl/travel.json';

import { lawsTranslations } from '../lib/i18n/translations/laws';

import taxAdvisorCs from './translations/cs/taxAdvisor.json';
import taxAdvisorDe from './translations/de/taxAdvisor.json';
import taxAdvisorPl from './translations/pl/taxAdvisor.json';

import vehicleCs from './translations/cs/vehicle.json';
import vehicleDe from './translations/de/vehicle.json';
import vehiclePl from './translations/pl/vehicle.json';

import premiumCs from './translations/cs/premium.json';
import premiumDe from './translations/de/premium.json';
import premiumPl from './translations/pl/premium.json';

// Import DHL translations
import dhlCs from './translations/cs/dhl.json';
import dhlDe from './translations/de/dhl.json';
import dhlPl from './translations/pl/dhl.json';

// Overtime module translations
import overtimeCs from './translations/cs/overtime.json';
import overtimeDe from './translations/de/overtime.json';
import overtimePl from './translations/pl/overtime.json';

// Import notification translations
import notificationsCs from './translations/cs/notifications.json';
import notificationsDe from './translations/de/notifications.json';
import notificationsPl from './translations/pl/notifications.json';

// Import pricing translations
import pricingCs from './translations/cs/pricing.json';
import pricingDe from './translations/de/pricing.json';
import pricingPl from './translations/pl/pricing.json';

// Import contact translations
import contactCs from './translations/cs/contact.json';
import contactDe from './translations/de/contact.json';
import contactPl from './translations/pl/contact.json';

// Import toast translations
import toastCs from './translations/cs/toast.json';
import toastDe from './translations/de/toast.json';
import toastPl from './translations/pl/toast.json';

// Import FAQ translations
import faqCs from './translations/cs/faq.json';
import faqDe from './translations/de/faq.json';
import faqPl from './translations/pl/faq.json';

// Import PostLogin translations
import postLoginCs from './translations/cs/postLogin.json';
import postLoginDe from './translations/de/postLogin.json';
import postLoginPl from './translations/pl/postLogin.json';

// Import UI translations
import uiCs from './translations/cs/ui.json';
import uiDe from './translations/de/ui.json';
import uiPl from './translations/pl/ui.json';

// Import Legal translations
import legalCs from './translations/cs/legal.json';
import legalDe from './translations/de/legal.json';
import legalPl from './translations/pl/legal.json';

// Import DHL Employee translations
import dhlEmployeeCs from './translations/cs/dhl-employee.json';
import dhlEmployeeDe from './translations/de/dhl-employee.json';
import dhlEmployeePl from './translations/pl/dhl-employee.json';

// Import DHL Admin translations
import dhlAdminCs from './translations/cs/dhl-admin.json';
import dhlAdminDe from './translations/de/dhl-admin.json';
import dhlAdminPl from './translations/pl/dhl-admin.json';

// Import Travel Missing translations
import travelMissingCs from './translations/cs/travel-missing.json';
import travelMissingDe from './translations/de/travel-missing.json';
import travelMissingPl from './translations/pl/travel-missing.json';

// Import Pendler Calculator translations
import pendlerCalculatorCs from './translations/cs/pendlerCalculator.json';
import pendlerCalculatorDe from './translations/de/pendlerCalculator.json';
import pendlerCalculatorPl from './translations/pl/pendlerCalculator.json';

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
    auth: { ...authCs, ...localAuthCs },
    translator: translatorCs,
    travel: travelCs,
    laws: lawsTranslations.cs.laws,
    taxAdvisor: taxAdvisorCs,
    vehicle: vehicleCs,
    premium: premiumCs,
    dhl: dhlCs,
    overtime: overtimeCs,
    companySelector: csCompanySelector,
    company: csCompany,
    notifications: notificationsCs,
    pricing: pricingCs,
    contact: contactCs,
    toast: toastCs,
    faq: faqCs,
    postLogin: postLoginCs,
    ui: uiCs,
    legal: legalCs,
    dhlAdmin: dhlAdminCs,
    dhlEmployee: dhlEmployeeCs,
    travelMissing: travelMissingCs,
    pendlerCalculator: pendlerCalculatorCs,
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
    auth: { ...authDe, ...localAuthDe },
    translator: translatorDe,
    travel: travelDe,
    laws: lawsTranslations.de.laws,
    taxAdvisor: taxAdvisorDe,
    vehicle: vehicleDe,
    premium: premiumDe,
    dhl: dhlDe,
    overtime: overtimeDe,
    companySelector: deCompanySelector,
    company: deCompany,
    notifications: notificationsDe,
    pricing: pricingDe,
    contact: contactDe,
    toast: toastDe,
    faq: faqDe,
    postLogin: postLoginDe,
    ui: uiDe,
    legal: legalDe,
    dhlAdmin: dhlAdminDe,
    dhlEmployee: dhlEmployeeDe,
    travelMissing: travelMissingDe,
    pendlerCalculator: pendlerCalculatorDe,
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
    auth: { ...authPl, ...localAuthPl },
    translator: translatorPl,
    travel: travelPl,
    laws: lawsTranslations.pl.laws,
    taxAdvisor: taxAdvisorPl,
    vehicle: vehiclePl,
    premium: premiumPl,
    dhl: dhlPl,
    overtime: overtimePl,
    companySelector: plCompanySelector,
    company: plCompany,
    notifications: notificationsPl,
    pricing: pricingPl,
    contact: contactPl,
    toast: toastPl,
    faq: faqPl,
    postLogin: postLoginPl,
    ui: uiPl,
    legal: legalPl,
    dhlAdmin: dhlAdminPl,
    dhlEmployee: dhlEmployeePl,
    travelMissing: travelMissingPl,
    pendlerCalculator: pendlerCalculatorPl,
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

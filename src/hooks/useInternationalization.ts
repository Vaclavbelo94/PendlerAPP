
import { useState, useEffect, useCallback } from 'react';

type Language = 'cs' | 'en' | 'de' | 'sk';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': {
    cs: 'Přehled',
    en: 'Dashboard',
    de: 'Übersicht',
    sk: 'Prehľad'
  },
  'nav.shifts': {
    cs: 'Směny',
    en: 'Shifts',
    de: 'Schichten',
    sk: 'Zmeny'
  },
  'nav.calculator': {
    cs: 'Kalkulačka',
    en: 'Calculator',
    de: 'Rechner',
    sk: 'Kalkulačka'
  },
  'nav.vehicle': {
    cs: 'Vozidlo',
    en: 'Vehicle',
    de: 'Fahrzeug',
    sk: 'Vozidlo'
  },
  'nav.settings': {
    cs: 'Nastavení',
    en: 'Settings',
    de: 'Einstellungen',
    sk: 'Nastavenia'
  },
  
  // Common actions
  'action.save': {
    cs: 'Uložit',
    en: 'Save',
    de: 'Speichern',
    sk: 'Uložiť'
  },
  'action.cancel': {
    cs: 'Zrušit',
    en: 'Cancel',
    de: 'Abbrechen',
    sk: 'Zrušiť'
  },
  'action.delete': {
    cs: 'Smazat',
    en: 'Delete',
    de: 'Löschen',
    sk: 'Zmazať'
  },
  'action.edit': {
    cs: 'Upravit',
    en: 'Edit',
    de: 'Bearbeiten',
    sk: 'Upraviť'
  },
  
  // Shift types
  'shift.morning': {
    cs: 'Ranní',
    en: 'Morning',
    de: 'Früh',
    sk: 'Ranná'
  },
  'shift.afternoon': {
    cs: 'Odpolední',
    en: 'Afternoon',
    de: 'Nachmittag',
    sk: 'Odpoludňajšia'
  },
  'shift.night': {
    cs: 'Noční',
    en: 'Night',
    de: 'Nacht',
    sk: 'Nočná'
  },
  
  // Status messages
  'status.loading': {
    cs: 'Načítám...',
    en: 'Loading...',
    de: 'Laden...',
    sk: 'Načítavam...'
  },
  'status.error': {
    cs: 'Chyba',
    en: 'Error',
    de: 'Fehler',
    sk: 'Chyba'
  },
  'status.success': {
    cs: 'Úspěch',
    en: 'Success',
    de: 'Erfolg',
    sk: 'Úspech'
  },
  
  // Offline mode
  'offline.mode': {
    cs: 'Offline režim',
    en: 'Offline mode',
    de: 'Offline-Modus',
    sk: 'Offline režim'
  },
  'offline.sync': {
    cs: 'Synchronizovat',
    en: 'Synchronize',
    de: 'Synchronisieren',
    sk: 'Synchronizovať'
  }
};

export const useInternationalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('cs');
  
  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('app_language') as Language;
    if (savedLanguage && ['cs', 'en', 'de', 'sk'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('cs')) setCurrentLanguage('cs');
      else if (browserLang.startsWith('sk')) setCurrentLanguage('sk');
      else if (browserLang.startsWith('de')) setCurrentLanguage('de');
      else setCurrentLanguage('en');
    }
  }, []);
  
  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('app_language', language);
  }, []);
  
  const t = useCallback((key: string, fallback?: string): string => {
    const translation = translations[key];
    if (translation && translation[currentLanguage]) {
      return translation[currentLanguage];
    }
    
    // Fallback to English if available
    if (translation && translation.en) {
      return translation.en;
    }
    
    // Return fallback or key
    return fallback || key;
  }, [currentLanguage]);
  
  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage === 'cs' ? 'cs-CZ' : 
                                  currentLanguage === 'sk' ? 'sk-SK' :
                                  currentLanguage === 'de' ? 'de-DE' : 'en-US'
    ).format(date);
  }, [currentLanguage]);
  
  const formatNumber = useCallback((number: number): string => {
    return new Intl.NumberFormat(currentLanguage === 'cs' ? 'cs-CZ' : 
                                currentLanguage === 'sk' ? 'sk-SK' :
                                currentLanguage === 'de' ? 'de-DE' : 'en-US'
    ).format(number);
  }, [currentLanguage]);
  
  const formatCurrency = useCallback((amount: number): string => {
    const currency = currentLanguage === 'cs' || currentLanguage === 'sk' ? 'CZK' : 
                    currentLanguage === 'de' ? 'EUR' : 'USD';
    
    return new Intl.NumberFormat(currentLanguage === 'cs' ? 'cs-CZ' : 
                                currentLanguage === 'sk' ? 'sk-SK' :
                                currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }, [currentLanguage]);
  
  return {
    currentLanguage,
    changeLanguage,
    t,
    formatDate,
    formatNumber,
    formatCurrency,
    availableLanguages: [
      { code: 'cs', name: 'Čeština' },
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
      { code: 'sk', name: 'Slovenčina' }
    ] as const
  };
};

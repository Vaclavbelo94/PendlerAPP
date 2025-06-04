
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ConsentPreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
}

interface GDPRConsentContextType {
  hasConsent: boolean;
  preferences: ConsentPreferences;
  showBanner: boolean;
  updateConsent: (preferences: ConsentPreferences) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeBanner: () => void;
  isEUUser: boolean;
}

const GDPRConsentContext = createContext<GDPRConsentContextType | undefined>(undefined);

export const useGDPRConsent = () => {
  const context = useContext(GDPRConsentContext);
  if (!context) {
    throw new Error('useGDPRConsent must be used within GDPRConsentProvider');
  }
  return context;
};

interface GDPRConsentProviderProps {
  children: React.ReactNode;
}

// Funkce pro detekci EU uživatelů (zjednodušená verze)
const detectEUUser = (): boolean => {
  // V produkci byste použili geolocation API nebo server-side detekci
  // Pro účely této implementace zobrazujeme banner všem uživatelům
  return true;
};

// Google Consent Mode v2 integration
const updateGoogleConsent = (preferences: ConsentPreferences) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': preferences.analytics ? 'granted' : 'denied',
      'ad_storage': preferences.advertising ? 'granted' : 'denied',
      'ad_user_data': preferences.advertising ? 'granted' : 'denied',
      'ad_personalization': preferences.advertising ? 'granted' : 'denied',
      'functionality_storage': preferences.functional ? 'granted' : 'denied',
      'personalization_storage': preferences.functional ? 'granted' : 'denied',
    });
  }
};

export const GDPRConsentProvider: React.FC<GDPRConsentProviderProps> = ({ children }) => {
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isEUUser] = useState(detectEUUser());
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Vždy true, nelze vypnout
    functional: false,
    analytics: false,
    advertising: false,
  });

  // Načtení uložených preferencí při startu
  useEffect(() => {
    const savedConsent = localStorage.getItem('gdpr-consent');
    const savedPreferences = localStorage.getItem('gdpr-preferences');
    
    if (savedConsent && savedPreferences) {
      setHasConsent(JSON.parse(savedConsent));
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      updateGoogleConsent(parsedPreferences);
    } else if (isEUUser) {
      // Zobrazit banner pouze EU uživatelům (nebo všem v této implementaci)
      setShowBanner(true);
    }
  }, [isEUUser]);

  // Inicializace Google Consent Mode
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Nastavení výchozích hodnot pro Consent Mode
      window.gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied',
        'wait_for_update': 500,
      });
    }
  }, []);

  const updateConsent = (newPreferences: ConsentPreferences) => {
    setPreferences(newPreferences);
    setHasConsent(true);
    setShowBanner(false);
    
    // Uložení do localStorage
    localStorage.setItem('gdpr-consent', JSON.stringify(true));
    localStorage.setItem('gdpr-preferences', JSON.stringify(newPreferences));
    
    // Aktualizace Google Consent Mode
    updateGoogleConsent(newPreferences);
    
    console.log('GDPR Consent updated:', newPreferences);
  };

  const acceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true,
    };
    updateConsent(allAccepted);
  };

  const rejectAll = () => {
    const allRejected: ConsentPreferences = {
      necessary: true, // Nelze odmítnout
      functional: false,
      analytics: false,
      advertising: false,
    };
    updateConsent(allRejected);
  };

  const openSettings = () => {
    setShowBanner(true);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <GDPRConsentContext.Provider value={{
      hasConsent,
      preferences,
      showBanner,
      updateConsent,
      acceptAll,
      rejectAll,
      openSettings,
      closeBanner,
      isEUUser
    }}>
      {children}
    </GDPRConsentContext.Provider>
  );
};

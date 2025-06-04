
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGDPRConsent } from '@/contexts/GDPRConsentContext';

interface AdSenseContextType {
  shouldShowAds: boolean;
  isAdSenseLoaded: boolean;
  loadAd: (adSlotId: string, elementId: string) => void;
  trackAdView: (adType: string) => void;
  trackAdClick: (adType: string) => void;
  hasAdvertisingConsent: boolean;
}

const AdSenseContext = createContext<AdSenseContextType | undefined>(undefined);

export const useAdSense = () => {
  const context = useContext(AdSenseContext);
  if (!context) {
    throw new Error('useAdSense must be used within AdSenseProvider');
  }
  return context;
};

interface AdSenseProviderProps {
  children: React.ReactNode;
  clientId?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
    googletag: any;
    gtag?: (command: string, target: string, config?: any) => void;
  }
}

export const AdSenseProvider: React.FC<AdSenseProviderProps> = ({ 
  children, 
  clientId = "ca-pub-5766122497657850" 
}) => {
  const { isPremium } = useAuth();
  const { hasConsent, preferences } = useGDPRConsent();
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);

  // Zobrazovat reklamy pouze pokud:
  // 1. Uživatel není premium
  // 2. Má souhlas s reklamními cookies (GDPR)
  const hasAdvertisingConsent = hasConsent && preferences.advertising;
  const shouldShowAds = !isPremium && hasAdvertisingConsent;

  useEffect(() => {
    // Načíst AdSense script pouze pokud má uživatel souhlas
    if (!shouldShowAds) {
      setIsAdSenseLoaded(false);
      return;
    }

    const loadAdSenseScript = () => {
      if (document.querySelector('script[src*="adsbygoogle.js"]')) {
        setIsAdSenseLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        setIsAdSenseLoaded(true);
        window.adsbygoogle = window.adsbygoogle || [];
        console.log('AdSense script loaded with GDPR consent');
      };

      script.onerror = () => {
        console.error('Failed to load Google AdSense script');
      };

      document.head.appendChild(script);
    };

    loadAdSenseScript();
  }, [shouldShowAds, clientId]);

  const loadAd = (adSlotId: string, elementId: string) => {
    if (!isAdSenseLoaded || !shouldShowAds) {
      console.log('AdSense ad not loaded - missing consent or not loaded');
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log(`AdSense ad loaded: ${adSlotId}`);
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  };

  const trackAdView = (adType: string) => {
    if (!shouldShowAds) return;
    
    console.log(`AdSense view tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: isPremium,
      hasConsent: hasConsent,
      advertisingConsent: preferences.advertising
    });
    
    if (window.gtag && preferences.analytics) {
      window.gtag('event', 'ad_view', { 
        ad_type: adType,
        ad_platform: 'adsense'
      });
    }
  };

  const trackAdClick = (adType: string) => {
    if (!shouldShowAds) return;
    
    console.log(`AdSense click tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: isPremium,
      hasConsent: hasConsent,
      advertisingConsent: preferences.advertising
    });
    
    if (window.gtag && preferences.analytics) {
      window.gtag('event', 'ad_click', { 
        ad_type: adType,
        ad_platform: 'adsense'
      });
    }
  };

  return (
    <AdSenseContext.Provider value={{
      shouldShowAds,
      isAdSenseLoaded,
      loadAd,
      trackAdView,
      trackAdClick,
      hasAdvertisingConsent
    }}>
      {children}
    </AdSenseContext.Provider>
  );
};

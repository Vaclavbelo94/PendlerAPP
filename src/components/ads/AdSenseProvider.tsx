
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AdSenseContextType {
  shouldShowAds: boolean;
  isAdSenseLoaded: boolean;
  loadAd: (adSlotId: string, elementId: string) => void;
  trackAdView: (adType: string) => void;
  trackAdClick: (adType: string) => void;
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
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);

  const shouldShowAds = !isPremium;

  useEffect(() => {
    if (!shouldShowAds) return;

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
      };

      script.onerror = () => {
        console.error('Failed to load Google AdSense script');
      };

      document.head.appendChild(script);
    };

    loadAdSenseScript();
  }, [shouldShowAds, clientId]);

  const loadAd = (adSlotId: string, elementId: string) => {
    if (!isAdSenseLoaded || !shouldShowAds) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  };

  const trackAdView = (adType: string) => {
    if (!shouldShowAds) return;
    
    console.log(`AdSense view tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: isPremium
    });
    
    if (window.gtag) {
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
      userPremium: isPremium
    });
    
    if (window.gtag) {
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
      trackAdClick
    }}>
      {children}
    </AdSenseContext.Provider>
  );
};

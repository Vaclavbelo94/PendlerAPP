
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
  clientId?: string; // Google AdSense Client ID
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
  clientId = "ca-pub-YOUR_PUBLISHER_ID" 
}) => {
  const { isPremium } = useAuth();
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);

  // Determine if ads should be shown
  const shouldShowAds = !isPremium;

  useEffect(() => {
    if (!shouldShowAds) return;

    // Load Google AdSense script
    const loadAdSenseScript = () => {
      // Check if script is already loaded
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
        // Initialize adsbygoogle array if not exists
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
      // Push ad to AdSense queue
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
    
    // Here you can integrate with Google Analytics or other tracking
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
    
    // Track clicks with Google Analytics
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


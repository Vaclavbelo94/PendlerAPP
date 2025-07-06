import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useGDPRConsent } from '@/contexts/GDPRConsentContext';

interface MediaNetContextType {
  shouldShowAds: boolean;
  isMediaNetLoaded: boolean;
  loadAd: (adSlotId: string, elementId: string) => void;
  trackAdView: (adType: string) => void;
  trackAdClick: (adType: string) => void;
  hasAdvertisingConsent: boolean;
}

const MediaNetContext = createContext<MediaNetContextType | undefined>(undefined);

export const useMediaNet = () => {
  const context = useContext(MediaNetContext);
  if (!context) {
    throw new Error('useMediaNet must be used within MediaNetProvider');
  }
  return context;
};

interface MediaNetProviderProps {
  children: React.ReactNode;
  siteId?: string;
}

declare global {
  interface Window {
    medianet_width: string;
    medianet_height: string;
    medianet_crid: string;
    medianet_versionId: string;
    medianet?: any;
    gtag?: (command: string, target: string, config?: any) => void;
  }
}

export const MediaNetProvider: React.FC<MediaNetProviderProps> = ({ 
  children, 
  siteId = "YOUR_MEDIA_NET_SITE_ID" 
}) => {
  const { unifiedUser } = useAuth();
  const { hasConsent, preferences } = useGDPRConsent();
  const [isMediaNetLoaded, setIsMediaNetLoaded] = useState(false);

  // Zobrazovat reklamy pouze pokud:
  // 1. Uživatel není premium
  // 2. Má souhlas s reklamními cookies (GDPR)
  const hasAdvertisingConsent = hasConsent && preferences.advertising;
  const shouldShowAds = !unifiedUser?.isPremium && hasAdvertisingConsent;

  useEffect(() => {
    // Načíst Media.net script pouze pokud má uživatel souhlas
    if (!shouldShowAds) {
      setIsMediaNetLoaded(false);
      return;
    }

    const loadMediaNetScript = () => {
      if (document.querySelector('script[src*="contextual.media.net"]')) {
        setIsMediaNetLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://contextual.media.net/dmedianet.js?cid=8CU2W7439';
      script.type = 'text/javascript';
      
      script.onload = () => {
        setIsMediaNetLoaded(true);
        console.log('Media.net script loaded with GDPR consent');
      };

      script.onerror = () => {
        console.error('Failed to load Media.net script');
      };

      document.head.appendChild(script);
    };

    loadMediaNetScript();
  }, [shouldShowAds, siteId]);

  const loadAd = (adSlotId: string, elementId: string) => {
    if (!isMediaNetLoaded || !shouldShowAds) {
      console.log('Media.net ad not loaded - missing consent or not loaded');
      return;
    }

    try {
      // Media.net specific ad loading
      if (window.medianet) {
        window.medianet_width = "728";
        window.medianet_height = "90";
        window.medianet_crid = adSlotId;
        window.medianet_versionId = "3121199";
        console.log(`Media.net ad loaded: ${adSlotId}`);
      }
    } catch (error) {
      console.error('Error loading Media.net ad:', error);
    }
  };

  const trackAdView = (adType: string) => {
    if (!shouldShowAds) return;
    
    console.log(`Media.net view tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: unifiedUser?.isPremium,
      hasConsent: hasConsent,
      advertisingConsent: preferences.advertising
    });
    
    if (window.gtag && preferences.analytics) {
      window.gtag('event', 'ad_view', { 
        ad_type: adType,
        ad_platform: 'medianet'
      });
    }
  };

  const trackAdClick = (adType: string) => {
    if (!shouldShowAds) return;
    
    console.log(`Media.net click tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: unifiedUser?.isPremium,
      hasConsent: hasConsent,
      advertisingConsent: preferences.advertising
    });
    
    if (window.gtag && preferences.analytics) {
      window.gtag('event', 'ad_click', { 
        ad_type: adType,
        ad_platform: 'medianet'
      });
    }
  };

  return (
    <MediaNetContext.Provider value={{
      shouldShowAds,
      isMediaNetLoaded,
      loadAd,
      trackAdView,
      trackAdClick,
      hasAdvertisingConsent
    }}>
      {children}
    </MediaNetContext.Provider>
  );
};
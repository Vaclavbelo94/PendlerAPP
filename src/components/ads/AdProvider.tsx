
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AdContextType {
  shouldShowAds: boolean;
  adConfig: {
    bannerFrequency: number;
    popupFrequency: number;
    interstitialFrequency: number;
  };
  trackAdView: (adType: string) => void;
  trackAdClick: (adType: string) => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within AdProvider');
  }
  return context;
};

interface AdProviderProps {
  children: React.ReactNode;
}

interface AdminAdSettings {
  adsEnabled: boolean;
  bannerAdsEnabled: boolean;
  popupAdsEnabled: boolean;
  interstitialAdsEnabled: boolean;
  globalAdOverride: boolean;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const { isPremium } = useAuth();
  const [adViews, setAdViews] = useState(0);
  const [adClicks, setAdClicks] = useState(0);
  const [adminSettings, setAdminSettings] = useState<AdminAdSettings>({
    adsEnabled: true,
    bannerAdsEnabled: true,
    popupAdsEnabled: true,
    interstitialAdsEnabled: true,
    globalAdOverride: false
  });

  // Load admin settings on mount
  useEffect(() => {
    const loadAdminSettings = () => {
      try {
        const savedSettings = localStorage.getItem('admin_ad_settings');
        if (savedSettings) {
          setAdminSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading admin ad settings:', error);
      }
    };

    loadAdminSettings();

    // Listen for admin settings changes
    const handleAdminSettingsChange = (event: CustomEvent) => {
      setAdminSettings(event.detail);
    };

    window.addEventListener('adminAdSettingsChanged', handleAdminSettingsChange as EventListener);

    return () => {
      window.removeEventListener('adminAdSettingsChanged', handleAdminSettingsChange as EventListener);
    };
  }, []);

  // Determine if ads should be shown based on premium status and admin settings
  const shouldShowAds = !isPremium && 
                       adminSettings.adsEnabled && 
                       !adminSettings.globalAdOverride;

  const adConfig = {
    bannerFrequency: adminSettings.bannerAdsEnabled ? 1 : 0,
    popupFrequency: adminSettings.popupAdsEnabled ? 5 : 0,
    interstitialFrequency: adminSettings.interstitialAdsEnabled ? 10 : 0,
  };

  const trackAdView = (adType: string) => {
    if (!shouldShowAds) return;
    
    setAdViews(prev => prev + 1);
    console.log(`Ad view tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: isPremium,
      adminSettings
    });
    
    // Here you would integrate with actual ad tracking service
    // gtag('event', 'ad_view', { ad_type: adType });
  };

  const trackAdClick = (adType: string) => {
    if (!shouldShowAds) return;
    
    setAdClicks(prev => prev + 1);
    console.log(`Ad click tracked: ${adType}`, {
      timestamp: new Date().toISOString(),
      adType,
      userPremium: isPremium,
      adminSettings
    });
    
    // Here you would integrate with actual ad tracking service
    // gtag('event', 'ad_click', { ad_type: adType });
  };

  return (
    <AdContext.Provider value={{
      shouldShowAds,
      adConfig,
      trackAdView,
      trackAdClick
    }}>
      {children}
    </AdContext.Provider>
  );
};

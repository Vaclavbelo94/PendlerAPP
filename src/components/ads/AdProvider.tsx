
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

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const { isPremium } = useAuth();
  const [adViews, setAdViews] = useState(0);
  const [adClicks, setAdClicks] = useState(0);

  const shouldShowAds = !isPremium;

  const adConfig = {
    bannerFrequency: 1, // Show banner on every page
    popupFrequency: 5, // Show popup every 5 page views for non-premium
    interstitialFrequency: 10, // Show interstitial every 10 actions
  };

  const trackAdView = (adType: string) => {
    if (!shouldShowAds) return;
    
    setAdViews(prev => prev + 1);
    console.log(`Ad view tracked: ${adType}`);
    
    // Here you would integrate with actual ad tracking service
    // gtag('event', 'ad_view', { ad_type: adType });
  };

  const trackAdClick = (adType: string) => {
    if (!shouldShowAds) return;
    
    setAdClicks(prev => prev + 1);
    console.log(`Ad click tracked: ${adType}`);
    
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

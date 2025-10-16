import React, { createContext, useContext, ReactNode } from 'react';
import { useUnifiedOrientation } from '@/hooks/useUnifiedOrientation';
import { useCapacitor } from '@/hooks/useCapacitor';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  isSmallLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  isAndroid: boolean;
  isIOS: boolean;
  isNative: boolean;
  platform: string;
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
}

const MobileContext = createContext<DeviceInfo | undefined>(undefined);

export const MobileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const orientation = useUnifiedOrientation();
  const capacitor = useCapacitor();

  // Determine screen size category
  const getScreenSize = (width: number): 'small' | 'medium' | 'large' | 'xlarge' => {
    if (width < 640) return 'small';
    if (width < 768) return 'medium';
    if (width < 1024) return 'large';
    return 'xlarge';
  };

  const deviceInfo: DeviceInfo = {
    ...orientation,
    isAndroid: capacitor.isAndroid,
    isIOS: capacitor.isIOS,
    isNative: capacitor.isNative,
    platform: capacitor.platform,
    screenSize: getScreenSize(orientation.screenWidth),
  };

  return (
    <MobileContext.Provider value={deviceInfo}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileContext = (): DeviceInfo => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobileContext must be used within a MobileProvider');
  }
  return context;
};

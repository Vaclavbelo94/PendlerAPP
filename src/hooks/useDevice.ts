import { useMobileContext } from '@/contexts/MobileContext';

/**
 * Unified device detection hook
 * Combines mobile detection, orientation, platform info
 * @returns Complete device information
 */
export const useDevice = () => {
  const device = useMobileContext();

  return {
    // Device type
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    
    // Orientation
    orientation: device.orientation,
    isPortrait: device.orientation === 'portrait',
    isLandscape: device.orientation === 'landscape',
    isSmallLandscape: device.isSmallLandscape,
    
    // Screen info
    screenWidth: device.screenWidth,
    screenHeight: device.screenHeight,
    screenSize: device.screenSize,
    
    // Platform
    isAndroid: device.isAndroid,
    isIOS: device.isIOS,
    isNative: device.isNative,
    isWeb: device.platform === 'web',
    platform: device.platform,
    
    // Convenience flags
    isMobilePortrait: device.isMobile && device.orientation === 'portrait',
    isMobileLandscape: device.isMobile && device.orientation === 'landscape',
    isTabletPortrait: device.isTablet && device.orientation === 'portrait',
    isTabletLandscape: device.isTablet && device.orientation === 'landscape',
  };
};

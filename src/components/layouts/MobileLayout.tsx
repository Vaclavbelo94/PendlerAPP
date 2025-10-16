import React, { ReactNode } from 'react';
import { useDevice } from '@/hooks/useDevice';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  enableSafeArea?: boolean;
  disablePortraitPadding?: boolean;
  fullHeight?: boolean;
}

/**
 * Universal mobile layout wrapper
 * Automatically adapts to device type, orientation, and platform
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  enableSafeArea = true,
  disablePortraitPadding = false,
  fullHeight = true,
}) => {
  const device = useDevice();

  const layoutClasses = cn(
    'w-full relative',
    {
      // Full height handling
      'min-h-screen': fullHeight && device.isDesktop,
      'min-h-[100dvh]': fullHeight && !device.isDesktop,
      
      // Safe area padding (for notches, etc.)
      'mobile-safe-area': enableSafeArea && (device.isMobile || device.isTablet),
      
      // Portrait mobile optimizations
      'portrait-layout': device.isMobilePortrait && !disablePortraitPadding,
      
      // Landscape mobile optimizations
      'landscape-layout': device.isMobileLandscape,
      'landscape-compact': device.isSmallLandscape,
      
      // Tablet optimizations
      'tablet-layout': device.isTablet,
      
      // Desktop
      'desktop-layout': device.isDesktop,
      
      // Platform specific
      'native-app': device.isNative,
      'capacitor-android': device.isAndroid && device.isNative,
      'capacitor-ios': device.isIOS && device.isNative,
    },
    className
  );

  return (
    <div className={layoutClasses} data-device={device.platform}>
      {children}
    </div>
  );
};

export default MobileLayout;

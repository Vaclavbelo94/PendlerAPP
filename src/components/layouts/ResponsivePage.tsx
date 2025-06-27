
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { cn } from '@/lib/utils';

interface ResponsivePageProps {
  children: React.ReactNode;
  className?: string;
  enableLandscapeOptimization?: boolean;
  enableMobileSafeArea?: boolean;
}

export const ResponsivePage: React.FC<ResponsivePageProps> = ({
  children,
  className,
  enableLandscapeOptimization = true,
  enableMobileSafeArea = true
}) => {
  const isMobile = useIsMobile();
  const { orientation } = useScreenOrientation();
  
  const isLandscapeMobile = isMobile && orientation === 'landscape';
  const isPortraitMobile = isMobile && orientation === 'portrait';
  
  const pageClasses = cn(
    'min-h-screen w-full relative',
    {
      // Mobile portrait optimizations
      'mobile-safe-area pt-20 pb-20': isPortraitMobile && enableMobileSafeArea,
      'landscape-optimized px-2 py-1': isLandscapeMobile && enableLandscapeOptimization,
      'px-4 py-4': !isMobile,
      // Desktop stability
      'desktop-stable': !isMobile,
    },
    className
  );
  
  return (
    <div className={pageClasses} role="main">
      {/* Mobile safe area wrapper */}
      {isPortraitMobile && enableMobileSafeArea ? (
        <div className="mobile-content-safe px-4 py-2">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ResponsivePage;

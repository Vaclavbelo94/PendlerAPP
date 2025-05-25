
import React from 'react';
import { useIsMobile, useOrientation } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsivePageProps {
  children: React.ReactNode;
  className?: string;
  enableLandscapeOptimization?: boolean;
}

export const ResponsivePage: React.FC<ResponsivePageProps> = ({
  children,
  className,
  enableLandscapeOptimization = true
}) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  const isLandscapeMobile = isMobile && orientation === 'landscape';
  
  const pageClasses = cn(
    'min-h-screen w-full',
    {
      // Landscape mobile optimizations
      'landscape-optimized': isLandscapeMobile && enableLandscapeOptimization,
      'px-2 py-1': isLandscapeMobile,
      'px-3 py-2': isMobile && orientation === 'portrait',
      'px-4 py-4': !isMobile,
    },
    className
  );
  
  return (
    <div className={pageClasses} role="main">
      {children}
    </div>
  );
};

export default ResponsivePage;

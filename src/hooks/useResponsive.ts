
import { useState, useEffect } from 'react';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    screenSize: 'mobile'
  });

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const isLandscape = width > height;
      
      let screenSize: 'mobile' | 'tablet' | 'desktop' = 'mobile';
      if (isDesktop) screenSize = 'desktop';
      else if (isTablet) screenSize = 'tablet';
      
      setState({
        isMobile,
        isTablet,
        isDesktop,
        isLandscape,
        screenSize
      });
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    window.addEventListener('orientationchange', checkResponsive);

    return () => {
      window.removeEventListener('resize', checkResponsive);
      window.removeEventListener('orientationchange', checkResponsive);
    };
  }, []);

  return state;
};

// Utility hook pro grid columns
export const useResponsiveColumns = (
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3
) => {
  const { screenSize } = useResponsive();
  
  switch (screenSize) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet;
    case 'desktop':
      return desktop;
    default:
      return mobile;
  }
};

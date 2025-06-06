
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useScreenOrientation = () => {
  const isMobile = useIsMobile();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isSmallLandscape, setIsSmallLandscape] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
      
      // Check for small landscape screens (height < 500px)
      setIsSmallLandscape(isLandscape && window.innerHeight < 500);
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return {
    isMobile,
    orientation,
    isSmallLandscape,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
};

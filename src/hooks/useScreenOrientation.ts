
import { useState, useEffect } from 'react';

export interface ScreenOrientation {
  isLandscape: boolean;
  isPortrait: boolean;
  isMobile: boolean;
  isSmallLandscape: boolean;
}

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState<ScreenOrientation>({
    isLandscape: false,
    isPortrait: true,
    isMobile: false,
    isSmallLandscape: false
  });

  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width <= 768;
      const isLandscape = width > height;
      const isPortrait = height > width;
      const isSmallLandscape = isLandscape && height <= 500;

      setOrientation({
        isLandscape,
        isPortrait,
        isMobile,
        isSmallLandscape
      });
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
};

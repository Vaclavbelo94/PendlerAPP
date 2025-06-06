
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

export const useScreenOrientation = () => {
  const isMobile = useIsMobile();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isSmallLandscape, setIsSmallLandscape] = useState(false);

  const updateOrientation = useCallback(() => {
    try {
      const isLandscape = window.innerWidth > window.innerHeight;
      const newOrientation = isLandscape ? 'landscape' : 'portrait';
      const newIsSmallLandscape = isLandscape && window.innerHeight < 500;
      
      console.log('ScreenOrientation: Update', { 
        width: window.innerWidth, 
        height: window.innerHeight, 
        orientation: newOrientation,
        isSmallLandscape: newIsSmallLandscape 
      });
      
      setOrientation(newOrientation);
      setIsSmallLandscape(newIsSmallLandscape);
    } catch (error) {
      console.error('ScreenOrientation: Error updating orientation', error);
    }
  }, []);

  useEffect(() => {
    // Initial update
    updateOrientation();

    // Debounced event handler
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateOrientation, 100);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, [updateOrientation]);

  return {
    isMobile,
    orientation,
    isSmallLandscape,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
};

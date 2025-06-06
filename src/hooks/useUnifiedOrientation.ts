
import { useState, useEffect, useCallback } from 'react';

interface OrientationState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  isSmallLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
}

export const useUnifiedOrientation = () => {
  const [state, setState] = useState<OrientationState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        orientation: 'portrait',
        isSmallLandscape: false,
        screenWidth: 1920,
        screenHeight: 1080
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;

    return {
      isMobile: width <= 768,
      isTablet: width > 768 && width <= 1024,
      isDesktop: width > 1024,
      orientation: isLandscape ? 'landscape' : 'portrait',
      isSmallLandscape: isLandscape && height < 500,
      screenWidth: width,
      screenHeight: height
    };
  });

  const updateOrientation = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;

    const newState: OrientationState = {
      isMobile: width <= 768,
      isTablet: width > 768 && width <= 1024,
      isDesktop: width > 1024,
      orientation: isLandscape ? 'landscape' : 'portrait',
      isSmallLandscape: isLandscape && height < 500,
      screenWidth: width,
      screenHeight: height
    };

    setState(prevState => {
      // Only update if something actually changed
      const hasChanged = Object.keys(newState).some(
        key => newState[key as keyof OrientationState] !== prevState[key as keyof OrientationState]
      );
      
      return hasChanged ? newState : prevState;
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateOrientation, 100);
    };

    // Initial update
    updateOrientation();

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, [updateOrientation]);

  return state;
};

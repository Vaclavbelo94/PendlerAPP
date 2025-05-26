
import * as React from "react"

export const MOBILE_BREAKPOINT = 768
export const TABLET_BREAKPOINT = 1024
export const DESKTOP_BREAKPOINT = 1280

export type DeviceSize = "mobile" | "tablet" | "desktop"

// Optimalizovaná verze detekce mobilních zařízení s prevencí problikávání
export function useIsMobile() {
  // Synchronní inicializace na základě window.innerWidth
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    return width < MOBILE_BREAKPOINT || isMobileDevice;
  });

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkIsMobile = () => {
      // Debounce pro zabránění častým změnám
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        
        const newIsMobile = width < MOBILE_BREAKPOINT || isMobileDevice;
        setIsMobile(prev => prev !== newIsMobile ? newIsMobile : prev);
      }, 150); // Debounce delay
    };
    
    // Pouze přidat event listener bez okamžité změny
    window.addEventListener("resize", checkIsMobile, { passive: true });
    window.addEventListener("orientationchange", checkIsMobile, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("orientationchange", checkIsMobile);
    };
  }, []);

  return isMobile;
}

// Optimalizovaná verze detekce velikosti zařízení
export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<DeviceSize>(() => {
    if (typeof window === 'undefined') return "desktop";
    
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    
    if (width < MOBILE_BREAKPOINT || isMobileDevice) {
      return "mobile";
    } else if (width < TABLET_BREAKPOINT) {
      return "tablet";
    } else {
      return "desktop";
    }
  });

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkDeviceSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        
        let newDeviceSize: DeviceSize;
        if (width < MOBILE_BREAKPOINT || isMobileDevice) {
          newDeviceSize = "mobile";
        } else if (width < TABLET_BREAKPOINT) {
          newDeviceSize = "tablet";
        } else {
          newDeviceSize = "desktop";
        }
        
        setDeviceSize(prev => prev !== newDeviceSize ? newDeviceSize : prev);
      }, 150);
    };

    window.addEventListener("resize", checkDeviceSize, { passive: true });
    window.addEventListener("orientationchange", checkDeviceSize, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkDeviceSize);
      window.removeEventListener("orientationchange", checkDeviceSize);
    };
  }, []);

  return deviceSize;
}

// Hook pro detekci orientace s optimalizací
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">(() => {
    if (typeof window === 'undefined') return "portrait";
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  });

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkOrientation = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newOrientation = window.innerHeight > window.innerWidth ? "portrait" : "landscape";
        setOrientation(prev => prev !== newOrientation ? newOrientation : prev);
      }, 100);
    };

    window.addEventListener("resize", checkOrientation, { passive: true });
    window.addEventListener("orientationchange", checkOrientation, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  return orientation;
}

// Hook pro detekci touch zařízení
export function useIsTouch() {
  const [isTouch, setIsTouch] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  React.useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

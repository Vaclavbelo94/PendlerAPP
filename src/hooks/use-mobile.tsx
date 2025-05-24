
import * as React from "react"

export const MOBILE_BREAKPOINT = 768
export const TABLET_BREAKPOINT = 1024
export const DESKTOP_BREAKPOINT = 1280

export type DeviceSize = "mobile" | "tablet" | "desktop" | undefined

// Optimalizovaná verze detekce mobilních zařízení
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      // Také kontrolujeme user agent pro better mobile detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      
      setIsMobile(width < MOBILE_BREAKPOINT || isMobileDevice);
    };
    
    // Inicializovat hodnotu
    checkIsMobile();
    
    // Přidat event listener pro změnu velikosti okna
    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("orientationchange", checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("orientationchange", checkIsMobile);
    };
  }, []);

  return isMobile === undefined ? false : isMobile;
}

// Optimalizovaná verze detekce velikosti zařízení
export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<DeviceSize>(undefined)

  React.useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      
      if (width < MOBILE_BREAKPOINT || isMobileDevice) {
        setDeviceSize("mobile")
      } else if (width < TABLET_BREAKPOINT) {
        setDeviceSize("tablet")
      } else {
        setDeviceSize("desktop")
      }
    }

    // Inicializovat hodnotu a přidat event listener
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    window.addEventListener("orientationchange", checkDeviceSize);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkDeviceSize);
      window.removeEventListener("orientationchange", checkDeviceSize);
    };
  }, []);

  return deviceSize;
}

// Hook pro detekci orientace (užitečné pro mobilní zařízení)
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">("portrait");

  React.useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? "portrait" : "landscape");
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  return orientation;
}

// Hook pro detekci touch zařízení
export function useIsTouch() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

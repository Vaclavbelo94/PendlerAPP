
import * as React from "react"

export const MOBILE_BREAKPOINT = 768
export const TABLET_BREAKPOINT = 1024
export const DESKTOP_BREAKPOINT = 1280

export type DeviceSize = "mobile" | "tablet" | "desktop" | undefined

// Optimalizovaná verze detekce mobilních zařízení
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Inicializovat hodnotu
    checkIsMobile();
    
    // Přidat event listener pro změnu velikosti okna
    window.addEventListener("resize", checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile === undefined ? false : isMobile;
}

// Optimalizovaná verze detekce velikosti zařízení
export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<DeviceSize>(undefined)

  React.useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
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
    
    // Cleanup
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  return deviceSize;
}

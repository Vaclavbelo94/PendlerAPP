
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  // Detect mobile devices including orientation and touch capability
  const getInitialState = () => {
    if (typeof window === 'undefined') return false;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Consider it mobile if:
    // 1. Width is below mobile breakpoint, OR
    // 2. It's a touch device with width below tablet breakpoint, OR
    // 3. It's a known mobile user agent and width is reasonable for mobile
    return width < MOBILE_BREAKPOINT || 
           (hasTouch && width < TABLET_BREAKPOINT) ||
           (isMobileUserAgent && width < TABLET_BREAKPOINT);
  };

  const [isMobile, setIsMobile] = React.useState<boolean>(getInitialState)

  React.useEffect(() => {
    const updateMobileState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      const newIsMobile = width < MOBILE_BREAKPOINT || 
                         (hasTouch && width < TABLET_BREAKPOINT) ||
                         (isMobileUserAgent && width < TABLET_BREAKPOINT);
      
      setIsMobile(newIsMobile);
    };

    // Set initial state
    updateMobileState();

    // Listen for resize and orientation changes
    window.addEventListener("resize", updateMobileState);
    window.addEventListener("orientationchange", updateMobileState);
    
    return () => {
      window.removeEventListener("resize", updateMobileState);
      window.removeEventListener("orientationchange", updateMobileState);
    };
  }, [])

  return isMobile
}

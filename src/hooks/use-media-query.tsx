
import { useEffect, useState } from "react";

type MediaQueryType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "dark" | "light" | "portrait" | "landscape";

const mediaQueries = {
  xs: "(max-width: 639px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
  dark: "(prefers-color-scheme: dark)",
  light: "(prefers-color-scheme: light)",
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
};

/**
 * React hook for detecting if the current viewport matches the specified media query
 */
export function useMediaQuery(query: MediaQueryType | string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // For server-side rendering / initial render before hydration
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(
      mediaQueries[query as MediaQueryType] || query
    );

    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    updateMatches();

    // Listen for changes
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener("change", updateMatches);
      return () => {
        mediaQuery.removeEventListener("change", updateMatches);
      };
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateMatches);
      return () => {
        mediaQuery.removeListener(updateMatches);
      };
    }
  }, [query]);

  return matches;
}

export default useMediaQuery;


import { useEffect, useState } from "react";

// Typy mediálních dotazů
export type MediaQueryType = 
  | "xs" 
  | "sm" 
  | "md" 
  | "lg" 
  | "xl" 
  | "2xl" 
  | "dark" 
  | "light" 
  | "portrait" 
  | "landscape"
  | "reduced-motion"
  | "high-contrast"
  | "print"
  | "hover"
  | "touch";

// Definice mediálních dotazů pro různé velikosti obrazovky a preference
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
  "reduced-motion": "(prefers-reduced-motion: reduce)",
  "high-contrast": "(prefers-contrast: more)",
  "print": "(print)",
  "hover": "(hover: hover)",
  "touch": "(hover: none) and (pointer: coarse)"
};

/**
 * React hook pro detekci, zda aktuální viewport odpovídá zadanému mediálnímu dotazu
 * @param query - Klíč definovaného mediálního dotazu nebo vlastní mediální dotaz
 * @returns boolean - Indikuje, zda mediální dotaz odpovídá aktuálnímu stavu
 * @example
 * // Použití s předdefinovaným dotazem
 * const isMobile = useMediaQuery("xs");
 * 
 * // Použití s vlastním dotazem
 * const isPrint = useMediaQuery("print");
 * 
 * // Použití pro přístupnost
 * const prefersReducedMotion = useMediaQuery("reduced-motion");
 * 
 * // Detekce dotykových zařízení
 * const isTouch = useMediaQuery("touch");
 */
export function useMediaQuery(query: MediaQueryType | string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Pro server-side rendering nebo počáteční vykreslení před hydratací
    setMounted(true);
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(
      mediaQueries[query as MediaQueryType] || query
    );

    // Aktualizace stavu při změně mediálního dotazu
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    // Nastavení počáteční hodnoty
    updateMatches();

    // Moderní způsob naslouchání změnám (standardizovaný)
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener("change", updateMatches);
      return () => {
        mediaQuery.removeEventListener("change", updateMatches);
      };
    } else {
      // Fallback pro starší prohlížeče
      mediaQuery.addListener(updateMatches);
      return () => {
        mediaQuery.removeListener(updateMatches);
      };
    }
  }, [query]);

  // Pro SSR vrátí false do doby, než se komponenta namountuje na klientovi
  return mounted ? matches : false;
}

export default useMediaQuery;

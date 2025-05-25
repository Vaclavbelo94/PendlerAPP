
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export const useIndexScrollHandling = () => {
  const [scrollY, setScrollY] = useState(0);
  const [animatedHeroVisible, setAnimatedHeroVisible] = useState(false);

  // Debounced scroll pro lepší výkon
  const debouncedScrollY = useDebounce(scrollY, 10);
  const scrolled = debouncedScrollY > 500;

  // Optimalizovaný scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show animated hero after a short delay for better perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHeroVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    scrolled,
    animatedHeroVisible
  };
};

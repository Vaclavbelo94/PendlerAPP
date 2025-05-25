
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    const scrollToTop = () => {
      try {
        // For mobile devices - use smooth scroll
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        // Also ensure document elements are scrolled to top
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (error) {
        // Fallback for older browsers
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;


import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteOptimizerProps {
  children: React.ReactNode;
}

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Preload next likely routes based on current route
    const preloadRoutes = () => {
      const currentPath = location.pathname;
      let likelyNextRoutes: string[] = [];

      switch (currentPath) {
        case '/':
          likelyNextRoutes = ['/dashboard', '/register', '/login'];
          break;
        case '/dashboard':
          likelyNextRoutes = ['/shifts', '/tax-advisor', '/vehicle'];
          break;
        case '/shifts':
          likelyNextRoutes = ['/dashboard', '/tax-advisor'];
          break;
        case '/tax-advisor':
          likelyNextRoutes = ['/dashboard', '/shifts'];
          break;
        default:
          likelyNextRoutes = ['/dashboard'];
      }

      // Create prefetch links
      likelyNextRoutes.forEach(route => {
        const existingLink = document.querySelector(`link[href="${route}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        }
      });
    };

    // Delay preloading to avoid blocking current page
    const timer = setTimeout(preloadRoutes, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Clean up old prefetch links
    const cleanupPrefetchLinks = () => {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      if (prefetchLinks.length > 10) {
        // Remove oldest prefetch links
        Array.from(prefetchLinks)
          .slice(0, prefetchLinks.length - 10)
          .forEach(link => link.remove());
      }
    };

    cleanupPrefetchLinks();
  }, [location.pathname]);

  return <>{children}</>;
};

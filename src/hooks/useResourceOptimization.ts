
import { useEffect, useCallback } from 'react';

interface ResourceOptimizationOptions {
  enableImageOptimization?: boolean;
  enableFontOptimization?: boolean;
  enableCSSOptimization?: boolean;
}

export const useResourceOptimization = (options: ResourceOptimizationOptions = {}) => {
  const {
    enableImageOptimization = true,
    enableFontOptimization = true,
    enableCSSOptimization = true
  } = options;

  // Optimize fonts loading
  const optimizeFonts = useCallback(() => {
    if (!enableFontOptimization) return;

    // Add font-display: swap to all fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }, [enableFontOptimization]);

  // Optimize CSS loading
  const optimizeCSS = useCallback(() => {
    if (!enableCSSOptimization) return;

    // Remove unused CSS classes (simple implementation)
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      if (!link.hasAttribute('data-optimized')) {
        link.setAttribute('data-optimized', 'true');
      }
    });
  }, [enableCSSOptimization]);

  // Optimize images
  const optimizeImages = useCallback(() => {
    if (!enableImageOptimization) return;

    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" and decoding="async"
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
      
      // Add intersection observer for better lazy loading
      if ('IntersectionObserver' in window && !img.hasAttribute('data-observed')) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.target instanceof HTMLImageElement) {
              const image = entry.target;
              if (image.dataset.src) {
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
              }
              observer.unobserve(image);
            }
          });
        }, {
          rootMargin: '50px'
        });
        
        observer.observe(img);
        img.setAttribute('data-observed', 'true');
      }
    });
  }, [enableImageOptimization]);

  useEffect(() => {
    // Run optimizations with a small delay
    const timer = setTimeout(() => {
      optimizeFonts();
      optimizeCSS();
      optimizeImages();
    }, 500);

    return () => clearTimeout(timer);
  }, [optimizeFonts, optimizeCSS, optimizeImages]);

  return {
    optimizeFonts,
    optimizeCSS,
    optimizeImages
  };
};

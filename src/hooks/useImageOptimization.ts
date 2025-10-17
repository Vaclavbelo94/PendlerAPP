import { useState, useEffect, useRef } from 'react';

interface ImageOptimizationOptions {
  lazy?: boolean;
  placeholder?: string;
  quality?: number;
  blur?: boolean;
}

/**
 * Hook for optimized image loading with lazy loading and blur-up
 */
export const useImageOptimization = (
  src: string,
  options: ImageOptimizationOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentSrc, setCurrentSrc] = useState(options.placeholder || '');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!src) return;

    const loadImage = () => {
      const img = new Image();
      
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        setError(null);
      };
      
      img.onerror = () => {
        setError(new Error('Failed to load image'));
        setIsLoaded(false);
      };
      
      img.src = src;
    };

    if (options.lazy && imgRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observerRef.current?.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before visible
        }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      loadImage();
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, options.lazy, options.placeholder]);

  return {
    src: currentSrc,
    isLoaded,
    error,
    imgRef,
    imgProps: {
      ref: imgRef,
      src: currentSrc,
      loading: options.lazy ? ('lazy' as const) : undefined,
      style: {
        filter: !isLoaded && options.blur ? 'blur(10px)' : 'none',
        transition: 'filter 0.3s ease-out',
      },
    },
  };
};

/**
 * Hook for responsive images
 */
export const useResponsiveImage = (
  srcSet: { [key: string]: string },
  fallback: string
) => {
  const [currentSrc, setCurrentSrc] = useState(fallback);

  useEffect(() => {
    const updateImage = () => {
      const width = window.innerWidth;
      
      if (width < 640 && srcSet.sm) {
        setCurrentSrc(srcSet.sm);
      } else if (width < 768 && srcSet.md) {
        setCurrentSrc(srcSet.md);
      } else if (width < 1024 && srcSet.lg) {
        setCurrentSrc(srcSet.lg);
      } else if (srcSet.xl) {
        setCurrentSrc(srcSet.xl);
      } else {
        setCurrentSrc(fallback);
      }
    };

    updateImage();
    window.addEventListener('resize', updateImage);
    
    return () => window.removeEventListener('resize', updateImage);
  }, [srcSet, fallback]);

  return currentSrc;
};

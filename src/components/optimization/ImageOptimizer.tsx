
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  quality = 80,
  format = 'auto',
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
  fallbackSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(placeholder || '');
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Generate optimized image URL
  const getOptimizedSrc = useCallback((originalSrc: string): string => {
    if (!originalSrc || originalSrc.startsWith('data:')) return originalSrc;

    // For external URLs or already optimized URLs, return as-is
    if (originalSrc.startsWith('http') || originalSrc.includes('w_') || originalSrc.includes('q_')) {
      return originalSrc;
    }

    // Build optimization parameters
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== 80) params.append('q', quality.toString());
    if (format !== 'auto') params.append('f', format);

    // For local images, we'll just add params (in production you'd use a service like Cloudinary)
    const hasParams = params.toString();
    return hasParams ? `${originalSrc}?${params.toString()}` : originalSrc;
  }, [width, height, quality, format]);

  // Progressive image loading
  const loadImage = useCallback(async (imageSrc: string) => {
    if (!imageSrc || isLoaded) return;

    try {
      const img = new Image();
      
      img.onload = () => {
        setCurrentSrc(imageSrc);
        setIsLoaded(true);
        setIsError(false);
        onLoad?.();
      };

      img.onerror = () => {
        if (fallbackSrc && imageSrc !== fallbackSrc) {
          // Try fallback
          loadImage(fallbackSrc);
        } else {
          setIsError(true);
          onError?.();
        }
      };

      // Load optimized version
      const optimizedSrc = getOptimizedSrc(imageSrc);
      img.src = optimizedSrc;

    } catch (error) {
      setIsError(true);
      onError?.();
    }
  }, [isLoaded, onLoad, onError, fallbackSrc, getOptimizedSrc]);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager' || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading, isInView]);

  // Load image when it comes into view
  useEffect(() => {
    if (isInView && src && !isLoaded && !isError) {
      loadImage(src);
    }
  }, [isInView, src, isLoaded, isError, loadImage]);

  // Generate placeholder styles
  const placeholderStyle = {
    backgroundColor: '#f3f4f6',
    backgroundImage: placeholder ? `url(${placeholder})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: height || 200,
    width: width || '100%'
  };

  // WebP support detection
  const supportsWebP = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, []);

  // Generate srcSet for responsive images
  const generateSrcSet = useCallback((baseSrc: string): string => {
    if (!width || baseSrc.startsWith('data:')) return '';

    const sizes = [1, 1.5, 2, 3]; // 1x, 1.5x, 2x, 3x
    const srcSet = sizes.map(multiplier => {
      const scaledWidth = Math.round(width * multiplier);
      const optimizedSrc = getOptimizedSrc(baseSrc).replace(
        /w_\d+/g,
        `w_${scaledWidth}`
      );
      return `${optimizedSrc} ${multiplier}x`;
    }).join(', ');

    return srcSet;
  }, [width, getOptimizedSrc]);

  // Render error state
  if (isError) {
    return (
      <div 
        className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}
        style={{ width, height: height || 200 }}
      >
        <div className="text-center">
          <div className="text-sm">Obrázek se nepodařilo načíst</div>
          {alt && <div className="text-xs mt-1">{alt}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={placeholderStyle}
        >
          {!isInView && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-muted-foreground">Načítání...</div>
            </div>
          )}
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={isLoaded ? currentSrc : undefined}
        srcSet={isLoaded && currentSrc ? generateSrcSet(src) : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        style={{
          objectFit: 'cover',
          width: width || '100%',
          height: height || 'auto'
        }}
      />

      {/* Loading indicator */}
      {isInView && !isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;


import { useRef, useEffect, RefObject } from 'react';

interface GestureConfig {
  enableSwipe?: boolean;
  swipeThreshold?: number;
  enablePinch?: boolean;
}

interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
}

export const useMobileGestures = (
  config: GestureConfig = {},
  callbacks: GestureCallbacks = {}
): { containerRef: RefObject<HTMLDivElement> } => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const {
    enableSwipe = true,
    swipeThreshold = 50,
    enablePinch = false
  } = config;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && enableSwipe) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !enableSwipe) return;
      
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;

      // Check if swipe distance exceeds threshold
      if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }

      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enableSwipe, swipeThreshold, callbacks]);

  return { containerRef };
};

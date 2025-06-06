
import { useRef, useEffect, useCallback } from 'react';

interface GestureConfig {
  enableSwipe?: boolean;
  enablePinch?: boolean;
  swipeThreshold?: number;
  pinchThreshold?: number;
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
) => {
  const {
    enableSwipe = true,
    enablePinch = false,
    swipeThreshold = 50,
    pinchThreshold = 0.1
  } = config;

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const initialPinchDistance = useRef<number | null>(null);

  const calculateDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1 && enableSwipe) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    } else if (e.touches.length === 2 && enablePinch) {
      initialPinchDistance.current = calculateDistance(e.touches[0], e.touches[1]);
    }
  }, [enableSwipe, enablePinch, calculateDistance]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.changedTouches.length === 1 && touchStartRef.current && enableSwipe) {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now()
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const deltaTime = touchEnd.time - touchStartRef.current.time;

      // Only process quick swipes (less than 500ms)
      if (deltaTime < 500) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
              callbacks.onSwipeRight?.();
            } else {
              callbacks.onSwipeLeft?.();
            }
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > swipeThreshold) {
            if (deltaY > 0) {
              callbacks.onSwipeDown?.();
            } else {
              callbacks.onSwipeUp?.();
            }
          }
        }
      }

      touchStartRef.current = null;
    } else if (e.touches.length === 0) {
      initialPinchDistance.current = null;
    }
  }, [enableSwipe, swipeThreshold, callbacks]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && enablePinch && initialPinchDistance.current) {
      const currentDistance = calculateDistance(e.touches[0], e.touches[1]);
      const scaleChange = currentDistance / initialPinchDistance.current;

      if (scaleChange < (1 - pinchThreshold)) {
        callbacks.onPinchIn?.();
        initialPinchDistance.current = currentDistance;
      } else if (scaleChange > (1 + pinchThreshold)) {
        callbacks.onPinchOut?.();
        initialPinchDistance.current = currentDistance;
      }
    }
  }, [enablePinch, pinchThreshold, calculateDistance, callbacks]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return { containerRef };
};

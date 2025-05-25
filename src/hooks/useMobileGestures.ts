
import { useState, useEffect, useCallback, useRef } from 'react';

interface TouchPoint {
  x: number;
  y: number;
}

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
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
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

  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);

    if (enablePinch && e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
    }
  }, [enablePinch, getDistance]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    if (enablePinch && e.touches.length === 2 && initialDistance) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;
      
      if (Math.abs(scale - 1) > pinchThreshold) {
        if (scale < 1) {
          callbacks.onPinchIn?.(scale);
        } else {
          callbacks.onPinchOut?.(scale);
        }
      }
    }
  }, [touchStart, enablePinch, initialDistance, pinchThreshold, getDistance, callbacks]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !enableSwipe) return;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < swipeThreshold) return;

    if (absDeltaX > absDeltaY) {
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

    setTouchStart(null);
    setTouchEnd(null);
    setInitialDistance(null);
  }, [touchStart, touchEnd, enableSwipe, swipeThreshold, callbacks]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef: (element: HTMLElement | null) => {
      containerRef.current = element;
    },
    isGestureActive: touchStart !== null
  };
};


import { useRef, useState, useCallback, useEffect } from 'react';

interface MobileGesturesOptions {
  enableSwipe?: boolean;
  enablePinch?: boolean;
  swipeThreshold?: number;
  pinchThreshold?: number;
}

interface MobileGesturesCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
}

export const useMobileGestures = (
  options: MobileGesturesOptions = {},
  callbacks: MobileGesturesCallbacks = {}
) => {
  const {
    enableSwipe = true,
    enablePinch = false,
    swipeThreshold = 50,
    pinchThreshold = 0.1
  } = options;

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut
  } = callbacks;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isGestureActive, setIsGestureActive] = useState(false);
  
  // Touch tracking
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);
  
  // Pinch tracking
  const lastPinchDistance = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Prevent scrolling interference
    if (enableSwipe && e.touches.length === 1) {
      setIsGestureActive(true);
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      touchEnd.current = null;
    }
    
    if (enablePinch && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDistance.current = distance;
    }
  }, [enableSwipe, enablePinch]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isGestureActive) return;
    
    if (enableSwipe && e.touches.length === 1 && touchStart.current) {
      const touch = e.touches[0];
      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }
    
    if (enablePinch && e.touches.length === 2 && lastPinchDistance.current) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const delta = distance - lastPinchDistance.current;
      
      if (Math.abs(delta) > pinchThreshold * 100) {
        if (delta > 0 && onPinchOut) {
          onPinchOut();
        } else if (delta < 0 && onPinchIn) {
          onPinchIn();
        }
        lastPinchDistance.current = distance;
      }
    }
  }, [isGestureActive, enableSwipe, enablePinch, pinchThreshold, onPinchIn, onPinchOut]);

  const handleTouchEnd = useCallback(() => {
    setIsGestureActive(false);
    
    if (enableSwipe && touchStart.current && touchEnd.current) {
      const deltaX = touchStart.current.x - touchEnd.current.x;
      const deltaY = touchStart.current.y - touchEnd.current.y;
      const deltaTime = touchEnd.current.time - touchStart.current.time;
      
      // Only trigger if swipe was fast enough and long enough
      if (deltaTime < 500) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > swipeThreshold || absY > swipeThreshold) {
          if (absX > absY) {
            // Horizontal swipe
            if (deltaX > 0 && onSwipeLeft) {
              onSwipeLeft();
            } else if (deltaX < 0 && onSwipeRight) {
              onSwipeRight();
            }
          } else {
            // Vertical swipe
            if (deltaY > 0 && onSwipeUp) {
              onSwipeUp();
            } else if (deltaY < 0 && onSwipeDown) {
              onSwipeDown();
            }
          }
        }
      }
    }
    
    // Reset tracking
    touchStart.current = null;
    touchEnd.current = null;
    lastPinchDistance.current = null;
  }, [enableSwipe, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Use passive listeners for better performance
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    isGestureActive
  };
};

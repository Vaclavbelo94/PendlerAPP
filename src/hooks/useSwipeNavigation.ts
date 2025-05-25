
import { useCallback } from 'react';
import { useMobileGestures } from './useMobileGestures';

interface SwipeNavigationOptions {
  items: string[];
  currentItem: string;
  onItemChange: (item: string) => void;
  enabled?: boolean;
}

export const useSwipeNavigation = ({
  items,
  currentItem,
  onItemChange,
  enabled = true
}: SwipeNavigationOptions) => {
  const currentIndex = items.findIndex(item => item === currentItem);

  const handleSwipeLeft = useCallback(() => {
    if (!enabled) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onItemChange(items[nextIndex]);
  }, [currentIndex, items, onItemChange, enabled]);

  const handleSwipeRight = useCallback(() => {
    if (!enabled) return;
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onItemChange(items[prevIndex]);
  }, [currentIndex, items, onItemChange, enabled]);

  const { containerRef, isGestureActive } = useMobileGestures(
    { enableSwipe: enabled, swipeThreshold: 50 },
    {
      onSwipeLeft: handleSwipeLeft,
      onSwipeRight: handleSwipeRight
    }
  );

  return {
    containerRef,
    isGestureActive,
    currentIndex,
    canSwipeLeft: currentIndex < items.length - 1,
    canSwipeRight: currentIndex > 0
  };
};

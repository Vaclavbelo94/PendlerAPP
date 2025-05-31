
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  scrollThreshold?: number;
  enableDynamicHeight?: boolean;
}

interface VirtualizedItem<T> {
  index: number;
  data: T;
  top: number;
  height: number;
  isVisible: boolean;
}

export const useVirtualization = <T>(
  items: T[],
  config: VirtualizationConfig
) => {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    scrollThreshold = 100,
    enableDynamicHeight = false
  } = config;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const heightCacheRef = useRef<Map<number, number>>(new Map());

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!items.length) return { start: 0, end: 0 };

    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount, items.length);

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Calculate dynamic heights if enabled
  const getItemHeight = useCallback((index: number): number => {
    if (!enableDynamicHeight) return itemHeight;
    return heightCacheRef.current.get(index) || itemHeight;
  }, [itemHeight, enableDynamicHeight]);

  // Calculate item positions
  const virtualizedItems = useMemo((): VirtualizedItem<T>[] => {
    const result: VirtualizedItem<T>[] = [];
    let top = 0;

    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i);
      const isVisible = i >= visibleRange.start && i < visibleRange.end;

      result.push({
        index: i,
        data: items[i],
        top,
        height,
        isVisible
      });

      top += height;
    }

    return result;
  }, [items, visibleRange, getItemHeight]);

  // Get only visible items for rendering
  const visibleItems = useMemo(() => {
    return virtualizedItems.filter(item => item.isVisible);
  }, [virtualizedItems]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    return virtualizedItems.reduce((acc, item) => acc + item.height, 0);
  }, [virtualizedItems]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Update item height for dynamic sizing
  const updateItemHeight = useCallback((index: number, height: number) => {
    if (!enableDynamicHeight) return;
    
    const currentHeight = heightCacheRef.current.get(index);
    if (currentHeight !== height) {
      heightCacheRef.current.set(index, height);
      // Force recalculation on next render
      setScrollTop(prev => prev + 0.1);
    }
  }, [enableDynamicHeight]);

  // Scroll to specific item
  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (index < 0 || index >= items.length) return;

    const item = virtualizedItems[index];
    if (!item) return;

    const element = document.getElementById(`virtual-container`);
    if (element) {
      element.scrollTo({
        top: item.top,
        behavior
      });
    }
  }, [virtualizedItems, items.length]);

  // Scroll to top
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollToIndex(0, behavior);
  }, [scrollToIndex]);

  // Scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollToIndex(items.length - 1, behavior);
  }, [scrollToIndex, items.length]);

  // Check if item is in view
  const isItemInView = useCallback((index: number): boolean => {
    return index >= visibleRange.start && index < visibleRange.end;
  }, [visibleRange]);

  // Get visible range info
  const getRangeInfo = useCallback(() => {
    return {
      ...visibleRange,
      visibleCount: visibleRange.end - visibleRange.start,
      totalCount: items.length,
      scrollPercentage: totalHeight > 0 ? (scrollTop / (totalHeight - containerHeight)) * 100 : 0
    };
  }, [visibleRange, items.length, totalHeight, scrollTop, containerHeight]);

  // Performance optimizations
  const shouldSkipRender = useCallback((index: number): boolean => {
    if (isScrolling && scrollThreshold > 0) {
      const item = virtualizedItems[index];
      return item ? Math.abs(item.top - scrollTop) > scrollThreshold : false;
    }
    return false;
  }, [isScrolling, scrollThreshold, virtualizedItems, scrollTop]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Core virtualization data
    visibleItems,
    totalHeight,
    
    // Event handlers
    handleScroll,
    
    // Item height management
    updateItemHeight,
    getItemHeight,
    
    // Scroll controls
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
    
    // State info
    isScrolling,
    scrollTop,
    visibleRange,
    
    // Utility functions
    isItemInView,
    getRangeInfo,
    shouldSkipRender,
    
    // Performance data
    performanceMetrics: {
      totalItems: items.length,
      visibleItems: visibleItems.length,
      renderRatio: items.length > 0 ? (visibleItems.length / items.length) * 100 : 0
    }
  };
};

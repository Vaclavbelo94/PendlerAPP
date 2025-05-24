
import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  className?: string;
  containerHeight?: number;
}

export const VirtualizedList = <T,>({
  items,
  renderItem,
  estimateSize = 50,
  className,
  containerHeight = 400
}: VirtualizedListProps<T>) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Memoizujeme rendered items pro lepší výkon
  const renderedItems = useMemo(() => {
    return virtualItems.map((virtualItem) => (
      <div
        key={virtualItem.key}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`,
        }}
      >
        {renderItem(items[virtualItem.index], virtualItem.index)}
      </div>
    ));
  }, [virtualItems, items, renderItem]);

  return (
    <div
      ref={parentRef}
      className={className}
      style={{
        height: `${containerHeight}px`,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {renderedItems}
      </div>
    </div>
  );
};

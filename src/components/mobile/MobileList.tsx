import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
}

export function MobileList<T>({
  items,
  renderItem,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  emptyMessage = 'No items found',
  className,
  itemClassName,
}: MobileListProps<T>) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [handleObserver]);

  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => (
        <div key={index} className={cn('w-full', itemClassName)}>
          {renderItem(item, index)}
        </div>
      ))}

      {/* Load more trigger */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-4"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* Initial loading state */}
      {items.length === 0 && isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

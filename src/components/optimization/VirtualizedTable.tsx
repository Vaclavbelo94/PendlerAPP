
import React, { useRef, useEffect } from 'react';
import { useVirtualization } from '@/hooks/useVirtualization';
import { cn } from '@/lib/utils';

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    render?: (item: T, index: number) => React.ReactNode;
  }>;
  itemHeight?: number;
  height?: number;
  className?: string;
  onItemClick?: (item: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  enableSelection?: boolean;
  selectedItems?: Set<number>;
  onSelectionChange?: (selectedIndices: Set<number>) => void;
}

const VirtualizedTable = <T extends Record<string, any>>({
  data,
  columns,
  itemHeight = 50,
  height = 400,
  className,
  onItemClick,
  loading = false,
  emptyMessage = 'Žádná data k zobrazení',
  enableSelection = false,
  selectedItems = new Set(),
  onSelectionChange
}: VirtualizedTableProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    visibleItems,
    totalHeight,
    handleScroll,
    scrollToTop,
    isScrolling,
    performanceMetrics
  } = useVirtualization(data, {
    itemHeight,
    containerHeight: height,
    overscan: 3,
    scrollThreshold: 150
  });

  // Handle item selection
  const handleItemSelect = (index: number, checked: boolean) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedItems);
    if (checked) {
      newSelection.add(index);
    } else {
      newSelection.delete(index);
    }
    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const allIndices = new Set(data.map((_, index) => index));
      onSelectionChange(allIndices);
    } else {
      onSelectionChange(new Set());
    }
  };

  // Auto-scroll to top when data changes
  useEffect(() => {
    scrollToTop('auto');
  }, [data.length, scrollToTop]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center text-muted-foreground", className)} style={{ height }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Performance Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground p-2 bg-muted/50">
          Zobrazeno: {performanceMetrics.visibleItems}/{performanceMetrics.totalItems} 
          ({performanceMetrics.renderRatio.toFixed(1)}%)
          {isScrolling && ' - Scrollování...'}
        </div>
      )}

      {/* Header */}
      <div className="grid border-b bg-muted/50 sticky top-0 z-10" 
           style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
        {enableSelection && (
          <div className="p-3 flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.size === data.length && data.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-input"
            />
          </div>
        )}
        {columns.map((column) => (
          <div key={column.key} className="p-3 font-medium text-sm">
            {column.label}
          </div>
        ))}
      </div>

      {/* Virtual Container */}
      <div
        ref={containerRef}
        id="virtual-container"
        className="overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        {/* Virtual Spacer */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible Items */}
          {visibleItems.map((virtualItem) => {
            const { index, data: item, top } = virtualItem;
            const isSelected = selectedItems.has(index);

            return (
              <div
                key={index}
                className={cn(
                  "absolute left-0 right-0 grid border-b hover:bg-muted/50 transition-colors",
                  isSelected && "bg-primary/10",
                  onItemClick && "cursor-pointer"
                )}
                style={{ 
                  top,
                  height: itemHeight,
                  gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ')
                }}
                onClick={() => onItemClick?.(item, index)}
              >
                {enableSelection && (
                  <div className="p-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleItemSelect(index, e.target.checked);
                      }}
                      className="rounded border-input"
                    />
                  </div>
                )}
                {columns.map((column) => (
                  <div 
                    key={column.key} 
                    className="p-3 flex items-center text-sm truncate"
                  >
                    {column.render 
                      ? column.render(item, index)
                      : item[column.key]?.toString() || '-'
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/25 border-t">
        Celkem {data.length} položek
        {enableSelection && selectedItems.size > 0 && (
          <span className="ml-2">
            • Vybráno: {selectedItems.size}
          </span>
        )}
      </div>
    </div>
  );
};

export default VirtualizedTable;

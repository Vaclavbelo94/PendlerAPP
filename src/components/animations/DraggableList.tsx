import React from 'react';
import { Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DraggableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function DraggableList<T extends { id: string | number }>({
  items,
  onReorder,
  renderItem,
  className
}: DraggableListProps<T>) {
  return (
    <Reorder.Group 
      axis="y" 
      values={items} 
      onReorder={onReorder}
      className={cn("space-y-2", className)}
    >
      {items.map((item, index) => (
        <Reorder.Item 
          key={item.id} 
          value={item}
          className="cursor-grab active:cursor-grabbing"
        >
          {renderItem(item, index)}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = 100,
  className
}) => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const leftOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, threshold], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    }
    
    x.set(0);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {leftAction && (
        <motion.div 
          className="absolute inset-y-0 left-0 flex items-center justify-start px-4 bg-destructive text-destructive-foreground"
          style={{ opacity: leftOpacity }}
        >
          {leftAction}
        </motion.div>
      )}
      
      {rightAction && (
        <motion.div 
          className="absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-primary text-primary-foreground"
          style={{ opacity: rightOpacity }}
        >
          {rightAction}
        </motion.div>
      )}

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn("relative bg-background", isDragging && "cursor-grabbing")}
      >
        {children}
      </motion.div>
    </div>
  );
};

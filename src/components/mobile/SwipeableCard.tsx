import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Edit, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface SwipeAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'destructive' | 'default';
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  customActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onDelete,
  onEdit,
  customActions,
  className,
  disabled = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const actions: SwipeAction[] = customActions || [
    ...(onEdit
      ? [
          {
            icon: <Edit className="h-4 w-4" />,
            label: 'Edit',
            onClick: onEdit,
            variant: 'default' as const,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            icon: <Trash2 className="h-4 w-4" />,
            label: 'Delete',
            onClick: onDelete,
            variant: 'destructive' as const,
          },
        ]
      : []),
  ];

  const maxSwipe = actions.length * 70; // 70px per action

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX - swipeX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    const currentX = e.touches[0].clientX - startX.current;
    // Only allow left swipe (negative values)
    setSwipeX(Math.min(0, Math.max(-maxSwipe, currentX)));
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    setIsDragging(false);
    
    // Snap to position
    if (swipeX < -maxSwipe / 2) {
      setSwipeX(-maxSwipe);
    } else {
      setSwipeX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    startX.current = e.clientX - swipeX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    const currentX = e.clientX - startX.current;
    setSwipeX(Math.min(0, Math.max(-maxSwipe, currentX)));
  };

  const handleMouseUp = () => {
    if (disabled) return;
    setIsDragging(false);
    
    if (swipeX < -maxSwipe / 2) {
      setSwipeX(-maxSwipe);
    } else {
      setSwipeX(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, swipeX]);

  if (actions.length === 0) {
    return <Card className={className}>{children}</Card>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Action Buttons (Behind) */}
      <div className="absolute inset-y-0 right-0 flex">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              setSwipeX(0);
            }}
            className={cn(
              'w-[70px] flex flex-col items-center justify-center gap-1 text-white transition-colors',
              action.variant === 'destructive'
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            {action.icon}
            <span className="text-xs">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Card (Front) */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        className={cn(
          'relative bg-background cursor-grab active:cursor-grabbing select-none',
          className
        )}
      >
        <Card className="border-0 shadow-none">{children}</Card>
      </div>
    </div>
  );
};

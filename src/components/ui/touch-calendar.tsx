
import React, { useCallback, useRef, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DayPicker, DayPickerProps } from 'react-day-picker';

interface TouchCalendarProps {
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enableTouch?: boolean;
}

type CombinedTouchCalendarProps = TouchCalendarProps & DayPickerProps;

export const TouchCalendar: React.FC<CombinedTouchCalendarProps> = ({
  className,
  onSwipeLeft,
  onSwipeRight,
  enableTouch = true,
  ...props
}) => {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableTouch) return;
    
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    setIsDragging(true);
  }, [enableTouch]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enableTouch || !isDragging) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setIsDragging(false);
  }, [enableTouch, isDragging, onSwipeLeft, onSwipeRight]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="touch-calendar-container"
      role="application"
      aria-label="Interaktivní kalendář s touch gestures"
    >
      <Calendar
        className={cn("p-3 pointer-events-auto touch-manipulation", className)}
        {...props}
      />
    </div>
  );
};

export default TouchCalendar;

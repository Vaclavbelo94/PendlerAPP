
import React, { useRef, useState } from 'react';
import { TouchCalendar } from '@/components/ui/touch-calendar';
import { addMonths, subMonths } from 'date-fns';
import { CalendarProps } from '@/components/ui/calendar';

interface SwipeableCalendarProps extends CalendarProps {
  onMonthChange?: (date: Date) => void;
}

export const SwipeableCalendar: React.FC<SwipeableCalendarProps> = ({
  month,
  onMonthChange,
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(month || new Date());
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSwipeLeft = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    onMonthChange?.(nextMonth);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const handleSwipeRight = () => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
    onMonthChange?.(prevMonth);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent scrolling during horizontal swipe
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX.current);
    const deltaY = Math.abs(touch.clientY - touchStartY.current);
    
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="select-none"
    >
      <TouchCalendar
        month={currentMonth}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        enableTouch={true}
        {...props}
      />
    </div>
  );
};

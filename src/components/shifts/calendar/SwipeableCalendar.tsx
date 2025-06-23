
import React, { useRef, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { addMonths, subMonths } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import type { DayPickerSingleProps } from 'react-day-picker';

interface SwipeableCalendarProps extends Omit<DayPickerSingleProps, 'mode'> {
  onMonthChange?: (date: Date) => void;
  mode?: 'single';
  className?: string;
}

export const SwipeableCalendar: React.FC<SwipeableCalendarProps> = ({
  onMonthChange,
  className,
  mode = 'single',
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const { i18n } = useTranslation();

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

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
      <Calendar
        mode={mode}
        className={className}
        locale={getDateLocale()}
        {...props}
      />
    </div>
  );
};

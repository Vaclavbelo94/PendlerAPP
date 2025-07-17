import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  breakpoint?: 'mobile-first' | 'desktop-first';
}

// Responsive container s optimalizovaným paddingem a breakpointy
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'full',
  padding = 'md',
  breakpoint = 'mobile-first'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2 sm:px-4 sm:py-4',
    md: 'px-4 py-4 sm:px-6 sm:py-6',
    lg: 'px-6 py-6 sm:px-8 sm:py-8'
  };

  const responsiveClasses = breakpoint === 'mobile-first' 
    ? 'w-full mx-auto'
    : 'w-full mx-auto min-w-0';

  return (
    <div className={cn(
      responsiveClasses,
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

interface MobileOptimizedGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

// Mobile-optimized grid s responsive breakpointy
export const MobileOptimizedGrid: React.FC<MobileOptimizedGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md'
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      'grid',
      gridClasses[cols.mobile],
      `sm:${gridClasses[cols.tablet]}`,
      `lg:${gridClasses[cols.desktop]}`,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'touch';
  className?: string;
  disabled?: boolean;
}

// Touch-optimized button s minimální velikostí 44px pro mobil
export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    touch: 'min-h-[44px] min-w-[44px] px-4 text-sm' // Apple/Google doporučení pro touch targets
  };

  // Na mobilu automaticky použij touch velikost
  const finalSize = size === 'md' ? 'touch' : size;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[finalSize],
        'sm:min-h-0 sm:min-w-0', // Na desktopu zruš touch constrainty
        size === 'md' && 'sm:h-10', // Na desktopu standardní výška
        className
      )}
    >
      {children}
    </button>
  );
};

interface ScrollAreaOptimizedProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
}

// Optimalizovaný scroll area pro mobile/touch
export const ScrollAreaOptimized: React.FC<ScrollAreaOptimizedProps> = ({
  children,
  className,
  maxHeight = '400px',
  orientation = 'vertical'
}) => {
  const orientationClasses = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto'
  };

  return (
    <div 
      className={cn(
        'relative',
        orientationClasses[orientation],
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        // iOS momentum scrolling
        '[-webkit-overflow-scrolling:touch]',
        className
      )}
      style={{ 
        maxHeight,
        // Smooth scrolling na moderních prohlížečích
        scrollBehavior: 'smooth'
      }}
    >
      {children}
    </div>
  );
};

interface MobileMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Mobile menu s overlay a animacemi
export const MobileMenu: React.FC<MobileMenuProps> = ({
  children,
  isOpen,
  onClose,
  className
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className={cn(
        'fixed top-0 left-0 h-full w-80 max-w-[calc(100vw-2rem)] bg-background border-r z-50 md:hidden',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        {children}
      </div>
    </>
  );
};

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

// Swipe gesture detection pro mobile navigaci
export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  className
}) => {
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};
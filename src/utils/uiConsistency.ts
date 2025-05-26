
import { cn } from '@/lib/utils';

// Utility functions for consistent UI patterns
export const getConsistentSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
  const spacingMap = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  };
  return spacingMap[size];
};

export const getResponsivePadding = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const paddingMap = {
    sm: 'p-2 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };
  return paddingMap[size];
};

export const getResponsiveMargin = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const marginMap = {
    sm: 'm-2 md:m-4',
    md: 'm-4 md:m-6',
    lg: 'm-6 md:m-8'
  };
  return marginMap[size];
};

export const getTouchFriendlySize = () => {
  return 'min-h-[44px] min-w-[44px]';
};

export const getConsistentBorder = (variant: 'light' | 'normal' | 'heavy' = 'normal') => {
  const borderMap = {
    light: 'border border-border/50',
    normal: 'border border-border',
    heavy: 'border-2 border-border'
  };
  return borderMap[variant];
};

export const getConsistentShadow = (variant: 'light' | 'normal' | 'heavy' = 'normal') => {
  const shadowMap = {
    light: 'shadow-sm',
    normal: 'shadow-md',
    heavy: 'shadow-lg'
  };
  return shadowMap[variant];
};

export const getResponsiveText = (
  mobileSize: string = 'text-sm',
  desktopSize: string = 'text-base'
) => {
  return cn(mobileSize, `md:${desktopSize}`);
};

export const getAccessibleFocus = () => {
  return 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
};

export const getMobileOptimized = () => {
  return cn(
    getTouchFriendlySize(),
    getAccessibleFocus(),
    'transition-all duration-200'
  );
};

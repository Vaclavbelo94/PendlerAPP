
import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
  centered = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4 md:px-6 md:py-6',
    lg: 'px-6 py-6 md:px-8 md:py-8'
  };

  return (
    <div className={cn(
      'w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      centered && 'mx-auto',
      className
    )}>
      {children}
    </div>
  );
};

export default PageContainer;

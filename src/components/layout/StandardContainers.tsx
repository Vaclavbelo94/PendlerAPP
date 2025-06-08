
import React from 'react';
import { cn } from '@/lib/utils';

// Page Container - pro celé stránky
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  padding = 'md',
  maxWidth = 'xl'
}) => {
  const paddingClasses = {
    sm: 'px-3 py-3 md:px-4 md:py-4',
    md: 'px-4 py-4 md:px-6 md:py-6',
    lg: 'px-6 py-6 md:px-8 md:py-8'
  };

  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

// Section Container - pro sekce uvnitř stránek
interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  };

  return (
    <section className={cn(
      'w-full',
      spacingClasses[spacing],
      className
    )}>
      {children}
    </section>
  );
};

// Flex Container - pro flexbox layouty
interface FlexContainerProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
}

export const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  className,
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'md',
  wrap = false
}) => {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  return (
    <div className={cn(
      'flex',
      direction === 'row' ? 'flex-row' : 'flex-col',
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  );
};


import React from 'react';
import { cn } from '@/lib/utils';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextVariant = 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'danger';
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type TextAlignment = 'left' | 'center' | 'right';

interface TypographyBaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlignment;
  truncate?: boolean;
}

interface HeadingProps extends TypographyBaseProps {
  level?: HeadingLevel;
}

interface TextProps extends TypographyBaseProps {
  size?: TextSize;
}

const getVariantClasses = (variant: TextVariant) => {
  switch (variant) {
    case 'muted': return 'text-muted-foreground';
    case 'primary': return 'text-primary';
    case 'secondary': return 'text-secondary';
    case 'accent': return 'text-accent';
    case 'danger': return 'text-destructive';
    default: return 'text-foreground';
  }
};

const getWeightClasses = (weight: TextWeight) => {
  switch (weight) {
    case 'light': return 'font-light';
    case 'normal': return 'font-normal';
    case 'medium': return 'font-medium';
    case 'semibold': return 'font-semibold';
    case 'bold': return 'font-bold';
    default: return 'font-normal';
  }
};

const getAlignmentClasses = (align: TextAlignment) => {
  switch (align) {
    case 'left': return 'text-left';
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
};

export const Heading = React.forwardRef<
  HTMLHeadingElement, 
  HeadingProps & React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className, variant = 'default', weight = 'bold', level = 2, align = 'left', truncate = false, ...props }, ref) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const levelClasses = {
    1: 'text-4xl lg:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg',
    6: 'text-base',
  };

  return React.createElement(
    Tag,
    {
      ref,
      className: cn(
        'font-poppins scroll-m-20',
        levelClasses[level],
        getVariantClasses(variant),
        getWeightClasses(weight),
        getAlignmentClasses(align),
        truncate && 'truncate',
        className
      ),
      ...props
    },
    children
  );
});
Heading.displayName = 'Heading';

export const Text = React.forwardRef<
  HTMLParagraphElement,
  TextProps & React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className, variant = 'default', weight = 'normal', size = 'base', align = 'left', truncate = false, ...props }, ref) => {
  const sizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };

  return (
    <p
      ref={ref}
      className={cn(
        'font-inter leading-7',
        sizeClasses[size],
        getVariantClasses(variant),
        getWeightClasses(weight),
        getAlignmentClasses(align),
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
Text.displayName = 'Text';

export const Label = React.forwardRef<
  HTMLSpanElement,
  TextProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, className, variant = 'muted', weight = 'medium', size = 'sm', align = 'left', truncate = false, ...props }, ref) => {
  const sizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block',
        sizeClasses[size],
        getVariantClasses(variant),
        getWeightClasses(weight),
        getAlignmentClasses(align),
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
Label.displayName = 'Label';

export const Quote = React.forwardRef<
  HTMLQuoteElement,
  TypographyBaseProps & React.HTMLAttributes<HTMLQuoteElement>
>(({ children, className, variant = 'muted', weight = 'normal', align = 'left', truncate = false, ...props }, ref) => {
  return (
    <blockquote
      ref={ref}
      className={cn(
        'border-l-4 border-primary pl-4 italic',
        getVariantClasses(variant),
        getWeightClasses(weight),
        getAlignmentClasses(align),
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
});
Quote.displayName = 'Quote';

export const Code = React.forwardRef<
  HTMLElement,
  TypographyBaseProps & React.HTMLAttributes<HTMLElement>
>(({ children, className, variant = 'default', weight = 'normal', align = 'left', truncate = false, ...props }, ref) => {
  return (
    <code
      ref={ref}
      className={cn(
        'font-mono rounded bg-muted px-1.5 py-0.5',
        getVariantClasses(variant),
        getWeightClasses(weight),
        getAlignmentClasses(align),
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
});
Code.displayName = 'Code';

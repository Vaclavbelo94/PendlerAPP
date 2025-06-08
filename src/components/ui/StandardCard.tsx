
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StandardCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const StandardCard: React.FC<StandardCardProps> = ({
  children,
  title,
  description,
  className,
  variant = 'default',
  size = 'md',
  fullHeight = false
}) => {
  const variantClasses = {
    default: 'border border-border bg-card',
    outlined: 'border-2 border-border bg-transparent',
    filled: 'border-0 bg-muted',
    elevated: 'border border-border bg-card shadow-lg'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };

  const headerSizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3 md:px-6 md:py-4',
    lg: 'px-6 py-4 md:px-8 md:py-6'
  };

  const contentSizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3 md:px-6 md:py-4',
    lg: 'px-6 py-4 md:px-8 md:py-6'
  };

  return (
    <Card className={cn(
      'rounded-lg transition-all duration-200',
      variantClasses[variant],
      fullHeight && 'h-full',
      className
    )}>
      {(title || description) && (
        <CardHeader className={headerSizeClasses[size]}>
          {title && (
            <CardTitle className={cn(
              'font-semibold leading-tight',
              size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'
            )}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className={cn(
              'text-muted-foreground',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(
        contentSizeClasses[size],
        (title || description) && 'pt-0'
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default StandardCard;

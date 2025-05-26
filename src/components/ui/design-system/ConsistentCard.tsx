
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ConsistentCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  interactive?: boolean;
  fullHeight?: boolean;
}

export const ConsistentCard: React.FC<ConsistentCardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  interactive = false,
  fullHeight = false
}) => {
  return (
    <Card className={cn(
      'overflow-hidden',
      interactive && 'transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer',
      fullHeight && 'h-full flex flex-col',
      className
    )}>
      {(title || description) && (
        <CardHeader className={cn(
          'pb-4',
          headerClassName
        )}>
          {title && (
            <CardTitle className="text-lg md:text-xl font-semibold text-left">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm md:text-base text-muted-foreground text-left">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      
      {children && (
        <CardContent className={cn(
          'text-left',
          fullHeight && 'flex-1',
          contentClassName
        )}>
          {children}
        </CardContent>
      )}
      
      {footer && (
        <CardFooter className={cn(
          'pt-4 border-t bg-muted/5',
          footerClassName
        )}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default ConsistentCard;

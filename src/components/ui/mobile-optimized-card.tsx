
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  title,
  description,
  children,
  className,
  compact = false
}) => {
  const isMobile = useIsMobile();

  return (
    <Card className={cn(
      "mobile-card",
      isMobile && "border-0 shadow-sm",
      compact && isMobile && "p-2",
      className
    )}>
      {(title || description) && (
        <CardHeader className={cn(
          isMobile && "px-4 py-3",
          compact && isMobile && "px-3 py-2"
        )}>
          {title && (
            <CardTitle className={cn(
              isMobile && "text-lg",
              compact && isMobile && "text-base"
            )}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className={cn(
              isMobile && "text-sm"
            )}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(
        isMobile && "px-4 py-3",
        compact && isMobile && "px-3 py-2"
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

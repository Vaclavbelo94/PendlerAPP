
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MemoizedCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const MemoizedCard = React.memo<MemoizedCardProps>(({
  title,
  description, 
  children,
  className,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <h3 className="font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
});

MemoizedCard.displayName = "MemoizedCard";

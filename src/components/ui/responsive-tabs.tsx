
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile, useOrientation } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveTabsProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  children,
  value,
  onValueChange,
  className,
  orientation = 'horizontal'
}) => {
  const isMobile = useIsMobile();
  const deviceOrientation = useOrientation();
  
  const isLandscapeMobile = isMobile && deviceOrientation === 'landscape';
  
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={cn(
        'w-full',
        {
          'landscape-tabs': isLandscapeMobile,
          'mobile-tabs': isMobile && deviceOrientation === 'portrait',
        },
        className
      )}
      orientation={isLandscapeMobile ? 'horizontal' : orientation}
    >
      {children}
    </Tabs>
  );
};

interface ResponsiveTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTabsList: React.FC<ResponsiveTabsListProps> = ({
  children,
  className
}) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  const isLandscapeMobile = isMobile && orientation === 'landscape';
  
  return (
    <TabsList
      className={cn(
        'grid w-full',
        {
          'h-auto grid-flow-col gap-1 p-1': isLandscapeMobile,
          'grid-cols-1 gap-1': isMobile && orientation === 'portrait',
          'max-w-3xl': !isMobile,
        },
        className
      )}
      role="tablist"
      aria-orientation={isLandscapeMobile ? 'horizontal' : 'vertical'}
    >
      {children}
    </TabsList>
  );
};

interface ResponsiveTabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  icon?: React.ReactNode;
  description?: string;
}

export const ResponsiveTabsTrigger: React.FC<ResponsiveTabsTriggerProps> = ({
  children,
  value,
  className,
  icon,
  description
}) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  const isLandscapeMobile = isMobile && orientation === 'landscape';
  
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'flex items-center gap-2',
        {
          'flex-col py-2 px-3 text-xs h-auto': isLandscapeMobile,
          'justify-start py-3 px-4': isMobile && orientation === 'portrait',
          'py-3 px-4': !isMobile,
        },
        className
      )}
      role="tab"
      aria-controls={`${value}-content`}
      aria-describedby={description ? `${value}-desc` : undefined}
    >
      {icon && (
        <span className={cn(
          'flex-shrink-0',
          isLandscapeMobile ? 'mb-1' : 'mr-2'
        )}>
          {icon}
        </span>
      )}
      <span className={cn(
        'font-medium',
        isLandscapeMobile && 'text-center leading-tight'
      )}>
        {children}
      </span>
      {description && isLandscapeMobile && (
        <span className="text-xs text-muted-foreground hidden sm:block">
          {description}
        </span>
      )}
      {description && (
        <span id={`${value}-desc`} className="sr-only">
          {description}
        </span>
      )}
    </TabsTrigger>
  );
};

export { TabsContent as ResponsiveTabsContent };

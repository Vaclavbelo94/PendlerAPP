
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface UniversalMobileNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
  className?: string;
}

export const UniversalMobileNavigation: React.FC<UniversalMobileNavigationProps> = ({
  activeTab,
  onTabChange,
  tabs,
  className
}) => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const { containerRef } = useMobileGestures(
    { enableSwipe: true, swipeThreshold: 50 },
    {
      onSwipeLeft: () => {
        const nextIndex = (currentIndex + 1) % tabs.length;
        onTabChange(tabs[nextIndex].id);
      },
      onSwipeRight: () => {
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        onTabChange(tabs[prevIndex].id);
      }
    }
  );

  if (!isMobile) {
    return (
      <div className={cn("grid gap-2 mb-6", 
        tabs.length <= 4 ? `grid-cols-${tabs.length}` : "grid-cols-4", 
        className
      )}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-2 p-4 h-auto"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  // Mobile layout with improved overflow handling
  return (
    <div className={cn("mb-4", className)}>
      <div 
        ref={containerRef}
        className="relative overflow-hidden bg-muted rounded-lg p-1"
      >
        {/* Mobile tabs - adaptive layout */}
        <div className={cn(
          "flex gap-1",
          tabs.length > 4 ? "overflow-x-auto pb-1" : "grid",
          tabs.length === 2 ? "grid-cols-2" : 
          tabs.length === 3 ? "grid-cols-3" : 
          tabs.length === 4 ? "grid-cols-2" : ""
        )}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-md transition-all duration-200 min-w-0 flex-shrink-0",
                  isSmallLandscape ? "min-h-[40px] px-3" : "min-h-[50px]",
                  tabs.length > 4 ? "min-w-[80px]" : "flex-1",
                  "touch-target",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon className={cn("h-4 w-4", isSmallLandscape && "h-3 w-3")} />
                <span className={cn(
                  "text-xs font-medium text-center leading-tight truncate w-full",
                  isSmallLandscape && "text-[10px]"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Swipe indicators for overflow */}
      {tabs.length > 4 && (
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Current tab description */}
      <p className={cn(
        "text-center text-sm text-muted-foreground mt-2",
        isSmallLandscape && "text-xs mt-1"
      )}>
        {tabs[currentIndex]?.description}
      </p>
    </div>
  );
};

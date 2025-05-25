
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Users, Calculator, Clock, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileGestures } from '@/hooks/useMobileGestures';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface MobileTravelNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isMobile: boolean;
}

const tabs: Tab[] = [
  {
    id: "optimizer",
    label: "Optimalizace",
    icon: Car,
    description: "Optimalizace tras a dopravy"
  },
  {
    id: "ridesharing", 
    label: "Sdílení",
    icon: Users,
    description: "Hledání spolujízd"
  },
  {
    id: "calculator",
    label: "Kalkulačka", 
    icon: Calculator,
    description: "Výpočet nákladů na dopravu"
  },
  {
    id: "predictions",
    label: "Predikce",
    icon: Clock,
    description: "Předpověď dopravní situace"
  }
];

export const MobileTravelNavigation: React.FC<MobileTravelNavigationProps> = ({
  activeTab,
  onTabChange,
  isMobile
}) => {
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
      <div className="grid grid-cols-4 gap-2 mb-6">
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

  return (
    <div className="mb-6">
      {/* Mobile tab navigation with swipe support */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden bg-muted rounded-lg p-1"
      >
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-md transition-all duration-200",
                  "min-h-[60px] touch-target",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Swipe indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex gap-1">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Current tab description */}
      <p className="text-center text-sm text-muted-foreground mt-2">
        {tabs[currentIndex]?.description}
      </p>
    </div>
  );
};

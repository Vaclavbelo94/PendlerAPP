
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface CategoryTab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface CategoryNavigationProps {
  tabs: CategoryTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'cards' | 'compact';
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = 'cards'
}) => {
  const isMobile = useIsMobile();

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex gap-1 p-1 bg-muted rounded-lg",
        isMobile ? "flex-col" : "flex-row",
        className
      )}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 justify-start transition-all px-3 py-2 rounded-md",
                isMobile ? "w-full h-12" : "flex-1 h-9",
                isActive 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className={cn(
                "font-medium",
                isMobile ? "text-sm" : "text-xs"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Card variant (default)
  const gridCols = tabs.length <= 2 ? 'grid-cols-2' : 
                   tabs.length === 3 ? 'grid-cols-3' : 
                   isMobile ? 'grid-cols-2' : 'grid-cols-4';

  return (
    <div className={cn(`grid ${gridCols} gap-4`, className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Card 
            key={tab.id}
            className={cn(
              "p-6 cursor-pointer transition-all hover:shadow-lg",
              isActive ? "ring-2 ring-primary bg-primary/5" : ""
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">{tab.label}</h3>
                <p className="text-sm text-muted-foreground">{tab.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CategoryNavigation;

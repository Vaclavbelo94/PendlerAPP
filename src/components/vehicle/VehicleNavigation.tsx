
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Gauge, Wrench, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export interface VehicleTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const vehicleTabs: VehicleTab[] = [
  {
    id: "overview",
    label: "Přehled",
    icon: Car,
    description: "Hlavní přehled vozidla"
  },
  {
    id: "fuel",
    label: "Spotřeba",
    icon: Gauge,
    description: "Sledování spotřeby paliva"
  },
  {
    id: "service",
    label: "Servis",
    icon: Wrench,
    description: "Záznamy o servisu"
  },
  {
    id: "documents",
    label: "Dokumenty",
    icon: FileText,
    description: "Dokumenty vozidla"
  }
];

interface VehicleNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const VehicleNavigation = memo<VehicleNavigationProps>(({ 
  activeTab, 
  onTabChange, 
  className 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex gap-1 p-1 bg-muted rounded-lg",
      isMobile ? "flex-col" : "flex-row",
      className
    )}>
      {vehicleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            size={isMobile ? "default" : "sm"}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 justify-start transition-all",
              isMobile ? "w-full h-12" : "flex-1 h-9",
              isActive && "shadow-sm"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-xs"
            )}>
              {tab.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
});

VehicleNavigation.displayName = 'VehicleNavigation';

export default VehicleNavigation;
export { vehicleTabs };

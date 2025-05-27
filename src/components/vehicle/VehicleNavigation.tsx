
import React, { memo } from 'react';
import { Car, Gauge, Wrench, FileText } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';
import { cn } from '@/lib/utils';

const vehicleTabs: CategoryTab[] = [
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
  return (
    <CategoryNavigation
      tabs={vehicleTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="cards"
      className={cn("mb-6", className)}
    />
  );
});

VehicleNavigation.displayName = 'VehicleNavigation';

export default VehicleNavigation;
export { vehicleTabs };
export type { CategoryTab };

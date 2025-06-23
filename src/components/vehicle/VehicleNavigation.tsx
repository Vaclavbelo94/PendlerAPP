
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Fuel, Wrench, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VehicleNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const VehicleNavigation: React.FC<VehicleNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation(['vehicle']);

  const tabs = [
    { id: 'overview', label: t('vehicle:overview'), icon: Car },
    { id: 'fuel', label: t('vehicle:fuel'), icon: Fuel },
    { id: 'service', label: t('vehicle:service'), icon: Wrench },
    { id: 'others', label: t('vehicle:others'), icon: FileText }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              isActive 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default VehicleNavigation;

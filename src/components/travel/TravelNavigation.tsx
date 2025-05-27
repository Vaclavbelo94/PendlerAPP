
import React from 'react';
import { Route, Users, Calculator, TrendingUp, BarChart3 } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface TravelNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const travelTabs: CategoryTab[] = [
  {
    id: 'optimizer',
    icon: Route,
    label: 'Optimalizace',
    description: 'Optimalizace tras a dojíždění'
  },
  {
    id: 'ridesharing',
    icon: Users,
    label: 'Sdílení jízd',
    description: 'Najděte spolucestující'
  },
  {
    id: 'calculator',
    icon: Calculator,
    label: 'Kalkulačka',
    description: 'Výpočet nákladů na dopravu'
  },
  {
    id: 'predictions',
    icon: TrendingUp,
    label: 'Predikce',
    description: 'Předpověď dopravní situace'
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    description: 'Analýza vašich cest'
  }
];

export const TravelNavigation: React.FC<TravelNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <CategoryNavigation
      tabs={travelTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="cards"
      className="mb-8"
    />
  );
};

export default TravelNavigation;

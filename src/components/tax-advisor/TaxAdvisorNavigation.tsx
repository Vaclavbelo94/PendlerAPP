
import React from 'react';
import { TrendingUpIcon, FileTextIcon, BookOpenIcon, CalculatorIcon } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface TaxAdvisorNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const taxAdvisorTabs: CategoryTab[] = [
  {
    id: 'optimizer',
    icon: TrendingUpIcon,
    label: 'Optimalizace',
    description: 'Daňové tipy a optimalizace'
  },
  {
    id: 'documents',
    icon: FileTextIcon,
    label: 'Dokumenty',
    description: 'Generátor PDF dokumentů'
  },
  {
    id: 'guide',
    icon: BookOpenIcon,
    label: 'Průvodce',
    description: 'Průvodce daňovým přiznáním'
  },
  {
    id: 'calculator',
    icon: CalculatorIcon,
    label: 'Kalkulátor',
    description: 'Rychlé daňové výpočty'
  }
];

export const TaxAdvisorNavigation: React.FC<TaxAdvisorNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <CategoryNavigation
      tabs={taxAdvisorTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="cards"
      className="mb-8"
    />
  );
};

export default TaxAdvisorNavigation;

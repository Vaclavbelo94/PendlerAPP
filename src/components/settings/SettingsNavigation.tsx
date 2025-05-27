
import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Database,
  Shield,
  Smartphone
} from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface SettingsNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'primary' | 'secondary';
}

const primaryTabs: CategoryTab[] = [
  {
    id: 'general',
    icon: SettingsIcon,
    label: 'Obecné',
    description: 'Základní nastavení aplikace'
  },
  {
    id: 'account',
    icon: User,
    label: 'Účet',
    description: 'Správa uživatelského účtu'
  },
  {
    id: 'appearance',
    icon: Palette,
    label: 'Vzhled',
    description: 'Témata a zobrazení'
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Oznámení',
    description: 'Nastavení upozornění'
  }
];

const secondaryTabs: CategoryTab[] = [
  {
    id: 'language',
    icon: Globe,
    label: 'Jazyk',
    description: 'Jazykové preference'
  },
  {
    id: 'security',
    icon: Shield,
    label: 'Bezpečnost',
    description: 'Zabezpečení a soukromí'
  },
  {
    id: 'device',
    icon: Smartphone,
    label: 'Zařízení',
    description: 'Nastavení zařízení'
  },
  {
    id: 'data',
    icon: Database,
    label: 'Data',
    description: 'Správa dat a zálohy'
  }
];

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeTab,
  onTabChange,
  variant = 'primary'
}) => {
  const tabs = variant === 'primary' ? primaryTabs : secondaryTabs;
  
  return (
    <CategoryNavigation
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="cards"
      className="mb-6"
    />
  );
};

export default SettingsNavigation;

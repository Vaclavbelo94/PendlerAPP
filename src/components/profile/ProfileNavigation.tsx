
import React from 'react';
import { User, Settings, Activity, Crown } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const profileTabs: CategoryTab[] = [
  {
    id: 'overview',
    icon: User,
    label: 'Přehled',
    description: 'Základní informace o profilu'
  },
  {
    id: 'subscription',
    icon: Crown,
    label: 'Předplatné',
    description: 'Správa Premium účtu'
  },
  {
    id: 'activity',
    icon: Activity,
    label: 'Aktivita',
    description: 'Historie a statistiky'
  }
];

export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <CategoryNavigation
      tabs={profileTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="cards"
      className="mb-8"
    />
  );
};

export default ProfileNavigation;

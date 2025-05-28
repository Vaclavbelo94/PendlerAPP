
import React from 'react';
import { CalendarIcon, BarChartIcon, FileTextIcon, SettingsIcon, DownloadIcon } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface ShiftsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const shiftTabs: CategoryTab[] = [
  {
    id: 'calendar',
    icon: CalendarIcon,
    label: 'Kalendář',
    description: 'Přehled směn'
  },
  {
    id: 'analytics',
    icon: BarChartIcon,
    label: 'Analýzy',
    description: 'Statistiky'
  },
  {
    id: 'reports',
    icon: FileTextIcon,
    label: 'Reporty',
    description: 'Měsíční přehledy'
  },
  {
    id: 'export',
    icon: DownloadIcon,
    label: 'Export',
    description: 'Kalendáře a soubory'
  },
  {
    id: 'settings',
    icon: SettingsIcon,
    label: 'Nastavení',
    description: 'Konfigurace směn'
  }
];

export const ShiftsNavigation: React.FC<ShiftsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  return (
    <CategoryNavigation
      tabs={shiftTabs}
      activeTab={activeSection}
      onTabChange={onSectionChange}
      variant="cards"
      className="mb-8"
    />
  );
};

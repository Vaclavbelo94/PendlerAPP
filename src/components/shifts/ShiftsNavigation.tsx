
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShiftsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ShiftsNavigation: React.FC<ShiftsNavigationProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { t, i18n } = useTranslation('shifts');

  // Debug: Log current language and translations
  console.log('ShiftsNavigation - Current language:', i18n.language);
  console.log('ShiftsNavigation - Translations:', {
    overview: t('overview'),
    calendar: t('calendar'),
    analytics: t('analytics')
  });

  const sections = [
    {
      id: 'overview',
      label: t('overview') || 'Přehled',
      icon: Eye,
    },
    {
      id: 'calendar',
      label: t('calendar') || 'Kalendář',
      icon: Calendar,
    },
    {
      id: 'analytics',
      label: t('analytics') || 'Analityka',
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            onClick={() => onSectionChange(section.id)}
            className={`flex-1 min-w-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeSection === section.id
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{section.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ShiftsNavigation;

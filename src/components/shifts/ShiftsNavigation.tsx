
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShiftsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ShiftsNavigation: React.FC<ShiftsNavigationProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { t } = useTranslation('shifts');

  const sections = [
    {
      id: 'calendar',
      label: t('calendar'),
      icon: Calendar,
    },
    {
      id: 'analytics',
      label: t('analytics'),
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            onClick={() => onSectionChange(section.id)}
            className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeSection === section.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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

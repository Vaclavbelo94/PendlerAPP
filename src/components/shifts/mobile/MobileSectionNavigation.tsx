import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type MobileSectionType = 'calendar' | 'statistics' | 'import';

interface MobileSectionNavigationProps {
  activeSection: MobileSectionType;
  onSectionChange: (section: MobileSectionType) => void;
  isDHLUser?: boolean;
}

const MobileSectionNavigation: React.FC<MobileSectionNavigationProps> = ({
  activeSection,
  onSectionChange,
  isDHLUser = false,
}) => {
  const { t } = useTranslation('shifts');

  const sections = [
    {
      id: 'calendar' as MobileSectionType,
      label: t('calendar'),
      icon: Calendar,
    },
    {
      id: 'statistics' as MobileSectionType,
      label: t('statistics'),
      icon: BarChart3,
    },
  ];

  // Add import section only for DHL users
  if (isDHLUser) {
    sections.push({
      id: 'import' as MobileSectionType,
      label: t('dataImport'),
      icon: Upload,
    });
  }

  return (
    <div className="flex gap-1 p-2 bg-muted/30 rounded-lg border mx-4 mb-4">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            onClick={() => onSectionChange(section.id)}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
              activeSection === section.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">{section.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MobileSectionNavigation;
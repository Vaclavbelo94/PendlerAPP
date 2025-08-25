import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobileSectionType = 'calendar' | 'stats-overtime' | 'company-import';

interface MobileSectionNavigationProps {
  activeSection: MobileSectionType;
  onSectionChange: (section: MobileSectionType) => void;
  isDHLUser?: boolean;
}

const MobileSectionNavigation: React.FC<MobileSectionNavigationProps> = ({
  activeSection,
  onSectionChange,
  isDHLUser = false
}) => {
  const { t } = useTranslation('shifts');

  const sections = [
    {
      type: 'calendar' as MobileSectionType,
      label: t('calendar', 'Kalendář'),
      icon: Calendar
    },
    {
      type: 'stats-overtime' as MobileSectionType,
      label: t('statsAndOvertime', 'Statistiky a přesčasy'),
      icon: TrendingUp
    }
  ];

  // Add import section only for company users
  if (isDHLUser) {
    sections.push({
      type: 'company-import' as MobileSectionType,
      label: t('dataImport', 'Import dat'),
      icon: Upload
    });
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.type;
          
          return (
            <Button
              key={section.type}
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange(section.type)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap min-w-fit",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSectionNavigation;
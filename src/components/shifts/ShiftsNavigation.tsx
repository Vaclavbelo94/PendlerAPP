
import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarIcon, BarChartIcon, FileTextIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShiftsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ShiftsNavigation: React.FC<ShiftsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const isMobile = useIsMobile();

  const sections = [
    {
      id: 'calendar',
      icon: CalendarIcon,
      title: 'Kalendář',
      description: 'Přehled směn'
    },
    {
      id: 'analytics',
      icon: BarChartIcon,
      title: 'Analýzy',
      description: 'Statistiky'
    },
    {
      id: 'reports',
      icon: FileTextIcon,
      title: 'Reporty',
      description: 'Měsíční přehledy'
    }
  ];

  return (
    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-8`}>
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Card 
            key={section.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              activeSection === section.id ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onSectionChange(section.id)}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

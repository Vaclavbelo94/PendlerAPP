
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ShiftsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ShiftsNavigation: React.FC<ShiftsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { t } = useLanguage();

  const sections = [
    {
      id: 'overview',
      label: t('dashboard') || 'Přehled',
      icon: Clock,
      description: t('quickShiftOverview') || 'Rychlý přehled směn'
    },
    {
      id: 'calendar',
      label: t('calendar') || 'Kalendář',
      icon: Calendar,
      description: t('calendarView') || 'Kalendářní zobrazení'
    },
    {
      id: 'analytics',
      label: t('analytics') || 'Analýzy',
      icon: BarChart3,
      description: t('statisticsAndGraphs') || 'Statistiky a grafy'
    }
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Button
              variant={isActive ? "default" : "outline"}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "transition-all duration-300 hover:scale-105",
                "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:text-primary",
                isActive && "bg-primary/20 border-primary/30 shadow-lg scale-105"
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {section.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ShiftsNavigation;

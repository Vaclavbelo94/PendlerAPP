
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShiftsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ShiftsNavigation: React.FC<ShiftsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const sections = [
    {
      id: 'overview',
      label: 'Přehled',
      icon: Clock,
      description: 'Rychlý přehled směn'
    },
    {
      id: 'calendar',
      label: 'Kalendář',
      icon: Calendar,
      description: 'Kalendářní zobrazení'
    },
    {
      id: 'analytics',
      label: 'Analýzy',
      icon: BarChart3,
      description: 'Statistiky a grafy'
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
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
                  isActive && "shadow-lg"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.label}
              </Button>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Přidat směnu
        </Button>
      </motion.div>
    </div>
  );
};

export default ShiftsNavigation;

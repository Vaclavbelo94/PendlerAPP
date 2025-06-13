
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Gauge, Wrench, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VehicleNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const VehicleNavigation: React.FC<VehicleNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const sections = [
    {
      id: 'overview',
      label: 'Přehled',
      icon: Car,
      description: 'Rychlý přehled vozidla'
    },
    {
      id: 'fuel',
      label: 'Spotřeba',
      icon: Gauge,
      description: 'Palivo a náklady'
    },
    {
      id: 'service',
      label: 'Servis',
      icon: Wrench,
      description: 'Údržba a opravy'
    },
    {
      id: 'documents',
      label: 'Dokumenty',
      icon: FileText,
      description: 'Dokumenty a certifikáty'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeTab === section.id;
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Button
              variant={isActive ? "default" : "outline"}
              onClick={() => onTabChange(section.id)}
              className={cn(
                "transition-all duration-300 hover:scale-105",
                isActive && "shadow-lg bg-gradient-to-r from-primary to-accent"
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

export default VehicleNavigation;

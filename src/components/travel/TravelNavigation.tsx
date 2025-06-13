
import React from 'react';
import { Button } from '@/components/ui/button';
import { Route, Users, Calculator, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TravelNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TravelNavigation: React.FC<TravelNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const sections = [
    {
      id: 'optimizer',
      label: 'Optimalizace',
      icon: Route,
      description: 'Chytré trasy s live daty'
    },
    {
      id: 'ridesharing',
      label: 'Spolujízdy',
      icon: Users,
      description: 'Smart matching & chat'
    },
    {
      id: 'calculator',
      label: 'Náklady',
      icon: Calculator,
      description: 'Kalkulace cest'
    },
    {
      id: 'traffic',
      label: 'Live doprava',
      icon: AlertTriangle,
      description: 'Real-time traffic'
    },
    {
      id: 'analytics',
      label: 'Analýzy',
      icon: TrendingUp,
      description: 'Statistiky a úspory'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
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
                "transition-all duration-300 hover:scale-105 flex flex-col h-auto p-3 md:p-4",
                isActive && "shadow-lg bg-gradient-to-r from-primary to-accent"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{section.label}</span>
              <span className="text-xs opacity-75 hidden md:block">{section.description}</span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TravelNavigation;

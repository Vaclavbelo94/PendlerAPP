
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface TravelNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TravelNavigation: React.FC<TravelNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation('travel');

  const sections = [
    {
      id: 'ridesharing',
      label: t('ridesharing'),
      icon: Users,
      description: t('ridesharingDesc')
    },
    {
      id: 'traffic',
      label: t('liveTraffic'),
      icon: AlertTriangle,
      description: t('realTimeTraffic')
    }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6 justify-center sm:justify-start">
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

export default TravelNavigation;

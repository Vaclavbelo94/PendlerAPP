
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Brain, BarChart3, Bell } from 'lucide-react';
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
      label: t('smartNavigation'),
      icon: AlertTriangle,
      description: t('trafficAnalysis')
    },
    {
      id: 'alerts',
      label: t('trafficAlerts'),
      icon: Bell,
      description: t('personalizedAlerts')
    },
    {
      id: 'insights',
      label: t('smartRecommendations'),
      icon: Brain,
      description: 'AI Doporučení'
    },
    {
      id: 'analytics',
      label: 'Analytiky',
      icon: BarChart3,
      description: 'Přehledy cest'
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
                "transition-all duration-300 hover:scale-105 flex items-center gap-2 px-4 py-2",
                !isActive && "hover:bg-white/10 hover:border-white/30",
                isActive && "bg-primary shadow-lg scale-105"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{section.label}</span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TravelNavigation;

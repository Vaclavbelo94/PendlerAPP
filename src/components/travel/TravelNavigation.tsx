
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Navigation } from 'lucide-react';
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
      id: 'commute-traffic',
      label: t('commuteTraffic'),
      icon: Navigation,
      description: t('commuteTrafficDesc')
    }
  ];

  return (
    <div className="bg-card rounded-lg p-1 shadow-sm border">
      <div className="flex space-x-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeTab === section.id;
          
          return (
            <motion.div
              key={section.id}
              className="relative flex-1"
              layout
            >
              <Button
                variant="ghost"
                onClick={() => onTabChange(section.id)}
                className={cn(
                  "relative w-full justify-start gap-3 h-12 transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">{section.label}</div>
                  <div className="text-xs opacity-70">{section.description}</div>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/5 rounded-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TravelNavigation;

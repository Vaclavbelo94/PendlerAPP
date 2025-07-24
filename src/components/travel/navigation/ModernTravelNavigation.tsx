
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Navigation, TrendingUp, Route } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ModernTravelNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ModernTravelNavigation: React.FC<ModernTravelNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation('travel');

  const sections = [
    {
      id: 'ridesharing',
      label: t('ridesharing'),
      icon: Users,
      description: t('ridesharingDesc'),
      color: 'from-blue-500/20 to-blue-600/20 border-blue-500/20',
      activeColor: 'from-blue-500/30 to-blue-600/30 border-blue-500/40'
    },
    {
      id: 'commute-traffic',
      label: t('commuteTraffic'),
      icon: Navigation,
      description: t('commuteTrafficDesc'),
      color: 'from-green-500/20 to-green-600/20 border-green-500/20',
      activeColor: 'from-green-500/30 to-green-600/30 border-green-500/40'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeTab === section.id;
        
        return (
          <motion.div
            key={section.id}
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300 border-0 bg-gradient-to-br backdrop-blur-sm",
                isActive ? section.activeColor : section.color,
                "hover:shadow-lg hover:shadow-primary/10"
              )}
              onClick={() => onTabChange(section.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-300 shadow-sm",
                    isActive 
                      ? "bg-primary/20 text-primary shadow-primary/20" 
                      : "bg-background/50 text-muted-foreground"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-lg font-semibold transition-colors duration-300",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {section.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ModernTravelNavigation;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Navigation, TrendingUp, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTranslation } from 'react-i18next';
import EnhancedRideSharing from '../EnhancedRideSharing';
import HomeWorkTrafficMonitor from '../HomeWorkTrafficMonitor';

interface ModernTravelMobileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModernTravelMobileCarousel: React.FC<ModernTravelMobileCarouselProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation('travel');
  
  const tabs = [
    {
      id: 'ridesharing',
      label: t('ridesharing'),
      icon: Users,
      description: t('ridesharingDesc'),
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    },
    {
      id: 'commute-traffic',
      label: t('commuteTraffic'),
      icon: Navigation,
      description: t('commuteTrafficDesc'),
      color: 'bg-green-500/10 text-green-700 dark:text-green-400'
    }
  ];

  const tabIds = tabs.map(tab => tab.id);
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const { containerRef } = useSwipeNavigation({
    items: tabIds,
    currentItem: activeTab,
    onItemChange: onTabChange,
    enabled: true
  });

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    onTabChange(tabs[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % tabs.length;
    onTabChange(tabs[nextIndex].id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ridesharing':
        return <EnhancedRideSharing />;
      case 'commute-traffic':
        return <HomeWorkTrafficMonitor />;
      default:
        return <EnhancedRideSharing />;
    }
  };

  const currentTab = tabs[currentIndex];
  const Icon = currentTab?.icon || Users;

  return (
    <div className="space-y-6">
      {/* Modern Tab Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${currentTab?.color} shadow-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {currentTab?.label}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {currentTab?.description}
                  </CardDescription>
                </div>
              </div>
              
              {/* Tab Indicators */}
              <div className="flex justify-center space-x-2">
                {tabs.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onTabChange(tabs[index].id)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Content Area */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="space-y-4"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Info */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} / {tabs.length} • {t('swipeToNavigate')}
        </p>
      </div>
    </div>
  );
};

export default ModernTravelMobileCarousel;

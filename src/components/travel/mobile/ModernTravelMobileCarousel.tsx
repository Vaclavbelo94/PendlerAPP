import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import RidesharingDashboard from '@/components/travel/rideshare/RidesharingDashboard';
import HomeWorkTrafficMonitor from '@/components/travel/HomeWorkTrafficMonitor';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
);

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
      component: RidesharingDashboard
    },
    {
      id: 'traffic',
      label: t('commuteTraffic'),
      icon: Navigation,
      component: HomeWorkTrafficMonitor
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || RidesharingDashboard;

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                console.log(`Switching to tab: ${tab.id}`);
                onTabChange(tab.id);
              }}
              className={`flex-1 flex items-center gap-2 min-h-[44px] touch-manipulation transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ActiveComponent />
        </Suspense>
      </motion.div>
    </div>
  );
};

export default ModernTravelMobileCarousel;
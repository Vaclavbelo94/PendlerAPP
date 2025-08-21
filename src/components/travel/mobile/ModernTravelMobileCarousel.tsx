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
      {/* Tab Navigation - Icon Only */}
      <div className="flex gap-3 justify-center mb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log(`Switching to tab: ${tab.id}`);
                onTabChange(tab.id);
              }}
              className={`
                flex flex-col items-center gap-1 px-4 py-3 rounded-lg 
                transition-all duration-200 touch-manipulation
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-102'
                }
              `}
              aria-label={tab.label}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        <Suspense fallback={<LoadingFallback />}>
          <ActiveComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default ModernTravelMobileCarousel;
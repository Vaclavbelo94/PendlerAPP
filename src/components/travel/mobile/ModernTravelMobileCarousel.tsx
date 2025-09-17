import React, { Suspense, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Navigation, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import RidesharingDashboard from '@/components/travel/rideshare/RidesharingDashboard';

import TrafficBorderMonitoring from '@/components/travel/TrafficBorderMonitoring';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    watchDrag: false,
    axis: 'x',
    skipSnaps: false,
    loop: false
  });

  const tabs = [
    {
      id: 'ridesharing',
      label: t('ridesharing'),
      icon: Users,
      component: RidesharingDashboard
    },
    {
      id: 'traffic-monitoring',
      label: t('trafficMonitoring'),
      icon: AlertTriangle,
      component: TrafficBorderMonitoring
    }
  ];

  // Synchronize carousel with activeTab
  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    const selectedTab = tabs[selectedIndex];
    if (selectedTab && selectedTab.id !== activeTab) {
      console.log(`Carousel switched to tab: ${selectedTab.id}`);
      onTabChange(selectedTab.id);
    }
  }, [emblaApi, activeTab, onTabChange, tabs]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Update carousel position when activeTab changes externally
  useEffect(() => {
    const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (tabIndex !== -1) {
      scrollTo(tabIndex);
    }
  }, [activeTab, scrollTo, tabs]);

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation Dots */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border mx-4 mb-4">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => {
                console.log(`Switching to tab: ${tab.id}`);
                onTabChange(tab.id);
              }}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all ${
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-5 w-5" />
            </Button>
          );
        })}
      </div>

      {/* Swipeable Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <div key={tab.id} className="flex-[0_0_100%] min-w-0">
                <Suspense fallback={<LoadingFallback />}>
                  <Component />
                </Suspense>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Indicators - Removed duplicate navigation */}
    </div>
  );
};

export default ModernTravelMobileCarousel;
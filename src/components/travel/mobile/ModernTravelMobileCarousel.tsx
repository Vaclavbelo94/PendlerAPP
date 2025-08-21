import React, { Suspense, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps'
  });

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
      <div className="flex gap-2 justify-center mb-4">
        {tabs.map((tab, index) => {
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
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg 
                transition-all duration-300 touch-manipulation
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              aria-label={tab.label}
            >
              <Icon className={`h-4 w-4`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
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

      {/* Carousel Indicators */}
      <div className="flex gap-2 justify-center mt-4">
        {tabs.map((_, index) => {
          const isActive = tabs[index].id === activeTab;
          return (
            <button
              key={index}
              onClick={() => onTabChange(tabs[index].id)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }
              `}
              aria-label={`Go to ${tabs[index].label}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ModernTravelMobileCarousel;
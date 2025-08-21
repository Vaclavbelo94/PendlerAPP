import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import { ProfileCarouselProgress } from './ProfileCarouselProgress';
import { BasicInfoTab } from './BasicInfoTab';
import { RideRequestsTab } from './RideRequestsTab';
import { DHLSettingsTab } from './DHLSettingsTab';
import { User, Car, Settings } from 'lucide-react';

export const ModernProfileCarousel: React.FC = () => {
  const { unifiedUser } = useAuth();
  const { t } = useTranslation('profile');
  const isDHLEmployee = unifiedUser?.isDHLEmployee || false;
  
  // Available tabs based on user type
  const availableTabs = React.useMemo(() => {
    const tabs = [
      {
        id: 'basic',
        label: t('tabs.basic'),
        icon: User,
        component: BasicInfoTab
      },
      {
        id: 'rides',
        label: t('tabs.rides'),
        icon: Car,
        component: RideRequestsTab
      }
    ];
    
    if (isDHLEmployee) {
      tabs.push({
        id: 'dhl',
        label: t('tabs.dhl'),
        icon: Settings,
        component: DHLSettingsTab
      });
    }
    return tabs;
  }, [isDHLEmployee, t]);

  const [activeTab, setActiveTab] = useState(availableTabs[0].id);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps'
  });

  // Synchronize carousel with activeTab
  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    const selectedTab = availableTabs[selectedIndex];
    if (selectedTab && selectedTab.id !== activeTab) {
      console.log(`Profile carousel switched to tab: ${selectedTab.id}`);
      setActiveTab(selectedTab.id);
    }
  }, [emblaApi, activeTab, availableTabs]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Update carousel position when activeTab changes externally
  useEffect(() => {
    const tabIndex = availableTabs.findIndex(tab => tab.id === activeTab);
    if (tabIndex !== -1) {
      scrollTo(tabIndex);
    }
  }, [activeTab, scrollTo, availableTabs]);

  const currentIndex = availableTabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation Icons */}
      <div className="flex gap-2 justify-center mb-4">
        {availableTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log(`Switching to profile tab: ${tab.id}`);
                setActiveTab(tab.id);
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

      {/* Progress Indicator */}
      <ProfileCarouselProgress
        currentStep={currentIndex}
        totalSteps={availableTabs.length}
        stepLabels={availableTabs.map(tab => tab.label)}
        onStepClick={(step) => setActiveTab(availableTabs[step].id)}
        availableTabs={availableTabs.map(tab => tab.id)}
      />

      {/* Swipeable Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {availableTabs.map((tab) => {
            const Component = tab.component;
            return (
              <div key={tab.id} className="flex-[0_0_100%] min-w-0">
                <Component />
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex gap-2 justify-center mt-4">
        {availableTabs.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(availableTabs[index].id)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }
              `}
              aria-label={`Go to ${availableTabs[index].label}`}
            />
          );
        })}
      </div>
    </div>
  );
};
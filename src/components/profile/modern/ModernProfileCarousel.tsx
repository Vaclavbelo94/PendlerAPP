import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import { ProfileCarouselProgress } from './ProfileCarouselProgress';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileWorkData from '@/components/profile/ProfileWorkData';
import DHLProfileSettings from '@/components/profile/DHLProfileSettings';
import UserSubmissions from '@/components/profile/UserSubmissions';
import ProfileSubscription from '@/components/profile/subscription/ProfileSubscription';
import { User, Briefcase, Settings, FileText, Crown } from 'lucide-react';

interface ModernProfileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ModernProfileCarousel: React.FC<ModernProfileCarouselProps> = ({ activeTab, onTabChange }) => {
  const { unifiedUser } = useAuth();
  const { t } = useTranslation('profile');
  const isDHLEmployee = unifiedUser?.isDHLEmployee || false;
  
  // Available tabs based on user type - mapped to match Profile.tsx structure
  const availableTabs = React.useMemo(() => {
    const tabs = [
      {
        id: 'overview',
        label: t('overview') || 'Přehled',
        icon: User,
        component: ProfileOverview as React.ComponentType<any>
      },
      {
        id: 'workData',
        label: t('workData') || 'Pracovní údaje',
        icon: Briefcase,
        component: ProfileWorkData as React.ComponentType<any>
      }
    ];
    
    if (isDHLEmployee) {
      tabs.push({
        id: 'dhlSettings',
        label: t('dhlSettings') || 'DHL nastavení',
        icon: Settings,
        component: DHLProfileSettings as React.ComponentType<any>
      });
    }
    
    tabs.push(
      {
        id: 'submissions',
        label: 'Moje žádosti',
        icon: FileText,
        component: UserSubmissions as React.ComponentType<any>
      },
      {
        id: 'subscription',
        label: t('subscription') || 'Předplatné',
        icon: Crown,
        component: ProfileSubscription as React.ComponentType<any>
      }
    );
    
    return tabs;
  }, [isDHLEmployee, t]);

  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);
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
    if (selectedTab && selectedTab.id !== internalActiveTab) {
      console.log(`Profile carousel switched to tab: ${selectedTab.id}`);
      setInternalActiveTab(selectedTab.id);
      onTabChange(selectedTab.id);
    }
  }, [emblaApi, internalActiveTab, availableTabs, onTabChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Sync external activeTab changes
  useEffect(() => {
    if (activeTab !== internalActiveTab) {
      setInternalActiveTab(activeTab);
      const tabIndex = availableTabs.findIndex(tab => tab.id === activeTab);
      if (tabIndex !== -1) {
        scrollTo(tabIndex);
      }
    }
  }, [activeTab, internalActiveTab, scrollTo, availableTabs]);

  const currentIndex = availableTabs.findIndex(tab => tab.id === internalActiveTab);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation Icons */}
      <div className="flex gap-2 justify-center mb-4">
        {availableTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = internalActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log(`Switching to profile tab: ${tab.id}`);
                setInternalActiveTab(tab.id);
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

      {/* Progress Indicator */}
      <ProfileCarouselProgress
        currentStep={currentIndex}
        totalSteps={availableTabs.length}
        stepLabels={availableTabs.map(tab => tab.label)}
        onStepClick={(step) => {
          setInternalActiveTab(availableTabs[step].id);
          onTabChange(availableTabs[step].id);
        }}
        availableTabs={availableTabs.map(tab => tab.id)}
      />

      {/* Swipeable Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {availableTabs.map((tab) => {
            const Component = tab.component;
            return (
              <div key={tab.id} className="flex-[0_0_100%] min-w-0">
                {(() => {
                  switch (tab.id) {
                    case 'overview':
                      return (
                        <Component 
                          onEdit={() => {}}
                          onSave={() => {}}
                          onCancel={() => {}}
                          isEditing={false}
                        />
                      );
                    case 'subscription':
                      return <Component isPremium={unifiedUser?.isPremium || false} />;
                    default:
                      return <Component />;
                  }
                })()}
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
              onClick={() => {
                setInternalActiveTab(availableTabs[index].id);
                onTabChange(availableTabs[index].id);
              }}
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
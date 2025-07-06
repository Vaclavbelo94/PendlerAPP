import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, ChevronDown, Upload, FileText, CheckCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import DHLEmployeeManagement from './DHLEmployeeManagement';
import DHLImportPanel from './DHLImportPanel';
import DHLSystemSettings from './DHLSystemSettings';
import { useTranslation } from 'react-i18next';

interface DHLAdminMobileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DHLAdminMobileCarousel: React.FC<DHLAdminMobileCarouselProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const { t } = useTranslation(['dhl', 'common']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const tabs = [
    {
      id: 'employees',
      title: 'Zaměstnanci',
      fullTitle: 'Správa zaměstnanců',
      icon: Users,
      component: <DHLEmployeeManagement />
    },
    {
      id: 'schedules', 
      title: 'Rozvrhy',
      fullTitle: 'Správa rozvrhů',
      icon: Calendar,
      component: <DHLImportPanel />
    },
    {
      id: 'settings',
      title: 'Nastavení', 
      fullTitle: 'Systémové nastavení',
      icon: Settings,
      component: <DHLSystemSettings />
    }
  ];

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === activeTab);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [activeTab]);

  const handleTabSelect = (tabId: string, index: number) => {
    setCurrentIndex(index);
    onTabChange(tabId);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Tab Navigation */}
      <div className="block">
        {/* Tab Indicators */}
        <div className="flex justify-center items-center gap-2 mb-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = index === currentIndex;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleTabSelect(tab.id, index)}
                className={cn(
                  "flex items-center gap-2 transition-all duration-200",
                  isActive ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "hover:bg-yellow-50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.fullTitle}</span>
                <span className="sm:hidden">{tab.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-8 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-yellow-600" : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Swipeable Content */}
      <Carousel 
        className="w-full" 
        orientation="horizontal"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false
        }}
        setApi={(api) => {
          if (api) {
            api.on('select', () => {
              const selected = api.selectedScrollSnap();
              setCurrentIndex(selected);
              onTabChange(tabs[selected].id);
            });
            
            // Set initial position
            api.scrollTo(currentIndex, false);
          }
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {tabs.map((tab, index) => (
            <CarouselItem key={tab.id} className="pl-2 md:pl-4 basis-full">
              <div className="min-h-[600px]">
                {tab.component}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </Carousel>

      {/* Tab Content Title */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-muted-foreground">
          {tabs[currentIndex]?.fullTitle}
        </h3>
      </div>
    </div>
  );
};

export default DHLAdminMobileCarousel;
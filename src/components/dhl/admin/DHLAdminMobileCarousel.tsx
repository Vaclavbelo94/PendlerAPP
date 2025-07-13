import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, ChevronDown, Upload, FileText, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import DHLEmployeeManagement from './DHLEmployeeManagement';
import DHLImportPanel from './DHLImportPanel';
import DHLSystemSettings from './DHLSystemSettings';
import ExcelImportPanel from './ExcelImportPanel';
import EmployeeTimeline from './EmployeeTimeline';
import ReportsGenerator from './ReportsGenerator';
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
      id: 'excel-import',
      title: 'Excel Import',
      fullTitle: 'Import směn z Excel',
      icon: Upload,
      component: <ExcelImportPanel />
    },
    {
      id: 'timeline',
      title: 'Timeline',
      fullTitle: 'Timeline zaměstnanců',
      icon: Clock,
      component: <EmployeeTimeline />
    },
    {
      id: 'reports',
      title: 'Reporty',
      fullTitle: 'Generování reportů',
      icon: BarChart3,
      component: <ReportsGenerator />
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
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Tab Navigation */}
      <div className="block">
        {/* Tab Indicators - Mobile Optimized */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mb-4 px-2">
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
                  "flex items-center gap-1 sm:gap-2 transition-all duration-200 min-h-[44px] px-2 sm:px-3 text-xs sm:text-sm touch-manipulation",
                  isActive ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "hover:bg-yellow-50",
                  "flex-1 max-w-[100px] sm:max-w-none"
                )}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">{tab.fullTitle}</span>
                <span className="sm:hidden truncate text-[10px]">{tab.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Progress Indicator - Mobile Optimized */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex gap-1 sm:gap-2">
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTabSelect(tabs[index].id, index)}
                className={cn(
                  "h-2 w-6 sm:w-8 rounded-full transition-all duration-300 touch-manipulation",
                  index === currentIndex ? "bg-yellow-600" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Swipeable Content - Mobile Optimized */}
      <Carousel 
        className="w-full touch-pan-x" 
        orientation="horizontal"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false,
          containScroll: "trimSnaps"
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
        <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
          {tabs.map((tab, index) => (
            <CarouselItem key={tab.id} className="pl-1 sm:pl-2 md:pl-4 basis-full">
              <div className="min-h-[500px] sm:min-h-[600px] overflow-hidden">
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

      {/* Tab Content Title - Mobile Optimized */}
      <div className="text-center px-2">
        <h3 className="text-base sm:text-lg font-medium text-muted-foreground">
          {tabs[currentIndex]?.fullTitle}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
          {currentIndex + 1} z {tabs.length}
        </p>
      </div>
    </div>
  );
};

export default DHLAdminMobileCarousel;
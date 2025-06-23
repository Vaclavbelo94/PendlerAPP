
import React from 'react';
import { FileTextIcon, FuelIcon, WrenchIcon, MoreHorizontalIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface VehicleNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const VehicleNavigation: React.FC<VehicleNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation(['vehicle', 'ui']);
  const isMobile = useIsMobile();

  const vehicleTabs = [
    {
      id: 'overview',
      icon: FileTextIcon,
      label: t('vehicle:overview'),
      description: t('vehicle:basicInfo')
    },
    {
      id: 'fuel',
      icon: FuelIcon,
      label: t('vehicle:fuel'),
      description: t('vehicle:fuelConsumption')
    },
    {
      id: 'service',
      icon: WrenchIcon,
      label: t('vehicle:service'),
      description: t('vehicle:maintenance')
    },
    {
      id: 'others',
      icon: MoreHorizontalIcon,
      label: t('vehicle:others'),
      description: t('vehicle:documents')
    }
  ];

  const currentIndex = vehicleTabs.findIndex(tab => tab.id === activeTab);
  const currentTab = vehicleTabs[currentIndex];

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? vehicleTabs.length - 1 : currentIndex - 1;
    onTabChange(vehicleTabs[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % vehicleTabs.length;
    onTabChange(vehicleTabs[nextIndex].id);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Navigation - Shows current tab with arrows */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 py-3 bg-card border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="p-2 hover:bg-primary/10"
              aria-label={t('ui:previous')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center px-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                {currentTab && (
                  <>
                    <currentTab.icon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-primary">
                      {currentTab.label}
                    </h3>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentTab?.description}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="p-2 hover:bg-primary/10"
              aria-label={t('ui:next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-3">
            <div className="flex gap-1">
              {vehicleTabs.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {vehicleTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative p-4 md:p-6 rounded-2xl border text-center transition-all duration-300 group min-h-[120px]",
                "hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive 
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-lg" 
                  : "bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"
                  layoutId="activeVehicleTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center h-full justify-center">
                <motion.div 
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-3",
                    isActive 
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 text-primary" 
                      : "bg-gradient-to-br from-muted/50 to-muted/30 text-muted-foreground group-hover:from-primary/10 group-hover:to-accent/10 group-hover:text-primary"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
                
                <h3 className={cn(
                  "font-semibold text-sm md:text-base transition-colors duration-300 mb-1 leading-tight",
                  isActive 
                    ? "text-primary" 
                    : "text-foreground group-hover:text-primary"
                )}>
                  {tab.label}
                </h3>
                
                <p className={cn(
                  "text-xs transition-colors duration-300 leading-tight px-1",
                  isActive 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {tab.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleNavigation;

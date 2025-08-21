import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { ProfileCarouselProgress } from './ProfileCarouselProgress';
import { BasicInfoTab } from './BasicInfoTab';
import { RideRequestsTab } from './RideRequestsTab';
import { DHLSettingsTab } from './DHLSettingsTab';

export const ModernProfileCarousel: React.FC = () => {
  const { unifiedUser } = useAuth();
  const { t } = useTranslation('profile');
  const isDHLEmployee = unifiedUser?.isDHLEmployee || false;
  
  // Available tabs based on user type
  const availableTabs = React.useMemo(() => {
    const tabs = ['basic', 'rides'];
    if (isDHLEmployee) {
      tabs.push('dhl');
    }
    return tabs;
  }, [isDHLEmployee]);

  const [activeTab, setActiveTab] = useState(availableTabs[0]);

  const { containerRef, currentIndex } = useSwipeNavigation({
    items: availableTabs,
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: true
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab />;
      case 'rides':
        return <RideRequestsTab />;
      case 'dhl':
        return <DHLSettingsTab />;
      default:
        return <BasicInfoTab />;
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <ProfileCarouselProgress
        currentStep={currentIndex}
        totalSteps={availableTabs.length}
        stepLabels={availableTabs.map(tab => t(`tabs.${tab}`))}
        onStepClick={(step) => setActiveTab(availableTabs[step])}
        availableTabs={availableTabs}
      />

      {/* Tab Content with Animation */}
      <motion.div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Tab Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {availableTabs.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary scale-125'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => setActiveTab(availableTabs[index])}
          />
        ))}
      </div>
    </div>
  );
};
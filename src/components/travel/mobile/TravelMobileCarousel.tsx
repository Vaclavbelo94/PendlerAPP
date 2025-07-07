
import React from 'react';
import { motion } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import EnhancedRideSharing from '../EnhancedRideSharing';
import HomeWorkTrafficMonitor from '../HomeWorkTrafficMonitor';
import { UniversalMobileNavigation } from '@/components/navigation/UniversalMobileNavigation';
import { Users, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TravelMobileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

const TravelMobileCarousel: React.FC<TravelMobileCarouselProps> = ({
  activeTab,
  onTabChange,
  origin,
  destination,  
  onOriginChange,
  onDestinationChange
}) => {
  const { t } = useTranslation('travel');
  const tabs = ['ridesharing', 'commute-traffic'];
  
  // Setup swipe navigation between tabs
  const { containerRef } = useSwipeNavigation({
    items: tabs,
    currentItem: activeTab,
    onItemChange: onTabChange,
    enabled: true
  });
  
  // Define tab info with translations
  const tabsInfo = [
    {
      id: 'ridesharing',
      label: t('ridesharing'),
      icon: Users,
      description: t('findRidemates')
    },
    {
      id: 'commute-traffic',
      label: t('commuteTraffic'),
      icon: Navigation,
      description: t('commuteTrafficDesc')
    }
  ];
  
  return (
    <div className="space-y-6">
      <UniversalMobileNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabs={tabsInfo}
        className="mb-2"
      />
      
      <motion.div 
        ref={containerRef}
        className="w-full overflow-hidden touch-pan-y"
      >
        {activeTab === 'ridesharing' && (
          <motion.div
            className="w-full flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <EnhancedRideSharing />
          </motion.div>
        )}
        
        {activeTab === 'commute-traffic' && (
          <motion.div
            className="w-full flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <HomeWorkTrafficMonitor />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TravelMobileCarousel;

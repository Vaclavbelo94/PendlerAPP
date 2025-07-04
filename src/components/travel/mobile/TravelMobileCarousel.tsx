
import React from 'react';
import { motion } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import EnhancedRideSharing from '../EnhancedRideSharing';
import TrafficMap from '../TrafficMap';
import { UniversalMobileNavigation } from '@/components/navigation/UniversalMobileNavigation';
import { Users, AlertTriangle } from 'lucide-react';
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
  const tabs = ['ridesharing', 'traffic'];
  
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
      id: 'traffic',
      label: t('liveTrafficShort'),
      icon: AlertTriangle,
      description: t('realTimeTraffic')
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
        <motion.div
          className="w-full flex flex-col space-y-4"
          animate={{
            translateX: activeTab === 'ridesharing' ? '0%' : '-100%'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          style={{ display: activeTab === 'ridesharing' ? 'block' : 'none' }}
        >
          <EnhancedRideSharing />
        </motion.div>
        
        <motion.div
          className="w-full flex flex-col space-y-4"
          animate={{
            translateX: activeTab === 'traffic' ? '0%' : '100%'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          style={{ display: activeTab === 'traffic' ? 'block' : 'none' }}
        >
          <TrafficMap 
            origin={origin} 
            destination={destination}
            onOriginChange={onOriginChange}
            onDestinationChange={onDestinationChange}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TravelMobileCarousel;

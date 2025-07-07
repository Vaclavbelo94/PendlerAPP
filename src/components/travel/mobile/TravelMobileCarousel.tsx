
import React from 'react';
import { motion } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import EnhancedRideSharing from '../EnhancedRideSharing';
import EnhancedTrafficPredictions from '../EnhancedTrafficPredictions';
import { TrafficAlertsManagerLazy, AITravelInsightsLazy, TravelAnalyticsDashboardLazy } from '../LazyTravelComponents';
import { UniversalMobileNavigation } from '@/components/navigation/UniversalMobileNavigation';
import { Users, AlertTriangle, Bell, Brain, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const tabs = ['ridesharing', 'traffic', 'alerts', 'insights', 'analytics'];
  
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
    },
    {
      id: 'alerts',
      label: t('trafficAlerts'),
      icon: Bell,
      description: t('personalizedAlerts')
    },
    {
      id: 'insights',
      label: t('smartRecommendations'),
      icon: Brain,
      description: 'AI Doporučení'
    },
    {
      id: 'analytics',
      label: 'Analytiky',
      icon: BarChart3,
      description: 'Přehledy cest'
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
        
        {activeTab === 'traffic' && (
          <motion.div
            className="w-full flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <EnhancedTrafficPredictions />
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            className="w-full flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <TrafficAlertsManagerLazy />
            </Suspense>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            className="w-full flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AITravelInsightsLazy />
            </Suspense>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            className="w-full flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <TravelAnalyticsDashboardLazy />
            </Suspense>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TravelMobileCarousel;

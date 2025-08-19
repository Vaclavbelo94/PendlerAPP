
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route, MapPin, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import CommuteOptimizer from './CommuteOptimizer';
import TrafficMap from './TrafficMap';
import TravelAnalyticsDashboard from './TravelAnalyticsDashboard';
import DHLRealTimeTrafficMonitor from './DHLRealTimeTrafficMonitor';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';

const EnhancedCommuteOptimizer: React.FC = () => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  // Check if user is DHL employee
  const isDHLUser = user?.user_metadata?.company === 'dhl' || false;

  const handleRouteUpdate = (newOrigin: string, newDestination: string) => {
    setOrigin(newOrigin);
    setDestination(newDestination);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={isDHLUser ? "dhl-monitor" : "optimizer"} className="w-full">
        <TabsList className={`grid w-full ${isDHLUser ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {isDHLUser && (
            <TabsTrigger value="dhl-monitor" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('realTimeMonitoring')}
            </TabsTrigger>
          )}
          <TabsTrigger value="optimizer" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            {t('optimizer')}
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t('liveTrafficShort')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
        </TabsList>

        {isDHLUser && (
          <TabsContent value="dhl-monitor">
            <DHLRealTimeTrafficMonitor />
          </TabsContent>
        )}

        <TabsContent value="optimizer">
          <CommuteOptimizer />
        </TabsContent>

        <TabsContent value="traffic">
          <TrafficMap origin={origin} destination={destination} />
        </TabsContent>

        <TabsContent value="analytics">
          <TravelAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCommuteOptimizer;

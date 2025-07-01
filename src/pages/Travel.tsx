
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route, Users, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EnhancedCommuteOptimizer from '@/components/travel/EnhancedCommuteOptimizer';
import EnhancedRideSharing from '@/components/travel/EnhancedRideSharing';
import TravelAnalyticsDashboard from '@/components/travel/TravelAnalyticsDashboard';

const Travel = () => {
  const { t } = useTranslation(['travel', 'navigation']);
  const [activeTab, setActiveTab] = useState('optimizer');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('navigation:travel')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('travel:travelDescription')}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              {t('travel:routeOptimization')}
            </TabsTrigger>
            <TabsTrigger value="rideshare" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('travel:ridesharing')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('travel:analytics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <EnhancedCommuteOptimizer />
            </motion.div>
          </TabsContent>

          <TabsContent value="rideshare">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <EnhancedRideSharing />
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TravelAnalyticsDashboard />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Travel;

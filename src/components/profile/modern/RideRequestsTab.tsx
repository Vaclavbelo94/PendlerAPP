import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RideRequestsSection from '@/components/profile/RideRequestsSection';

export const RideRequestsTab: React.FC = () => {
  const { t } = useTranslation('profile');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{t('tabs.rides')}</CardTitle>
                <CardDescription>{t('ridesTabDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ride Requests Content */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-lg">
          <RideRequestsSection />
        </div>
      </div>
    </motion.div>
  );
};
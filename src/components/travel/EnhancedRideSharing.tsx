
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedRideSharing } from './EnhancedRideSharing';
import TravelHub from './TravelHub';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const EnhancedRideSharing: React.FC = () => {
  const { t } = useTranslation('travel');

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {t('ridesharing')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('findRidemates')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('availableOffers')}
            </CardTitle>
            <Badge variant="secondary">Live</Badge>
          </div>
          <CardDescription>
            {t('findRidemates')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <TravelHub />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRideSharing;

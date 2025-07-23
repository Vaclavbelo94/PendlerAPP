
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RideSharing from './RideSharing';
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
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            {t('findRide')}
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('offerRide')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Aktivní nabídky</CardDescription>
              <CardTitle className="text-2xl font-bold text-primary">24</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Nové dnes</CardDescription>
              <CardTitle className="text-2xl font-bold text-green-600">8</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Úspěšnost</CardDescription>
              <CardTitle className="text-2xl font-bold text-orange-600">92%</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
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
            Najděte spolucestující pro vaše cesty nebo nabídněte svou jízdu
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <RideSharing />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRideSharing;

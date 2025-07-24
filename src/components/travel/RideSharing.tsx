import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { rideshareService, RideshareOfferWithDriver } from '@/services/rideshareService';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import ModernRideOfferCard from './rideshare/ModernRideOfferCard';
import RideOfferFormSheet from './rideshare/RideOfferFormSheet';
import { Skeleton } from '@/components/ui/skeleton';

const RideSharing: React.FC = () => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  const [offers, setOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);

  const loadOffers = async () => {
    try {
      const data = await rideshareService.getRideshareOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOffers();
    setRefreshing(false);
  };

  const handleContact = (ride: RideshareOfferWithDriver) => {
    if (!user) {
      toast.error(t('loginRequired'));
      return;
    }
    
    console.log('Contacting driver for ride:', ride.id);
    toast.success(t('contactRequestSent'));
  };

  const handleOfferCreated = () => {
    loadOffers();
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('availableOffers')}</h3>
          <p className="text-sm text-muted-foreground">
            {offers.length} {t('offers')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t('filter')}
          </Button>
          <Button 
            onClick={() => setIsFormSheetOpen(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('createOffer')}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('availableOffers')}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : offers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="mb-4">
                <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('noOffersAvailable')}</h3>
              <p className="text-muted-foreground mb-4">{t('noOffersDescription')}</p>
              <Button onClick={() => setIsFormSheetOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('createFirstOffer')}
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ModernRideOfferCard
                      ride={offer}
                      onContact={handleContact}
                      isAuthenticated={!!user}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slide-out Form Sheet */}
      <RideOfferFormSheet
        isOpen={isFormSheetOpen}
        setIsOpen={setIsFormSheetOpen}
        onOfferCreated={handleOfferCreated}
      />
    </div>
  );
};

export default RideSharing;
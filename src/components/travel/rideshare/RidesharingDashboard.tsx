import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { rideshareService, RideshareOfferWithDriver } from '@/services/rideshareService';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import ModernRideCard from './ModernRideCard';
import RideCreationWizard from './RideCreationWizard';
import ContactSystem from './ContactSystem';
import { cn } from '@/lib/utils';

const RidesharingDashboard: React.FC = () => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  
  const [offers, setOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RideshareOfferWithDriver | null>(null);
  const [showContactSystem, setShowContactSystem] = useState(false);

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

  const handleContact = (offer: RideshareOfferWithDriver) => {
    if (!user) {
      toast.error(t('loginRequired'));
      return;
    }
    
    setSelectedOffer(offer);
    setShowContactSystem(true);
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await rideshareService.deleteRideshareOffer(offerId);
      toast.success(t('offerDeleted'));
      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error(t('error'));
    }
  };

  const handleOfferCreated = () => {
    loadOffers();
    setShowCreateForm(false);
  };

  useEffect(() => {
    loadOffers();
  }, []);


  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Create Offer Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowCreateForm(true)}
          className="min-h-[44px] touch-manipulation bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>{t('createOffer')}</span>
        </Button>
      </div>


      {/* Ride Offers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {offers.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-muted/5 to-muted/10">
            <div className="mb-6">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {offers.length === 0 ? t('noOffersAvailable') : t('noMatchingOffers')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {offers.length === 0 ? t('noOffersDescription') : t('tryDifferentFilters')}
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('createFirstOffer')}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModernRideCard
                    ride={offer}
                    onContact={handleContact}
                    onDelete={handleDeleteOffer}
                    isAuthenticated={!!user}
                    currentUserId={user?.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Creation Wizard */}
      <RideCreationWizard
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={handleOfferCreated}
      />

      {/* Contact System */}
      <ContactSystem
        isOpen={showContactSystem}
        onClose={() => setShowContactSystem(false)}
        selectedOffer={selectedOffer}
      />
    </div>
  );
};

export default RidesharingDashboard;
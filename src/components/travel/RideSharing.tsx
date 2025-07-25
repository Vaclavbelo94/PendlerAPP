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
import ContactDriverDialog from './rideshare/ContactDriverDialog';
import { Skeleton } from '@/components/ui/skeleton';

const RideSharing: React.FC = () => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  const [offers, setOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RideshareOfferWithDriver | null>(null);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    maxPrice: '',
    minSeats: ''
  });

  const loadOffers = async () => {
    try {
      const data = await rideshareService.getRideshareOffers();
      setOffers(data);
      setFilteredOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = offers;
    
    if (filters.origin) {
      filtered = filtered.filter(offer => 
        offer.origin_address.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }
    
    if (filters.destination) {
      filtered = filtered.filter(offer => 
        offer.destination_address.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(offer => 
        offer.price_per_person <= parseFloat(filters.maxPrice)
      );
    }
    
    if (filters.minSeats) {
      filtered = filtered.filter(offer => 
        offer.seats_available >= parseInt(filters.minSeats)
      );
    }
    
    setFilteredOffers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      maxPrice: '',
      minSeats: ''
    });
    setFilteredOffers(offers);
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
    
    setSelectedOffer(ride);
    setContactDialogOpen(true);
  };

  const handleOfferCreated = () => {
    loadOffers();
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, offers]);

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
            {filteredOffers.length} {t('of')} {offers.length} {t('offers')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title={t('refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            title={t('filter')}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setIsFormSheetOpen(true)}
            size="icon"
            title={t('createOffer')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">{t('from')}</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm"
                placeholder={t('originPlaceholder')}
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('to')}</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm"
                placeholder={t('destinationPlaceholder')}
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('maxPrice')}</label>
              <input
                type="number"
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm"
                placeholder="0"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('minSeats')}</label>
              <input
                type="number"
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm"
                placeholder="1"
                value={filters.minSeats}
                onChange={(e) => setFilters({ ...filters, minSeats: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={clearFilters} variant="outline" size="sm">
              {t('clearFilters')}
            </Button>
          </div>
        </Card>
      )}

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
          ) : filteredOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="mb-4">
                <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {offers.length === 0 ? t('noOffersAvailable') : t('noMatchingOffers')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {offers.length === 0 ? t('noOffersDescription') : t('tryDifferentFilters')}
              </p>
              <Button onClick={() => setIsFormSheetOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('createFirstOffer')}
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredOffers.map((offer, index) => (
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
                      onDelete={handleDeleteOffer}
                      isAuthenticated={!!user}
                      currentUserId={user?.id}
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

      {/* Contact Driver Dialog */}
      <ContactDriverDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        selectedOffer={selectedOffer}
      />
    </div>
  );
};

export default RideSharing;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, RefreshCw, MapPin, Users, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponsiveGrid } from '@/components/ui/responsive-container';
import { Skeleton } from '@/components/ui/skeleton';
import { rideshareService, RideshareOfferWithDriver } from '@/services/rideshareService';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import ModernRideCard from './ModernRideCard';
import RideCreationWizard from './RideCreationWizard';
import ContactSystem from './ContactSystem';
import { cn } from '@/lib/utils';

interface FiltersState {
  origin: string;
  destination: string;
  maxPrice: string;
  minSeats: string;
}

const RidesharingDashboard: React.FC = () => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [offers, setOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RideshareOfferWithDriver | null>(null);
  const [showContactSystem, setShowContactSystem] = useState(false);
  
  const [filters, setFilters] = useState<FiltersState>({
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

  useEffect(() => {
    applyFilters();
  }, [filters, offers]);

  const StatsCard = ({ icon, label, value, variant = "default" }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    variant?: "default" | "success" | "warning";
  }) => (
    <Card className={cn(
      "border-0 shadow-md",
      variant === "success" && "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      variant === "warning" && "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            variant === "success" && "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
            variant === "warning" && "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
            variant === "default" && "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-bold text-lg">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveGrid
          columns={{ mobile: 1, sm: 2, md: 3 }}
          gap="gap-4"
        >
          <StatsCard
            icon={<Users className="h-5 w-5" />}
            label={t('availableOffers')}
            value={`${filteredOffers.length}/${offers.length}`}
            variant="success"
          />
          <StatsCard
            icon={<Euro className="h-5 w-5" />}
            label={t('free')}
            value={`${offers.filter(o => o.price_per_person === 0).length}`}
            variant="warning"
          />
          <StatsCard
            icon={<MapPin className="h-5 w-5" />}
            label={t('countries')}
            value="3"
          />
        </ResponsiveGrid>
      </motion.div>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
      >
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {t('availableOffers')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredOffers.length} {t('of')} {offers.length} {t('offers')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="min-h-[44px] touch-manipulation"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            <span>{t('refresh')}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "min-h-[44px] touch-manipulation",
              showFilters && "bg-primary/10 text-primary border-primary/30"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>{t('filter')}</span>
          </Button>
          
          <Button
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="min-h-[44px] touch-manipulation bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>{t('createOffer')}</span>
          </Button>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-muted/20 to-muted/10 border-primary/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('from')}</Label>
                  <Input
                    placeholder={t('originPlaceholder')}
                    value={filters.origin}
                    onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                    className="min-h-[44px]"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('to')}</Label>
                  <Input
                    placeholder={t('destinationPlaceholder')}
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    className="min-h-[44px]"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('maxPrice')} (€)</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="min-h-[44px]"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('minSeats')}</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={filters.minSeats}
                    onChange={(e) => setFilters({ ...filters, minSeats: e.target.value })}
                    className="min-h-[44px]"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="min-h-[44px] touch-manipulation"
                >
                  {t('clearFilters')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ride Offers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredOffers.length === 0 ? (
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
              {filteredOffers.map((offer, index) => (
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
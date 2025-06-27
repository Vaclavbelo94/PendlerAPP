import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Car, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from '@/hooks/use-toast';
import OptimizedAddressAutocomplete from './OptimizedAddressAutocomplete';
import EnhancedRideOfferCard from './rideshare/EnhancedRideOfferCard';
import { rideshareService, RideshareOfferWithDriver } from '@/services/rideshareService';
import { useTranslation } from 'react-i18next';

interface RideshareOffer {
  id: string;
  user_id: string;
  origin_address: string;
  destination_address: string;
  departure_date: string;
  departure_time: string;
  seats_available: number;
  price_per_person: number;
  notes: string;
  is_recurring: boolean;
  recurring_days: number[];
}

const RideSharing: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation('travel');
  const [offers, setOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    origin_address: '',
    destination_address: '',
    departure_date: '',
    departure_time: '07:00',
    seats_available: 3,
    price_per_person: 0,
    notes: '',
    is_recurring: false,
    recurring_days: [] as number[],
    phone_number: '',
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await rideshareService.getRideshareOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast({
        title: t('error'),
        description: t('loadingOffers'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: t('error'),
        description: t('phoneRequired'),
        variant: "destructive"
      });
      return;
    }
    if (!formData.phone_number || formData.phone_number.length < 4) {
      toast({
        title: t('error'),
        description: t('phoneNumberRequired'),
        variant: "destructive"
      });
      return;
    }
    try {
      await rideshareService.createRideshareOffer({
        user_id: user.id,
        ...formData
      });

      toast({
        title: t('success'),
        description: t('offerCreated')
      });

      setFormData({
        origin_address: '',
        destination_address: '',
        departure_date: '',
        departure_time: '07:00',
        seats_available: 3,
        price_per_person: 0,
        notes: '',
        is_recurring: false,
        recurring_days: [],
        phone_number: '',
      });

      loadOffers();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: t('error'),
        description: t('createOfferError'),
        variant: "destructive"
      });
    }
  };

  const handleContactDriver = async (ride: RideshareOfferWithDriver) => {
    if (!user) {
      toast({
        title: t('error'),
        description: t('loginRequired'),
        variant: "destructive"
      });
      return;
    }

    try {
      await rideshareService.contactDriver(ride.id, t('ridesharingDesc'));
      
      toast({
        title: t('success'),
        description: t('contactRequestSent')
      });
    } catch (error) {
      console.error('Error contacting driver:', error);
      toast({
        title: t('error'),
        description: t('contactError'),
        variant: "destructive"
      });
    }
  };

  const filteredOffers = offers.filter(offer => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      offer.origin_address.toLowerCase().includes(query) ||
      offer.destination_address.toLowerCase().includes(query) ||
      offer.driver.username.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">{t('browseOffers')}</TabsTrigger>
          <TabsTrigger value="create">{t('createOffer')}</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('findRide')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('searchByCity')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Offers List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('availableOffers')} ({filteredOffers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{t('loadingOffers')}</p>
                </div>
              ) : filteredOffers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Car className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>
                    {searchQuery 
                      ? `${t('noOffersFound')} "${searchQuery}"`
                      : t('noOffersAvailable')
                    }
                  </p>
                </div>
              ) : (
                <div
                  className="
                    grid gap-3
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {filteredOffers.map((offer) => (
                    <EnhancedRideOfferCard
                      key={offer.id}
                      ride={offer}
                      onContact={handleContactDriver}
                      isAuthenticated={!!user}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t('createRideOfferTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">{t('originPlace')}</Label>
                    <OptimizedAddressAutocomplete
                      value={formData.origin_address}
                      onChange={(value) => setFormData(prev => ({ ...prev, origin_address: value }))}
                      placeholder={t('enterOriginAddress')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">{t('destinationPlace')}</Label>
                    <OptimizedAddressAutocomplete
                      value={formData.destination_address}
                      onChange={(value) => setFormData(prev => ({ ...prev, destination_address: value }))}
                      placeholder={t('enterDestinationAddress')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t('departureDate')}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.departure_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, departure_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">{t('departureTime')}</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.departure_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, departure_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">{t('numberOfSeats')}</Label>
                    <Input
                      id="seats"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.seats_available}
                      onChange={(e) => setFormData(prev => ({ ...prev, seats_available: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{t('pricePerPerson')}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder={t('freeRide')}
                    value={formData.price_per_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_per_person: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('notes')}</Label>
                  <Textarea
                    id="notes"
                    placeholder={t('additionalInfo')}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">{t('phoneNumber')} *</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="+420 123 456 789"
                      value={formData.phone_number}
                      onChange={e => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      maxLength={20}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {t('createOffer')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RideSharing;

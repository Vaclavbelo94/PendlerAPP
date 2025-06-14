
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Car, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import OptimizedAddressAutocomplete from './OptimizedAddressAutocomplete';

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
  const [offers, setOffers] = useState<RideshareOffer[]>([]);
  const [formData, setFormData] = useState({
    origin_address: '',
    destination_address: '',
    departure_date: '',
    departure_time: '07:00',
    seats_available: 3,
    price_per_person: 0,
    notes: '',
    is_recurring: false,
    recurring_days: [] as number[]
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('rideshare_offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst nabídky sdílení jízd.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Chyba",
        description: "Pro vytvoření nabídky musíte být přihlášeni.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('rideshare_offers')
        .insert({
          user_id: user.id,
          origin_address: formData.origin_address,
          destination_address: formData.destination_address,
          departure_date: formData.departure_date,
          departure_time: formData.departure_time,
          seats_available: formData.seats_available,
          price_per_person: formData.price_per_person,
          notes: formData.notes,
          is_recurring: formData.is_recurring,
          recurring_days: formData.recurring_days
        });

      if (error) throw error;

      toast({
        title: "Úspěch",
        description: "Nabídka sdílení jízdy byla vytvořena."
      });

      // Reset form
      setFormData({
        origin_address: '',
        destination_address: '',
        departure_date: '',
        departure_time: '07:00',
        seats_available: 3,
        price_per_person: 0,
        notes: '',
        is_recurring: false,
        recurring_days: []
      });

      loadOffers();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vytvořit nabídku.",
        variant: "destructive"
      });
    }
  };

  const handleContactOwner = async (offerId: string) => {
    if (!user) {
      toast({
        title: "Chyba",
        description: "Pro kontaktování majitele musíte být přihlášeni.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('rideshare_contacts')
        .insert({
          offer_id: offerId,
          requester_user_id: user.id,
          message: 'Mám zájem o vaši nabídku sdílení jízdy.'
        });

      if (error) throw error;

      toast({
        title: "Úspěch",
        description: "Žádost o kontakt byla odeslána majiteli nabídky."
      });
    } catch (error) {
      console.error('Error contacting owner:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se odeslat žádost o kontakt.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Procházet nabídky</TabsTrigger>
          <TabsTrigger value="create">Vytvořit nabídku</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Dostupné nabídky sdílení jízd
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Car className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Momentálně nejsou dostupné žádné nabídky sdílení jízd.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {offer.origin_address} → {offer.destination_address}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {offer.departure_date} v {offer.departure_time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {offer.seats_available} míst
                            </div>
                            {offer.price_per_person > 0 && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {offer.price_per_person} Kč/osoba
                              </div>
                            )}
                          </div>
                          {offer.notes && (
                            <p className="text-sm text-muted-foreground">{offer.notes}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleContactOwner(offer.id)}
                          disabled={offer.user_id === user?.id}
                        >
                          {offer.user_id === user?.id ? 'Vaše nabídka' : 'Kontaktovat'}
                        </Button>
                      </div>
                    </div>
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
                Vytvořit nabídku sdílení jízdy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Výchozí místo</Label>
                    <OptimizedAddressAutocomplete
                      value={formData.origin_address}
                      onChange={(value) => setFormData(prev => ({ ...prev, origin_address: value }))}
                      placeholder="Zadejte výchozí adresu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Cílové místo</Label>
                    <OptimizedAddressAutocomplete
                      value={formData.destination_address}
                      onChange={(value) => setFormData(prev => ({ ...prev, destination_address: value }))}
                      placeholder="Zadejte cílovou adresu"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum odjezdu</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.departure_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, departure_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Čas odjezdu</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.departure_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, departure_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Počet míst</Label>
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
                  <Label htmlFor="price">Cena za osobu (Kč)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="0 = zdarma"
                    value={formData.price_per_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_per_person: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Poznámky</Label>
                  <Textarea
                    id="notes"
                    placeholder="Doplňující informace o jízdě..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Vytvořit nabídku
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

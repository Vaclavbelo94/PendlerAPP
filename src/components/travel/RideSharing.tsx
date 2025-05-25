
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { rideshareService, RideshareOffer } from "@/services/rideshareService";
import RideOfferForm from './rideshare/RideOfferForm';
import RideSearchForm from './rideshare/RideSearchForm';
import RideOfferCard from './rideshare/RideOfferCard';
import ContactDriverDialog from './rideshare/ContactDriverDialog';

const RideSharing = () => {
  const { user } = useAuth();
  const [offerMode, setOfferMode] = useState(false);
  const [rides, setRides] = useState<RideshareOffer[]>([]);
  const [userOffers, setUserOffers] = useState<RideshareOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RideshareOffer | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  useEffect(() => {
    loadRides();
    if (user?.id) {
      loadUserOffers();
    }
  }, [user?.id]);

  const loadRides = async () => {
    try {
      setLoading(true);
      const data = await rideshareService.getOffers({
        origin: searchFilters.origin,
        destination: searchFilters.destination,
        date: searchFilters.date,
        limit: 20
      });
      setRides(data);
    } catch (error) {
      console.error('Error loading rides:', error);
      toast.error('Nepodařilo se načíst spolujízdy');
    } finally {
      setLoading(false);
    }
  };

  const loadUserOffers = async () => {
    if (!user?.id) return;
    
    try {
      const data = await rideshareService.getUserOffers(user.id);
      setUserOffers(data);
    } catch (error) {
      console.error('Error loading user offers:', error);
    }
  };

  const handleOfferCreated = () => {
    setOfferMode(false);
    loadRides();
    loadUserOffers();
  };

  const handleContactOffer = (offer: RideshareOffer) => {
    setSelectedOffer(offer);
    setContactDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {offerMode ? 'Nabídnout spolujízdu' : 'Najít spolujízdu'}
        </h2>
        <Button 
          variant={offerMode ? "outline" : "default"}
          onClick={() => setOfferMode(!offerMode)}
          className="flex items-center gap-2"
        >
          {offerMode ? (
            <>Zpět na vyhledávání</>
          ) : (
            <><Car className="h-4 w-4" /> Nabídnout spolujízdu</>
          )}
        </Button>
      </div>
      
      {offerMode ? (
        <RideOfferForm 
          onOfferCreated={handleOfferCreated}
          onCancel={() => setOfferMode(false)}
        />
      ) : (
        <div className="space-y-6">
          <RideSearchForm
            searchFilters={searchFilters}
            onSearchFiltersChange={setSearchFilters}
            onSearch={loadRides}
          />
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Dostupné spolujízdy</h3>
            
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Načítám spolujízdy...</p>
                </CardContent>
              </Card>
            ) : rides.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Žádné spolujízdy nebyly nalezeny</p>
                </CardContent>
              </Card>
            ) : (
              rides.map(ride => (
                <RideOfferCard
                  key={ride.id}
                  ride={ride}
                  onContact={handleContactOffer}
                  isAuthenticated={!!user}
                />
              ))
            )}
          </div>
        </div>
      )}

      <ContactDriverDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        selectedOffer={selectedOffer}
      />
    </div>
  );
};

export default RideSharing;

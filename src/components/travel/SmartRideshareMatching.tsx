import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Star, MapPin, Clock, MessageCircle } from 'lucide-react';
import { enhancedRideshareService, RideshareMatch } from '@/services/enhancedRideshareService';
import { useAuth } from '@/hooks/auth';
import { toast } from '@/hooks/use-toast';
import ContactDriverDialog from './rideshare/ContactDriverDialog';
import { RideshareOfferWithDriver } from '@/services/rideshareService';

const SmartRideshareMatching: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<RideshareMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RideshareOfferWithDriver | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    flexibility: 30
  });

  const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.date) {
      toast({
        title: "Chyba",
        description: "Vyplňte všechna povinná pole.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const results = await enhancedRideshareService.findMatches(
        searchParams.origin,
        searchParams.destination,
        searchParams.date,
        searchParams.flexibility
      );
      setMatches(results);
      
      if (results.length === 0) {
        toast({
          title: "Žádné výsledky",
          description: "Pro zadané kritéria nebyly nalezeny žádné spolujízdy.",
        });
      }
    } catch (error) {
      console.error('Error searching matches:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vyhledat spolujízdy.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactDriver = (offer: RideshareMatch) => {
    // Convert RideshareMatch to RideshareOfferWithDriver
    const convertedOffer: RideshareOfferWithDriver = {
      ...offer,
      driver: {
        username: offer.profiles?.username || 'Anonymní řidič',
        phone_number: offer.phone_number,
        rating: offer.rating,
        completed_rides: offer.completed_rides
      }
    };
    setSelectedOffer(convertedOffer);
    setContactDialogOpen(true);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 0.8) return 'Výborná shoda';
    if (score >= 0.6) return 'Dobrá shoda';
    return 'Částečná shoda';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chytré vyhledávání spolujízd
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-origin">Výchozí místo</Label>
              <Input
                id="search-origin"
                placeholder="Zadejte výchozí adresu"
                value={searchParams.origin}
                onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-destination">Cílové místo</Label>
              <Input
                id="search-destination"
                placeholder="Zadejte cílovou adresu"
                value={searchParams.destination}
                onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-date">Datum cesty</Label>
              <Input
                id="search-date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flexibility">Flexibilita (dny)</Label>
              <Input
                id="flexibility"
                type="number"
                min="1"
                max="30"
                value={searchParams.flexibility}
                onChange={(e) => setSearchParams(prev => ({ ...prev, flexibility: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <Button onClick={handleSearch} disabled={loading} className="w-full">
            {loading ? 'Hledám...' : 'Najít spolujízdy'}
          </Button>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nalezené spolujízdy ({matches.length})</h3>
          
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {match.origin_address} → {match.destination_address}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {match.departure_date} v {match.departure_time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {match.seats_available} míst
                      </div>
                      {match.rating && match.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          {match.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge className={getMatchScoreColor(match.matchScore)}>
                      {getMatchScoreText(match.matchScore)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(match.matchScore * 100)}% shoda
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Řidič: </span>
                      <span className="font-medium">{match.profiles?.username || 'Anonymní'}</span>
                    </div>
                    {match.completed_rides && match.completed_rides > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {match.completed_rides} dokončených jízd
                      </div>
                    )}
                    {match.price_per_person && match.price_per_person > 0 && (
                      <div className="text-sm font-medium">
                        {match.price_per_person} Kč/osoba
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContactDriver(match)}
                      disabled={match.user_id === user?.id}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {match.user_id === user?.id ? 'Vaše nabídka' : 'Kontaktovat'}
                    </Button>
                  </div>
                </div>

                {match.notes && (
                  <Alert className="mt-3">
                    <AlertDescription className="text-sm">
                      {match.notes}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
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

export default SmartRideshareMatching;

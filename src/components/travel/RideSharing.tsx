import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, MapPin, Calendar, User, Users, Car, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { rideshareService, RideshareOffer, RideshareContact } from "@/services/rideshareService";
import AddressAutocomplete from './AddressAutocomplete';

const RideSharing = () => {
  const { user } = useAuth();
  const [offerMode, setOfferMode] = useState(false);
  const [rides, setRides] = useState<RideshareOffer[]>([]);
  const [userOffers, setUserOffers] = useState<RideshareOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RideshareOffer | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  
  const [newRideOffer, setNewRideOffer] = useState({
    origin_address: '',
    destination_address: '',
    departure_time: '07:00',
    departure_date: '',
    seats_available: 2,
    price_per_person: '',
    notes: ''
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

  const handleSubmitOffer = async () => {
    if (!user?.id) {
      toast.error('Pro nabídnutí spolujízdy se musíte přihlásit');
      return;
    }

    if (!newRideOffer.origin_address || !newRideOffer.destination_address || !newRideOffer.departure_date) {
      toast.error("Vyplňte prosím všechny povinné údaje.");
      return;
    }
    
    try {
      await rideshareService.createOffer({
        ...newRideOffer,
        user_id: user.id,
        price_per_person: newRideOffer.price_per_person ? parseFloat(newRideOffer.price_per_person) : undefined
      });
      
      toast.success("Vaše nabídka spolujízdy byla úspěšně přidána.");
      
      // Reset form and switch back to search view
      setNewRideOffer({
        origin_address: '',
        destination_address: '',
        departure_time: '07:00',
        departure_date: '',
        seats_available: 2,
        price_per_person: '',
        notes: ''
      });
      setOfferMode(false);
      loadRides();
      loadUserOffers();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Nepodařilo se vytvořit nabídku spolujízdy');
    }
  };

  const handleContactDriver = async () => {
    if (!user?.id || !selectedOffer?.id) return;

    try {
      await rideshareService.createContact({
        offer_id: selectedOffer.id,
        requester_user_id: user.id,
        message: contactMessage
      });
      
      toast.success("Řidič byl kontaktován. Brzy vás bude kontaktovat.");
      setContactDialogOpen(false);
      setContactMessage('');
      setSelectedOffer(null);
    } catch (error) {
      console.error('Error contacting driver:', error);
      toast.error('Nepodařilo se kontaktovat řidiče');
    }
  };

  const handleSearch = () => {
    loadRides();
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
        <Card>
          <CardHeader>
            <CardTitle>Nabídněte svou spolujízdu</CardTitle>
            <CardDescription>Sdílejte cestu s ostatními pendlery a ušetřete náklady.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offer-origin">Místo odjezdu *</Label>
                <AddressAutocomplete
                  value={newRideOffer.origin_address}
                  onChange={(value) => setNewRideOffer({...newRideOffer, origin_address: value})}
                  placeholder="Odkud vyjíždíte"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-destination">Cíl cesty *</Label>
                <AddressAutocomplete
                  value={newRideOffer.destination_address}
                  onChange={(value) => setNewRideOffer({...newRideOffer, destination_address: value})}
                  placeholder="Kam jedete"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-date">Datum odjezdu *</Label>
                <Input 
                  id="offer-date"
                  type="date"
                  value={newRideOffer.departure_date}
                  onChange={(e) => setNewRideOffer({...newRideOffer, departure_date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-time">Čas odjezdu *</Label>
                <Input 
                  id="offer-time"
                  type="time"
                  value={newRideOffer.departure_time}
                  onChange={(e) => setNewRideOffer({...newRideOffer, departure_time: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-seats">Počet volných míst</Label>
                <Select 
                  value={newRideOffer.seats_available.toString()}
                  onValueChange={(value) => setNewRideOffer({...newRideOffer, seats_available: parseInt(value)})}
                >
                  <SelectTrigger id="offer-seats">
                    <SelectValue placeholder="Počet míst" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 místo</SelectItem>
                    <SelectItem value="2">2 místa</SelectItem>
                    <SelectItem value="3">3 místa</SelectItem>
                    <SelectItem value="4">4 místa</SelectItem>
                    <SelectItem value="5">5 míst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-price">Cena za osobu (CZK)</Label>
                <Input 
                  id="offer-price"
                  placeholder="Např. 150" 
                  value={newRideOffer.price_per_person}
                  onChange={(e) => setNewRideOffer({...newRideOffer, price_per_person: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offer-notes">Poznámka (pravidelnost, podmínky)</Label>
              <Textarea 
                id="offer-notes"
                placeholder="Volitelné poznámky k vaší nabídce" 
                value={newRideOffer.notes}
                onChange={(e) => setNewRideOffer({...newRideOffer, notes: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitOffer} className="w-full">Zveřejnit nabídku</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vyhledat spolujízdu</CardTitle>
              <CardDescription>Najděte spolujízdu podle vašich potřeb.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AddressAutocomplete
                  value={searchFilters.origin}
                  onChange={(value) => setSearchFilters({...searchFilters, origin: value})}
                  placeholder="Místo odjezdu"
                />
                <AddressAutocomplete
                  value={searchFilters.destination}
                  onChange={(value) => setSearchFilters({...searchFilters, destination: value})}
                  placeholder="Cíl cesty"
                />
                <Input 
                  type="date" 
                  value={searchFilters.date}
                  onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                />
                <Button onClick={handleSearch} className="md:col-span-3">Hledat spolujízdy</Button>
              </div>
            </CardContent>
          </Card>
          
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
                <Card key={ride.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" /> Řidič
                      </CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {ride.seats_available} míst
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {ride.departure_date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Odkud</p>
                            <p className="text-sm text-muted-foreground">{ride.origin_address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Kam</p>
                            <p className="text-sm text-muted-foreground">{ride.destination_address}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Odjezd</p>
                            <p className="text-sm text-muted-foreground">{ride.departure_time}</p>
                          </div>
                        </div>
                        
                        {ride.price_per_person && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Cena:</p>
                            <p className="text-sm">{ride.price_per_person} CZK</p>
                          </div>
                        )}
                        
                        {ride.notes && (
                          <p className="text-sm text-muted-foreground italic">{ride.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedOffer(ride);
                        setContactDialogOpen(true);
                      }}
                      variant="outline"
                      disabled={!user}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Kontaktovat řidiče
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kontaktovat řidiče</DialogTitle>
            <DialogDescription>
              Pošlete zprávu řidiči a vyjednejte podrobnosti spolujízdy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Napište zprávu řidiči..."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
                Zrušit
              </Button>
              <Button onClick={handleContactDriver} disabled={!contactMessage.trim()}>
                Odeslat zprávu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideSharing;

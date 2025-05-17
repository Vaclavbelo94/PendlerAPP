
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, User, Users, Car } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const RideSharing = () => {
  const [offerMode, setOfferMode] = useState(false);
  
  // Sample ride offers data
  const sampleRides = [
    {
      id: '1',
      driver: 'Jan Novák',
      origin: 'Praha, Česká republika',
      destination: 'Dresden, Deutschland',
      departureTime: '06:30',
      departureDate: '2023-06-15',
      seatsAvailable: 3,
      price: '150 CZK',
      notes: 'Jezdím každé pondělí a středu. Auto s klimatizací.'
    },
    {
      id: '2',
      driver: 'Marie Svobodová',
      origin: 'Chomutov, Česká republika',
      destination: 'Chemnitz, Deutschland',
      departureTime: '05:45',
      departureDate: '2023-06-14',
      seatsAvailable: 2,
      price: '120 CZK',
      notes: 'Pouze úterý a čtvrtek. Možnost převezení menších zavazadel.'
    },
    {
      id: '3',
      driver: 'Petr Černý',
      origin: 'Most, Česká republika',
      destination: 'Leipzig, Deutschland',
      departureTime: '06:15',
      departureDate: '2023-06-16',
      seatsAvailable: 1,
      price: '200 CZK',
      notes: 'Jezdím každý pátek. Nekuřácké auto.'
    }
  ];

  const [newRideOffer, setNewRideOffer] = useState({
    origin: '',
    destination: '',
    departureTime: '07:00',
    departureDate: '',
    seatsAvailable: '2',
    price: '',
    notes: ''
  });

  const handleSubmitOffer = () => {
    if (!newRideOffer.origin || !newRideOffer.destination || !newRideOffer.departureDate) {
      toast({
        title: "Neúplné údaje",
        description: "Vyplňte prosím všechny povinné údaje.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Nabídka přidána",
      description: "Vaše nabídka spolujízdy byla úspěšně přidána.",
    });
    
    // Reset form and switch back to search view
    setNewRideOffer({
      origin: '',
      destination: '',
      departureTime: '07:00',
      departureDate: '',
      seatsAvailable: '2',
      price: '',
      notes: ''
    });
    setOfferMode(false);
  };

  const handleContactDriver = (rideId: string) => {
    toast({
      title: "Kontakt odeslán",
      description: "Řidič byl kontaktován. Brzy vás bude kontaktovat.",
    });
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
                <Input 
                  id="offer-origin"
                  placeholder="Odkud vyjíždíte" 
                  value={newRideOffer.origin}
                  onChange={(e) => setNewRideOffer({...newRideOffer, origin: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-destination">Cíl cesty *</Label>
                <Input 
                  id="offer-destination"
                  placeholder="Kam jedete" 
                  value={newRideOffer.destination}
                  onChange={(e) => setNewRideOffer({...newRideOffer, destination: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-date">Datum odjezdu *</Label>
                <Input 
                  id="offer-date"
                  type="date"
                  value={newRideOffer.departureDate}
                  onChange={(e) => setNewRideOffer({...newRideOffer, departureDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-time">Čas odjezdu *</Label>
                <Input 
                  id="offer-time"
                  type="time"
                  value={newRideOffer.departureTime}
                  onChange={(e) => setNewRideOffer({...newRideOffer, departureTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-seats">Počet volných míst</Label>
                <Select 
                  value={newRideOffer.seatsAvailable}
                  onValueChange={(value) => setNewRideOffer({...newRideOffer, seatsAvailable: value})}
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
                  value={newRideOffer.price}
                  onChange={(e) => setNewRideOffer({...newRideOffer, price: e.target.value})}
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
                <Input placeholder="Místo odjezdu" />
                <Input placeholder="Cíl cesty" />
                <Input type="date" />
                <Button className="md:col-span-3">Hledat spolujízdy</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Dostupné spolujízdy</h3>
            
            {sampleRides.map(ride => (
              <Card key={ride.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" /> {ride.driver}
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {ride.seatsAvailable} míst
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {ride.departureDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Odkud</p>
                          <p className="text-sm text-muted-foreground">{ride.origin}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Kam</p>
                          <p className="text-sm text-muted-foreground">{ride.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Odjezd</p>
                          <p className="text-sm text-muted-foreground">{ride.departureTime}</p>
                        </div>
                      </div>
                      
                      {ride.price && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Cena:</p>
                          <p className="text-sm">{ride.price}</p>
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
                    onClick={() => handleContactDriver(ride.id)}
                    variant="outline"
                  >
                    Kontaktovat řidiče
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RideSharing;

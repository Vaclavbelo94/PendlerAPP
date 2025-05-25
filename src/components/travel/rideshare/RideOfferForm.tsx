
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { rideshareService } from "@/services/rideshareService";
import AddressAutocomplete from '../AddressAutocomplete';

interface RideOfferFormProps {
  onOfferCreated: () => void;
  onCancel: () => void;
}

const RideOfferForm = ({ onOfferCreated, onCancel }: RideOfferFormProps) => {
  const { user } = useAuth();
  const [newRideOffer, setNewRideOffer] = useState({
    origin_address: '',
    destination_address: '',
    departure_time: '07:00',
    departure_date: '',
    seats_available: 2,
    price_per_person: '',
    notes: ''
  });

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
      
      // Reset form
      setNewRideOffer({
        origin_address: '',
        destination_address: '',
        departure_time: '07:00',
        departure_date: '',
        seats_available: 2,
        price_per_person: '',
        notes: ''
      });
      
      onOfferCreated();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Nepodařilo se vytvořit nabídku spolujízdy');
    }
  };

  return (
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
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Zrušit
        </Button>
        <Button onClick={handleSubmitOffer} className="flex-1">
          Zveřejnit nabídku
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideOfferForm;

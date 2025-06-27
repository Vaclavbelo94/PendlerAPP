import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/hooks/auth';
import { rideshareService } from "@/services/rideshareService";

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
    notes: '',
    phone_number: ''
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

    if (!newRideOffer.phone_number) {
      toast.error("Zadejte prosím telefonní číslo.");
      return;
    }

    try {
      await rideshareService.createRideshareOffer({
        ...newRideOffer,
        user_id: user.id,
        price_per_person: newRideOffer.price_per_person ? parseFloat(newRideOffer.price_per_person) : 0,
        is_recurring: false,
        recurring_days: []
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
        notes: '',
        phone_number: ''
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
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="offer-origin"
                className="pl-10"
                value={newRideOffer.origin_address}
                onChange={(e) => setNewRideOffer({...newRideOffer, origin_address: e.target.value})}
                placeholder="Odkud vyjíždíte"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-destination">Cíl cesty *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="offer-destination"
                className="pl-10"
                value={newRideOffer.destination_address}
                onChange={(e) => setNewRideOffer({...newRideOffer, destination_address: e.target.value})}
                placeholder="Kam jedete"
              />
            </div>
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
          
          <div className="space-y-2">
            <Label htmlFor="offer-phone">Telefonní číslo *</Label>
            <Input
              id="offer-phone"
              type="tel"
              placeholder="+420 123 456 789"
              value={newRideOffer.phone_number}
              maxLength={20}
              onChange={e => setNewRideOffer({ ...newRideOffer, phone_number: e.target.value })}
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

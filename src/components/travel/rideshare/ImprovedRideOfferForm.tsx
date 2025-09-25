import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/auth';
import { rideshareService } from "@/services/rideshareService";
import { getDefaultCurrencyByLanguage, getCurrencyList } from '@/utils/currencyUtils';
import { useTranslation } from 'react-i18next';
import { DatePicker } from "@/components/ui/date-picker";
import CityAutocomplete from "@/components/common/CityAutocomplete";

interface ImprovedRideOfferFormProps {
  onOfferCreated: () => void;
  onCancel: () => void;
}

const ImprovedRideOfferForm = ({ onOfferCreated, onCancel }: ImprovedRideOfferFormProps) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('travel');
  
  const [newRideOffer, setNewRideOffer] = useState({
    origin_address: '',
    destination_address: '',
    departure_time: '07:00',
    departure_date: null as Date | null,
    seats_available: 2,
    price_per_person: '',
    currency: getDefaultCurrencyByLanguage(i18n.language),
    notes: '',
    phone_number: ''
  });

  const handleSubmitOffer = async () => {
    if (!user?.id) {
      toast({
        title: t('error'),
        description: t('loginRequired'),
        variant: 'destructive'
      });
      return;
    }

    if (!newRideOffer.origin_address || !newRideOffer.destination_address || !newRideOffer.departure_date) {
      toast({
        title: t('error'),
        description: `${t('originRequired')}, ${t('destinationRequired')}, ${t('selectDepartureDate')}`,
        variant: 'destructive'
      });
      return;
    }

    if (!newRideOffer.phone_number) {
      toast({
        title: t('error'), 
        description: t('phoneRequired'),
        variant: 'destructive'
      });
      return;
    }

    try {
      await rideshareService.createRideshareOffer({
        ...newRideOffer,
        departure_date: newRideOffer.departure_date!.toISOString().split('T')[0],
        user_id: user.id,
        price_per_person: newRideOffer.price_per_person ? parseFloat(newRideOffer.price_per_person) : 0,
        currency: newRideOffer.currency,
        is_recurring: false,
        recurring_days: []
      });
      
      toast({
        title: t('success'),
        description: t('offerCreated')
      });
      
      // Reset form
      setNewRideOffer({
        origin_address: '',
        destination_address: '',
        departure_time: '07:00',
        departure_date: null,
        seats_available: 2,
        price_per_person: '',
        currency: getDefaultCurrencyByLanguage(i18n.language),
        notes: '',
        phone_number: ''
      });
      
      onOfferCreated();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: t('error'),
        description: t('contactError'),
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('createRideOfferTitle')}</CardTitle>
        <CardDescription>{t('createRideOfferDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="offer-origin">{t('from')} *</Label>
            <CityAutocomplete
              id="offer-origin"
              value={newRideOffer.origin_address}
              onChange={(value) => setNewRideOffer({...newRideOffer, origin_address: value})}
              placeholder={t('originPlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-destination">{t('to')} *</Label>
            <CityAutocomplete
              id="offer-destination"
              value={newRideOffer.destination_address}
              onChange={(value) => setNewRideOffer({...newRideOffer, destination_address: value})}
              placeholder={t('destinationPlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-date">{t('departureDate')} *</Label>
            <DatePicker
              selected={newRideOffer.departure_date}
              onSelect={(date) => setNewRideOffer({...newRideOffer, departure_date: date || null})}
              placeholderText={t('selectDepartureDate')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-time">{t('departureTime')} *</Label>
            <Input 
              id="offer-time"
              type="time"
              value={newRideOffer.departure_time}
              onChange={(e) => setNewRideOffer({...newRideOffer, departure_time: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-seats">{t('seatsAvailable')}</Label>
            <Input
              id="offer-seats"
              type="number"
              min="1"
              max="8"
              value={newRideOffer.seats_available}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setNewRideOffer({...newRideOffer, seats_available: Math.max(1, Math.min(8, value))});
              }}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-price">{t('pricePerPerson')}</Label>
            <div className="flex gap-2">
              <Input 
                id="offer-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0" 
                value={newRideOffer.price_per_person}
                onChange={(e) => setNewRideOffer({...newRideOffer, price_per_person: e.target.value})}
                className="flex-1"
              />
              <Select 
                value={newRideOffer.currency} 
                onValueChange={(value) => setNewRideOffer({...newRideOffer, currency: value})}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getCurrencyList().map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Zadejte 0 pro jízdu {t('free')}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offer-phone">{t('contactPhone')} *</Label>
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
          <Label htmlFor="offer-notes">{t('additionalNotes')}</Label>
          <Textarea 
            id="offer-notes"
            placeholder={t('notesPlaceholder')} 
            value={newRideOffer.notes}
            onChange={(e) => setNewRideOffer({...newRideOffer, notes: e.target.value})}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmitOffer} className="flex-1">
          {t('createOffer')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImprovedRideOfferForm;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Clock, Users, CreditCard, MessageSquare, Phone, Navigation, Calendar, Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { rideshareService } from '@/services/rideshareService';
import { toast } from 'sonner';
import { getCountryConfig } from '@/utils/enhancedCountryUtils';
import { AddressQuickFill } from '@/components/travel/AddressQuickFill';

interface CreateRideOfferFormProps {
  onOfferCreated: () => void;
}

const CreateRideOfferForm: React.FC<CreateRideOfferFormProps> = ({ onOfferCreated }) => {
  const { t, i18n } = useTranslation('travel');
  const { user } = useAuth();
  const countryConfig = getCountryConfig(i18n.language);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin_address: '',
    destination_address: '',
    departure_date: null as Date | null,
    departure_time: '',
    seats_available: 1,
    price_per_person: 0,
    notes: '',
    phone_number: '',
    allow_phone_contact: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('loginRequired'));
      return;
    }

    // Basic validation
    if (!formData.origin_address.trim()) {
      toast.error('Vyplňte výchozí adresu');
      return;
    }

    if (!formData.destination_address.trim()) {
      toast.error('Vyplňte cílovou adresu');
      return;
    }

    if (!formData.departure_date) {
      toast.error(t('selectDepartureDate'));
      return;
    }

    if (!formData.departure_time) {
      toast.error('Vyberte čas odjezdu');
      return;
    }

    if (formData.seats_available < 1 || formData.seats_available > 8) {
      toast.error('Počet míst musí být mezi 1 a 8');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating offer with data:', {
        user_id: user.id,
        origin_address: formData.origin_address,
        destination_address: formData.destination_address,
        departure_date: formData.departure_date.toISOString().split('T')[0],
        departure_time: formData.departure_time,
        seats_available: formData.seats_available,
        price_per_person: formData.price_per_person,
        currency: countryConfig.currency,
        notes: formData.notes || '',
        phone_number: formData.allow_phone_contact ? formData.phone_number : '',
        is_recurring: false,
        recurring_days: []
      });

      await rideshareService.createOffer({
        user_id: user.id,
        origin_address: formData.origin_address.trim(),
        destination_address: formData.destination_address.trim(),
        departure_date: formData.departure_date.toISOString().split('T')[0],
        departure_time: formData.departure_time,
        seats_available: formData.seats_available,
        price_per_person: Math.max(0, formData.price_per_person),
        currency: countryConfig.currency,
        notes: formData.notes || '',
        phone_number: formData.allow_phone_contact ? formData.phone_number : '',
        is_recurring: false,
        recurring_days: []
      });

      toast.success(t('offerCreated'));
      onOfferCreated();
      
      // Reset form
      setFormData({
        origin_address: '',
        destination_address: '',
        departure_date: null,
        departure_time: '',
        seats_available: 1,
        price_per_person: 0,
        notes: '',
        phone_number: '',
        allow_phone_contact: false
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      console.error('Error details:', error);
      toast.error(`${t('error')}: ${error.message || 'Neznámá chyba'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Origin and Destination Section */}
      <div className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="origin" className="text-base font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {t('from')} *
          </Label>
          <Input
            id="origin"
            type="text"
            value={formData.origin_address}
            onChange={(e) => setFormData({ ...formData, origin_address: e.target.value })}
            placeholder={t('originPlaceholder')}
            required
            className="w-full h-12 text-base"
          />
        </div>

        <AddressQuickFill 
          onAddressSelect={(type, address) => {
            if (type === 'home') {
              setFormData({ ...formData, origin_address: address });
            }
          }}
          className="mb-4"
        />

        <div className="space-y-3">
          <Label htmlFor="destination" className="text-base font-medium flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            {t('to')} *
          </Label>
          <Input
            id="destination"
            type="text"
            value={formData.destination_address}
            onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
            placeholder={t('destinationPlaceholder')}
            required
            className="w-full h-12 text-base"
          />
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        <div className="space-y-3">
          <Label htmlFor="date" className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            {t('departureDate')} *
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.departure_date ? formData.departure_date.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, departure_date: e.target.value ? new Date(e.target.value) : null })}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full h-12 text-base"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="time" className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {t('departureTime')} *
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.departure_time}
            onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
            required
            className="w-full h-12 text-base"
          />
        </div>
      </div>

      {/* Seats and Price Section */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        <div className="space-y-3">
          <Label htmlFor="seats" className="text-base font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {t('seatsAvailable')} *
          </Label>
          <Input
            id="seats"
            type="number"
            min="1"
            max="8"
            value={formData.seats_available}
            onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) || 1 })}
            required
            className="w-full h-12 text-base"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="price" className="text-base font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            {t('pricePerPerson')} ({countryConfig.currencySymbol})
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price_per_person}
            onChange={(e) => setFormData({ ...formData, price_per_person: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            className="w-full h-12 text-base"
          />
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-3">
        <Label htmlFor="notes" className="text-base font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          {t('additionalNotes')}
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('notesPlaceholder')}
          className="w-full min-h-[100px] resize-vertical text-base p-4"
          rows={4}
        />
      </div>

      {/* Contact Options */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border">
          <input
            id="allow-phone"
            type="checkbox"
            checked={formData.allow_phone_contact}
            onChange={(e) => setFormData({ ...formData, allow_phone_contact: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <div className="space-y-1">
            <Label htmlFor="allow-phone" className="text-base font-medium cursor-pointer">
              {t('allowPhoneContact')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('allowPhoneContactDescription') || 'Povolte kontakt přes telefon pro rychlejší komunikaci'}
            </p>
          </div>
        </div>

        {formData.allow_phone_contact && (
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t('contactPhone')} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder={t('phoneOptional')}
              required={formData.allow_phone_contact}
              className="w-full h-12 text-base"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-background pt-4 border-t mt-8">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('creating')}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5" />
              {t('createOffer')}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateRideOfferForm;
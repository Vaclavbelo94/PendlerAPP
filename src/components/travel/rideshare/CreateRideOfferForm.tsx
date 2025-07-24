
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { MapPin, Clock, Users, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { rideshareService } from '@/services/rideshareService';
import { toast } from 'sonner';
import { getEnhancedCountryConfig } from '@/utils/enhancedCountryUtils';

interface CreateRideOfferFormProps {
  onOfferCreated: () => void;
}

const CreateRideOfferForm: React.FC<CreateRideOfferFormProps> = ({ onOfferCreated }) => {
  const { t, i18n } = useTranslation('travel');
  const { user } = useAuth();
  const countryConfig = getEnhancedCountryConfig(i18n.language);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin_address: '',
    destination_address: '',
    departure_date: null as Date | null,
    departure_time: '',
    seats_available: 1,
    price_per_person: 0,
    notes: '',
    phone_number: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('loginRequired'));
      return;
    }

    if (!formData.departure_date) {
      toast.error(t('selectDepartureDate'));
      return;
    }

    setLoading(true);
    try {
      await rideshareService.createOffer({
        user_id: user.id,
        origin_address: formData.origin_address,
        destination_address: formData.destination_address,
        departure_date: formData.departure_date.toISOString().split('T')[0],
        departure_time: formData.departure_time,
        seats_available: formData.seats_available,
        price_per_person: formData.price_per_person,
        currency: countryConfig.currency,
        notes: formData.notes,
        phone_number: formData.phone_number,
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
        phone_number: ''
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('from')}
          </Label>
          <Input
            id="origin"
            value={formData.origin_address}
            onChange={(e) => setFormData({ ...formData, origin_address: e.target.value })}
            placeholder={t('originPlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('to')}
          </Label>
          <Input
            id="destination"
            value={formData.destination_address}
            onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
            placeholder={t('destinationPlaceholder')}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{t('departureDate')}</Label>
          <DatePicker
            selected={formData.departure_date}
            onSelect={(date) => setFormData({ ...formData, departure_date: date || null })}
            placeholderText={t('selectDate')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('departureTime')}
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.departure_time}
            onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('seatsAvailable')}
          </Label>
          <Input
            id="seats"
            type="number"
            min="1"
            max="8"
            value={formData.seats_available}
            onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) || 1 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            {t('pricePerPerson')} ({countryConfig.currencySymbol})
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price_per_person}
            onChange={(e) => setFormData({ ...formData, price_per_person: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('contactPhone')}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            placeholder={t('phoneOptional')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('additionalNotes')}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('notesPlaceholder')}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('creating') : t('createOffer')}
      </Button>
    </form>
  );
};

export default CreateRideOfferForm;

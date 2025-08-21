import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Car, MapPin, Calendar as CalendarIcon, Clock, Users, Euro, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { rideshareService } from '@/services/rideshareService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RideCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  origin_address: string;
  destination_address: string;
  departure_date: Date | undefined;
  departure_time: string;
  seats_available: number;
  price_per_person: number;
  notes: string;
  phone_number: string;
  allow_phone_contact: boolean;
}

const RideCreationWizard: React.FC<RideCreationWizardProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    origin_address: '',
    destination_address: '',
    departure_date: undefined,
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

    if (!formData.departure_date) {
      toast.error(t('selectDepartureDate'));
      return;
    }

    try {
      setLoading(true);
      
      const offerData = {
        ...formData,
        departure_date: format(formData.departure_date, 'yyyy-MM-dd'),
        currency: 'EUR', // Always EUR
        user_id: user.id,
        is_recurring: false,
        recurring_days: []
      };

      await rideshareService.createRideshareOffer(offerData);
      
      toast.success(t('offerCreated'));
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        origin_address: '',
        destination_address: '',
        departure_date: undefined,
        departure_time: '',
        seats_available: 1,
        price_per_person: 0,
        notes: '',
        phone_number: '',
        allow_phone_contact: false
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Car className="h-6 w-6 text-primary" />
            {t('createRideOfferTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('createRideOfferDescription')}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          {/* Route Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{t('route')}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">{t('from')}</Label>
                <Input
                  id="origin"
                  placeholder={t('originPlaceholder')}
                  value={formData.origin_address}
                  onChange={(e) => setFormData({ ...formData, origin_address: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="destination">{t('to')}</Label>
                <Input
                  id="destination"
                  placeholder={t('destinationPlaceholder')}
                  value={formData.destination_address}
                  onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>{t('dateAndTime')}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('departureDate')}</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !formData.departure_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.departure_date ? (
                        format(formData.departure_date, "PPP")
                      ) : (
                        <span>{t('selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.departure_date}
                      onSelect={(date) => {
                        setFormData({ ...formData, departure_date: date });
                        setCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">{t('departureTime')}</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Capacity & Price Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-primary" />
              <span>{t('capacityAndPrice')}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seats">{t('seatsAvailable')}</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.seats_available}
                  onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) || 1 })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="price">{t('pricePerPerson')} (€)</Label>
                <div className="relative mt-2">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_person}
                    onChange={(e) => setFormData({ ...formData, price_per_person: parseFloat(e.target.value) || 0 })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Phone className="h-5 w-5 text-primary" />
              <span>{t('contact')}</span>
            </div>
            
            <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-lg">
              <Switch
                id="allow-phone"
                checked={formData.allow_phone_contact}
                onCheckedChange={(checked) => setFormData({ ...formData, allow_phone_contact: checked })}
              />
              <div className="flex-1">
                <Label htmlFor="allow-phone" className="font-medium">
                  {t('allowPhoneContact')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('allowPhoneContactDescription')}
                </p>
              </div>
            </div>
            
            <AnimatePresence>
              {formData.allow_phone_contact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="phone">{t('contactPhone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+420 123 456 789"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="mt-2"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes">{t('additionalNotes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('notesPlaceholder')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-2 min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {loading ? t('creating') : t('createOffer')}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default RideCreationWizard;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, User, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { rideshareService, RideshareOfferWithDriver } from '@/services/rideshareService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';

interface ContactSystemProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffer: RideshareOfferWithDriver | null;
}

const ContactSystem: React.FC<ContactSystemProps> = ({
  isOpen,
  onClose,
  selectedOffer
}) => {
  const { t, i18n } = useTranslation('travel');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOffer || !user) {
      toast.error(t('loginRequired'));
      return;
    }

    if (!formData.email || !formData.message) {
      toast.error('Email a zpráva jsou povinné');
      return;
    }

    try {
      setLoading(true);
      
      await rideshareService.contactDriver({
        rideshare_offer_id: selectedOffer.id,
        driver_user_id: selectedOffer.user_id,
        requester_user_id: user.id,
        requester_email: formData.email,
        requester_phone: formData.phone,
        message: formData.message
      });
      
      toast.success(t('contactRequestSent'));
      onClose();
      
      // Reset form
      setFormData({
        email: user?.email || '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error contacting driver:', error);
      toast.error(t('contactError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (selectedOffer?.driver.phone_number) {
      window.open(`tel:${selectedOffer.driver.phone_number}`);
    }
  };

  const getDriverInitials = (username: string) => {
    if (!username || username.trim() === '') return 'NU';
    return username.substring(0, 2).toUpperCase();
  };

  if (!selectedOffer) return null;

  const displayDriverName = selectedOffer.driver.username || t('unknownDriver');
  const formattedDate = formatDate(selectedOffer.departure_date, i18n.language);
  const formattedPrice = !selectedOffer.price_per_person || selectedOffer.price_per_person === 0 
    ? t('free') 
    : formatCurrencyWithSymbol(selectedOffer.price_per_person);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {t('contactDriver')}
          </DialogTitle>
          <DialogDescription>
            {t('contactDriverDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Driver Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/20 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {getDriverInitials(displayDriverName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{displayDriverName}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOffer.seats_available} {t('seats')} • {formattedPrice} {selectedOffer.price_per_person > 0 && t('perPerson')}
                </p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="font-medium">Z:</span>
                <span className="text-muted-foreground">{selectedOffer.origin_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="font-medium">Do:</span>
                <span className="text-muted-foreground">{selectedOffer.destination_address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{selectedOffer.departure_time}</span>
                </div>
              </div>
            </div>

            {/* Call Button */}
            {selectedOffer.driver.phone_number && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="w-full hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t('call')} {selectedOffer.driver.phone_number}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('yourEmail')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('enterEmail')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('phoneOptional')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+420 123 456 789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {t('message')}
              </Label>
              <Textarea
                id="message"
                placeholder={t('messageToDriver')}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="mt-2 min-h-[100px]"
              />
            </div>

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
                <MessageCircle className="h-4 w-4 mr-2" />
                {loading ? 'Odesílám...' : t('sendMessage')}
              </Button>
            </div>
          </motion.form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSystem;
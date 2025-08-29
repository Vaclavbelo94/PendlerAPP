import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RideshareOfferWithDriver, rideshareService } from '@/services/rideshareService';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, Euro, Users, MessageCircle, Send } from 'lucide-react';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ride: RideshareOfferWithDriver | null;
}

const SendMessageDialog: React.FC<SendMessageDialogProps> = ({
  open,
  onOpenChange,
  ride
}) => {
  const { t, i18n } = useTranslation('travel');
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!ride || !message.trim()) {
      toast({
        title: t('error'),
        description: t('messageRequired'),
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await rideshareService.contactDriver(
        ride.id,
        message.trim(),
        contactEmail.trim() || undefined,
        contactPhone.trim() || undefined
      );

      toast({
        title: t('contactRequestSent'),
        description: t('contactRequestSent'),
      });

      // Reset form and close dialog
      setMessage('');
      setContactEmail('');
      setContactPhone('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: t('error'),
        description: error.message || t('contactError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setMessage('');
      setContactEmail('');
      setContactPhone('');
      onOpenChange(false);
    }
  };

  if (!ride) return null;

  const formattedDate = formatDate(ride.departure_date, i18n.language);
  const formattedPrice = !ride.price_per_person || ride.price_per_person === 0 
    ? t('free') 
    : formatCurrencyWithSymbol(ride.price_per_person);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {t('contactDriver')}
          </DialogTitle>
          <DialogDescription>
            {t('contactDriverDescription')}
          </DialogDescription>
        </DialogHeader>

        {/* Ride Summary */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            {t('route')}
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-green-600 font-medium">{t('from')}</div>
                <div className="text-sm text-foreground break-words">{ride.origin_address}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-red-600 font-medium">{t('to')}</div>
                <div className="text-sm text-foreground break-words">{ride.destination_address}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-border/20">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium">{ride.departure_time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{ride.seats_available} {t('seats')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Euro className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{formattedPrice}</span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              {t('message')} *
            </Label>
            <Textarea
              id="message"
              placeholder={t('messageToDriver')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t('yourEmail')} ({t('phoneOptional')})
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enterEmail')}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                {t('phoneNumber')} ({t('phoneOptional')})
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('enterPhoneNumber')}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('sending')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('sendMessage')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageDialog;
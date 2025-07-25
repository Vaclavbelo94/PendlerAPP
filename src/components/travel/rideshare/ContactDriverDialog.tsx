
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, MapPin, Calendar, Clock, Users } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useAuth } from "@/hooks/auth";
import { rideshareService, RideshareOfferWithDriver } from "@/services/rideshareService";
import { useTranslation } from 'react-i18next';
import { formatPhoneNumber, getCountryConfig } from '@/utils/countryUtils';

interface ContactDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOffer: RideshareOfferWithDriver | null;
}

const ContactDriverDialog = ({ open, onOpenChange, selectedOffer }: ContactDriverDialogProps) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('travel');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState(() => getCountryConfig(i18n.language).prefix);

  const handleContactDriver = async () => {
    if (!user?.id || !selectedOffer?.id || !contactMessage.trim() || !phoneNumber.trim()) {
      if (!phoneNumber.trim()) {
        toast({
          title: t('error'),
          description: t('phoneRequired') || 'Telefonní číslo je povinné',
          variant: "destructive"
        });
        return;
      }
      return;
    }

    // Basic phone validation
    const phoneRegex = /^\d{7,15}$/;
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: t('error'),
        description: t('invalidPhone') || 'Neplatné telefonní číslo',
        variant: "destructive"
      });
      return;
    }

    try {
      await rideshareService.contactDriver(
        selectedOffer.id, 
        contactMessage.trim(),
        contactEmail,
        phoneNumber,
        countryCode
      );
      
      toast({
        title: t('success'),
        description: t('contactRequestSent') || 'Žádost o kontakt byla odeslána',
      });
      
      onOpenChange(false);
      setContactMessage('');
      setContactEmail('');
      setPhoneNumber('');
    } catch (error) {
      console.error('Error contacting driver:', error);
      toast({
        title: t('error'),
        description: t('contactError') || 'Chyba při kontaktování řidiče',
        variant: "destructive"
      });
    }
  };

  const handleCall = () => {
    if (selectedOffer?.driver?.phone_number) {
      const formattedPhone = formatPhoneNumber(selectedOffer.driver.phone_number, 'cs');
      window.location.href = `tel:${formattedPhone}`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return dateString;
    }
  };

  if (!selectedOffer) return null;

  const hasPhone = selectedOffer.driver?.phone_number && String(selectedOffer.driver.phone_number).length > 4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('contactDriver') || 'Kontaktovat řidiče'}
          </DialogTitle>
          <DialogDescription>
            {t('contactDriverDescription') || 'Napište zprávu řidiči'}
          </DialogDescription>
        </DialogHeader>

        {/* Trip Summary */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatDate(selectedOffer.departure_date)}</span>
            <Clock className="h-4 w-4 text-primary ml-2" />
            <span className="font-medium">{selectedOffer.departure_time}</span>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 text-green-500 mt-0.5" />
              <span className="text-muted-foreground">{selectedOffer.origin_address}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 text-red-500 mt-0.5" />
              <span className="text-muted-foreground">{selectedOffer.destination_address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{selectedOffer.seats_available} {t('seats') || 'míst'}</span>
            {selectedOffer.price_per_person > 0 && (
              <>
                <span>•</span>
                <span>{selectedOffer.price_per_person}€ {t('perPerson') || 'na osobu'}</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">{t('yourEmail') || 'Váš email'}</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder={t('enterEmail') || 'Zadejte váš email'}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-number">{t('phoneNumber')} *</Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+420">🇨🇿 +420</SelectItem>
                  <SelectItem value="+49">🇩🇪 +49</SelectItem>
                  <SelectItem value="+48">🇵🇱 +48</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('enterPhoneNumber')}
                className="flex-1"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('phoneNumberHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('message') || 'Zpráva'}</Label>
            <Textarea
              id="message"
              placeholder={t('messageToDriver') || 'Napište zprávu řidiči...'}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasPhone && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCall}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              {t('call') || 'Zavolat'}
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t('cancel') || 'Zrušit'}
          </Button>
          
          <Button
            onClick={handleContactDriver}
            disabled={!contactMessage.trim() || !phoneNumber.trim()}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {t('sendMessage') || 'Odeslat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDriverDialog;

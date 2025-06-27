
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";
import { rideshareService, RideshareOffer } from "@/services/rideshareService";
import { useLanguage } from "@/hooks/useLanguage";

interface ContactDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOffer: RideshareOffer | null;
}

const ContactDriverDialog = ({ open, onOpenChange, selectedOffer }: ContactDriverDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [contactMessage, setContactMessage] = useState('');

  const handleContactDriver = async () => {
    if (!user?.id || !selectedOffer?.id) return;

    try {
      await rideshareService.contactDriver(selectedOffer.id, contactMessage);
      
      toast.success(t('success'));
      onOpenChange(false);
      setContactMessage('');
    } catch (error) {
      console.error('Error contacting driver:', error);
      toast.error(t('error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('findRide')}</DialogTitle>
          <DialogDescription>
            {t('ridesharing')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder={t('enterText')}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleContactDriver} disabled={!contactMessage.trim()}>
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDriverDialog;

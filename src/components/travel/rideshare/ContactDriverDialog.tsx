
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { rideshareService, RideshareOffer } from "@/services/rideshareService";

interface ContactDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOffer: RideshareOffer | null;
}

const ContactDriverDialog = ({ open, onOpenChange, selectedOffer }: ContactDriverDialogProps) => {
  const { user } = useAuth();
  const [contactMessage, setContactMessage] = useState('');

  const handleContactDriver = async () => {
    if (!user?.id || !selectedOffer?.id) return;

    try {
      await rideshareService.createContact({
        offer_id: selectedOffer.id,
        requester_user_id: user.id,
        message: contactMessage
      });
      
      toast.success("Řidič byl kontaktován. Brzy vás bude kontaktovat.");
      onOpenChange(false);
      setContactMessage('');
    } catch (error) {
      console.error('Error contacting driver:', error);
      toast.error('Nepodařilo se kontaktovat řidiče');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kontaktovat řidiče</DialogTitle>
          <DialogDescription>
            Pošlete zprávu řidiči a vyjednejte podrobnosti spolujízdy
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder="Napište zprávu řidiči..."
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Zrušit
            </Button>
            <Button onClick={handleContactDriver} disabled={!contactMessage.trim()}>
              Odeslat zprávu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDriverDialog;

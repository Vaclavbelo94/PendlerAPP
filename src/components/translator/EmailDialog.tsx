
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (email: string) => Promise<void>;
  isLoading: boolean;
}

export const EmailDialog: React.FC<EmailDialogProps> = ({
  open,
  onOpenChange,
  onSendEmail,
  isLoading
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await onSendEmail(email.trim());
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Odeslat překlad emailem
          </DialogTitle>
          <DialogDescription>
            Zadejte emailovou adresu, na kterou chcete odeslat strukturované údaje o překladu.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Emailová adresa</Label>
            <Input
              id="email"
              type="email"
              placeholder="priklad@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Zrušit
            </Button>
            <Button
              type="submit"
              disabled={!email.trim() || isLoading}
            >
              {isLoading ? 'Odesílám...' : 'Odeslat email'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

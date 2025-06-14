
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VignetteRecord } from '@/types/vehicle';

interface VignetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vignette: Partial<VignetteRecord>) => Promise<VignetteRecord | undefined>;
  vignette?: VignetteRecord;
  vehicleId: string;
  isLoading?: boolean;
}

const VignetteDialog: React.FC<VignetteDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  vignette,
  vehicleId,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    country: '',
    vignette_type: '',
    valid_from: '',
    valid_until: '',
    cost: '',
    purchase_location: '',
    notes: ''
  });

  useEffect(() => {
    if (vignette) {
      setFormData({
        country: vignette.country,
        vignette_type: vignette.vignette_type,
        valid_from: vignette.valid_from,
        valid_until: vignette.valid_until,
        cost: vignette.cost,
        purchase_location: vignette.purchase_location || '',
        notes: vignette.notes || ''
      });
    } else {
      setFormData({
        country: '',
        vignette_type: '',
        valid_from: '',
        valid_until: '',
        cost: '',
        purchase_location: '',
        notes: ''
      });
    }
  }, [vignette, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vignetteData = {
      ...formData,
      vehicle_id: vehicleId,
      ...(vignette && { id: vignette.id })
    };

    const result = await onSave(vignetteData);
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vignette ? 'Upravit dálniční známku' : 'Přidat dálniční známku'}
          </DialogTitle>
          <DialogDescription>
            Vyplňte údaje o dálniční známce.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="country">Země *</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte zemi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rakousko">Rakousko</SelectItem>
                <SelectItem value="Slovensko">Slovensko</SelectItem>
                <SelectItem value="Maďarsko">Maďarsko</SelectItem>
                <SelectItem value="Slovinsko">Slovinsko</SelectItem>
                <SelectItem value="Švýcarsko">Švýcarsko</SelectItem>
                <SelectItem value="Bulharsko">Bulharsko</SelectItem>
                <SelectItem value="Rumunsko">Rumunsko</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vignette_type">Typ známky *</Label>
            <Select value={formData.vignette_type} onValueChange={(value) => setFormData(prev => ({ ...prev, vignette_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 dní">10 dní</SelectItem>
                <SelectItem value="2 měsíce">2 měsíce</SelectItem>
                <SelectItem value="Roční">Roční</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_from">Platnost od *</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="valid_until">Platnost do *</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cost">Cena *</Label>
            <Input
              id="cost"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="96.40"
              required
            />
          </div>

          <div>
            <Label htmlFor="purchase_location">Místo nákupu</Label>
            <Input
              id="purchase_location"
              value={formData.purchase_location}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_location: e.target.value }))}
              placeholder="Online, benzinová stanice..."
            />
          </div>

          <div>
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Volitelné poznámky..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Zrušit
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ukládání...' : vignette ? 'Upravit' : 'Přidat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VignetteDialog;

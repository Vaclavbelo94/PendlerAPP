
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InspectionRecord } from '@/types/vehicle';

interface InspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (inspection: Partial<InspectionRecord>) => Promise<InspectionRecord | undefined>;
  inspection?: InspectionRecord;
  vehicleId: string;
  isLoading?: boolean;
}

const InspectionDialog: React.FC<InspectionDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  inspection,
  vehicleId,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    inspection_date: '',
    next_inspection_date: '',
    result: '',
    station: '',
    cost: '',
    mileage: '',
    notes: ''
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        inspection_date: inspection.inspection_date,
        next_inspection_date: inspection.next_inspection_date,
        result: inspection.result,
        station: inspection.station,
        cost: inspection.cost,
        mileage: inspection.mileage,
        notes: inspection.notes || ''
      });
    } else {
      setFormData({
        inspection_date: '',
        next_inspection_date: '',
        result: '',
        station: '',
        cost: '',
        mileage: '',
        notes: ''
      });
    }
  }, [inspection, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const inspectionData = {
      ...formData,
      vehicle_id: vehicleId,
      ...(inspection && { id: inspection.id })
    };

    const result = await onSave(inspectionData);
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {inspection ? 'Upravit STK kontrolu' : 'Přidat STK kontrolu'}
          </DialogTitle>
          <DialogDescription>
            Vyplňte údaje o STK kontrole vozidla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inspection_date">Datum kontroly *</Label>
              <Input
                id="inspection_date"
                type="date"
                value={formData.inspection_date}
                onChange={(e) => setFormData(prev => ({ ...prev, inspection_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="next_inspection_date">Další kontrola *</Label>
              <Input
                id="next_inspection_date"
                type="date"
                value={formData.next_inspection_date}
                onChange={(e) => setFormData(prev => ({ ...prev, next_inspection_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="result">Výsledek *</Label>
            <Select value={formData.result} onValueChange={(value) => setFormData(prev => ({ ...prev, result: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte výsledek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prošel">Prošel</SelectItem>
                <SelectItem value="Neprošel">Neprošel</SelectItem>
                <SelectItem value="Podmíněně prošel">Podmíněně prošel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="station">Stanice STK *</Label>
            <Input
              id="station"
              value={formData.station}
              onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
              placeholder="Název stanice STK"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Cena (Kč) *</Label>
              <Input
                id="cost"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="800"
                required
              />
            </div>
            <div>
              <Label htmlFor="mileage">Stav km *</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder="50000"
                required
              />
            </div>
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
              {isLoading ? 'Ukládání...' : inspection ? 'Upravit' : 'Přidat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDialog;

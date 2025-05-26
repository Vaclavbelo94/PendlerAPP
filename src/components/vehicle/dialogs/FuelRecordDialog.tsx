
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FuelRecord } from '@/types/vehicle';
import { saveFuelRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

interface FuelRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

const FuelRecordDialog: React.FC<FuelRecordDialogProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useStandardizedToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount_liters: '',
    price_per_liter: '',
    total_cost: '',
    mileage: '',
    full_tank: true,
    station: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total cost if amount and price are provided
      if (field === 'amount_liters' || field === 'price_per_liter') {
        const amount = parseFloat(field === 'amount_liters' ? value : updated.amount_liters);
        const price = parseFloat(field === 'price_per_liter' ? value : updated.price_per_liter);
        
        if (!isNaN(amount) && !isNaN(price)) {
          updated.total_cost = (amount * price).toFixed(2);
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const record: Partial<FuelRecord> = {
        vehicle_id: vehicleId,
        date: formData.date,
        amount_liters: parseFloat(formData.amount_liters),
        price_per_liter: parseFloat(formData.price_per_liter),
        total_cost: parseFloat(formData.total_cost),
        mileage: formData.mileage,
        full_tank: formData.full_tank,
        station: formData.station
      };

      await saveFuelRecord(record);
      success('Záznam o tankování byl úspěšně přidán');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || 'Chyba při ukládání záznamu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Přidat tankování</DialogTitle>
          <DialogDescription>
            Zadejte údaje o novém tankování
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">Stav km *</Label>
              <Input
                id="mileage"
                type="text"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
                placeholder="145000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="station">Čerpací stanice *</Label>
            <Input
              id="station"
              type="text"
              value={formData.station}
              onChange={(e) => handleInputChange('station', e.target.value)}
              placeholder="Shell, OMV..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount_liters">Množství (L) *</Label>
              <Input
                id="amount_liters"
                type="number"
                step="0.01"
                value={formData.amount_liters}
                onChange={(e) => handleInputChange('amount_liters', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price_per_liter">Cena/L (Kč) *</Label>
              <Input
                id="price_per_liter"
                type="number"
                step="0.01"
                value={formData.price_per_liter}
                onChange={(e) => handleInputChange('price_per_liter', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="total_cost">Celkem (Kč) *</Label>
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                value={formData.total_cost}
                onChange={(e) => handleInputChange('total_cost', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="full_tank"
              checked={formData.full_tank}
              onCheckedChange={(checked) => handleInputChange('full_tank', checked)}
            />
            <Label htmlFor="full_tank">Plná nádrž</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ukládám...' : 'Přidat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FuelRecordDialog;

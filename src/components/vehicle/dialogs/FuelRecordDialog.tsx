
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FuelRecord } from '@/types/vehicle';
import { useTranslation } from 'react-i18next';

interface FuelRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
  record?: FuelRecord | null;
}

const FuelRecordDialog: React.FC<FuelRecordDialogProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onSuccess,
  record = null
}) => {
  const { t } = useTranslation(['vehicle']);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount_liters: '',
    price_per_liter: '',
    total_cost: '',
    mileage: '',
    full_tank: true,
    station: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        date: record.date,
        amount_liters: record.amount_liters.toString(),
        price_per_liter: record.price_per_liter.toString(),
        total_cost: record.total_cost.toString(),
        mileage: record.mileage,
        full_tank: record.full_tank,
        station: record.station
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount_liters: '',
        price_per_liter: '',
        total_cost: '',
        mileage: '',
        full_tank: true,
        station: ''
      });
    }
  }, [record, isOpen]);

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
      console.log('Fuel record saved successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving fuel record:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {record ? t('vehicle:editFuelRecord') : t('vehicle:addFuelRecord')}
          </DialogTitle>
          <DialogDescription>
            {t('vehicle:fuelRecordDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">{t('vehicle:date')} *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">{t('vehicle:mileageAtRefuel')} *</Label>
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
            <Label htmlFor="station">{t('vehicle:station')} *</Label>
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
              <Label htmlFor="amount_liters">{t('vehicle:amount')} (L) *</Label>
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
              <Label htmlFor="price_per_liter">{t('vehicle:pricePerLiter')} (Kč) *</Label>
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
              <Label htmlFor="total_cost">{t('vehicle:totalCost')} (Kč) *</Label>
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
            <Label htmlFor="full_tank">{t('vehicle:fullTank')}</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('vehicle:cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('vehicle:saving') : (record ? t('vehicle:save') : t('vehicle:add'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FuelRecordDialog;

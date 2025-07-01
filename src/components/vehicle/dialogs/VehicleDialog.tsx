
import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VehicleData } from '@/types/vehicle';
import { useTranslation } from 'react-i18next';
import { vehicleBrands, generateYears } from '@/data/vehicleBrands';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle: VehicleData | null;
  userId: string | undefined;
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
  userId
}) => {
  const { t } = useTranslation(['vehicle']);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    license_plate: '',
    fuel_type: 'petrol',
    mileage: '',
    average_consumption: ''
  });

  const years = generateYears();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        license_plate: vehicle.license_plate || '',
        fuel_type: vehicle.fuel_type || 'petrol',
        mileage: vehicle.mileage?.toString() || '',
        average_consumption: vehicle.average_consumption?.toString() || ''
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        year: '',
        license_plate: '',
        fuel_type: 'petrol',
        mileage: '',
        average_consumption: ''
      });
    }
  }, [vehicle, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsLoading(true);
    try {
      const vehicleData = {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        license_plate: formData.license_plate,
        fuel_type: formData.fuel_type,
        mileage: parseInt(formData.mileage) || 0,
        average_consumption: parseFloat(formData.average_consumption) || 0,
        user_id: userId
      };

      if (vehicle?.id) {
        // Update existing vehicle
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicle.id);

        if (error) throw error;
        toast.success(t('vehicle:vehicleUpdated'));
      } else {
        // Create new vehicle
        const { error } = await supabase
          .from('vehicles')
          .insert([vehicleData]);

        if (error) throw error;
        toast.success(t('vehicle:vehicleAdded'));
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error(t('vehicle:errorSavingVehicle'));
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBrand = vehicleBrands.find(brand => brand.id === formData.brand);
  const availableModels = selectedBrand?.models || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? t('vehicle:editVehicle') : t('vehicle:addVehicle')}
          </DialogTitle>
          <DialogDescription>
            {vehicle ? t('vehicle:editVehicleDescription') : t('vehicle:addVehicleDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">{t('vehicle:brand')}</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value, model: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('vehicle:selectBrand')} />
                </SelectTrigger>
                <SelectContent>
                  {vehicleBrands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">{t('vehicle:model')}</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                disabled={!formData.brand}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('vehicle:selectModel')} />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">{t('vehicle:year')}</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('vehicle:selectYear')} />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="license_plate">{t('vehicle:licensePlate')}</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => setFormData(prev => ({ ...prev, license_plate: e.target.value }))}
                placeholder="ABC-123"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuel_type">{t('vehicle:fuelType')}</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Benzín</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Elektro</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mileage">{t('vehicle:mileage')} (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder="150000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="average_consumption">{t('vehicle:averageConsumption')} ({t('vehicle:per100km')})</Label>
            <Input
              id="average_consumption"
              type="number"
              step="0.1"
              value={formData.average_consumption}
              onChange={(e) => setFormData(prev => ({ ...prev, average_consumption: e.target.value }))}
              placeholder="7.5"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('vehicle:cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('vehicle:saving') : t('vehicle:save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;

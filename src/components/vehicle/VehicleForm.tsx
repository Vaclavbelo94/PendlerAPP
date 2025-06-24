
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleData } from '@/types/vehicle';
import { useTranslation } from 'react-i18next';
import { BrandSelector, ModelSelector, YearSelector } from './VehicleFormField';
import { findBrandByName } from '@/data/vehicleUtils';

interface VehicleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  vehicle?: VehicleData;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  vehicle
}) => {
  const { t } = useTranslation(['vehicle']);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    license_plate: '',
    vin: '',
    fuel_type: '',
    engine: '',
    power: '',
    transmission: '',
    color: '',
    mileage: '',
    purchase_price: '',
    average_consumption: '',
    insurance_monthly: '',
    tax_yearly: '',
    last_service: '',
    next_inspection: '',
    last_repair_cost: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        license_plate: vehicle.license_plate || '',
        vin: vehicle.vin || '',
        fuel_type: vehicle.fuel_type || '',
        engine: vehicle.engine || '',
        power: vehicle.power || '',
        transmission: vehicle.transmission || '',
        color: vehicle.color || '',
        mileage: vehicle.mileage || '',
        purchase_price: vehicle.purchase_price || '',
        average_consumption: vehicle.average_consumption || '',
        insurance_monthly: vehicle.insurance_monthly || '',
        tax_yearly: vehicle.tax_yearly || '',
        last_service: vehicle.last_service || '',
        next_inspection: vehicle.next_inspection || '',
        last_repair_cost: vehicle.last_repair_cost || ''
      });

      // Najdeme brand ID pro existující vozidlo
      const existingBrand = findBrandByName(vehicle.brand || '');
      if (existingBrand) {
        setSelectedBrandId(existingBrand.id);
      }
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    // Vyčistíme model při změně značky
    if (brandId !== selectedBrandId) {
      handleChange('model', '');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('vehicle:basicInformation')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrandSelector
            value={formData.brand}
            onChange={(value) => handleChange('brand', value)}
            onBrandChange={handleBrandChange}
            required
          />
          
          <ModelSelector
            value={formData.model}
            onChange={(value) => handleChange('model', value)}
            brandId={selectedBrandId}
            required
          />
          
          <YearSelector
            value={formData.year}
            onChange={(value) => handleChange('year', value)}
            required
          />
          
          <div>
            <Label htmlFor="license_plate">{t('vehicle:licensePlate')} *</Label>
            <Input
              id="license_plate"
              type="text"
              value={formData.license_plate}
              onChange={(e) => handleChange('license_plate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vin">{t('vehicle:vin')}</Label>
            <Input
              id="vin"
              type="text"
              value={formData.vin}
              onChange={(e) => handleChange('vin', e.target.value)}
              placeholder={t('vehicle:vinPlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="color">{t('vehicle:color')}</Label>
            <Input
              id="color"
              type="text"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Technical Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('vehicle:technicalInformation')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fuel_type">{t('vehicle:fuelType')}</Label>
            <Select value={formData.fuel_type} onValueChange={(value) => handleChange('fuel_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicle:selectFuelType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">{t('vehicle:fuelTypes.petrol')}</SelectItem>
                <SelectItem value="diesel">{t('vehicle:fuelTypes.diesel')}</SelectItem>
                <SelectItem value="lpg">{t('vehicle:fuelTypes.lpg')}</SelectItem>
                <SelectItem value="cng">{t('vehicle:fuelTypes.cng')}</SelectItem>
                <SelectItem value="electric">{t('vehicle:fuelTypes.electric')}</SelectItem>
                <SelectItem value="hybrid">{t('vehicle:fuelTypes.hybrid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="engine">{t('vehicle:engineType')}</Label>
            <Input
              id="engine"
              type="text"
              value={formData.engine}
              onChange={(e) => handleChange('engine', e.target.value)}
              placeholder={t('vehicle:enginePlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="power">{t('vehicle:power')}</Label>
            <Input
              id="power"
              type="text"
              value={formData.power}
              onChange={(e) => handleChange('power', e.target.value)}
              placeholder={t('vehicle:powerPlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="transmission">{t('vehicle:transmission')}</Label>
            <Select value={formData.transmission} onValueChange={(value) => handleChange('transmission', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicle:selectTransmission')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">{t('vehicle:transmissionTypes.manual')}</SelectItem>
                <SelectItem value="automatic">{t('vehicle:transmissionTypes.automatic')}</SelectItem>
                <SelectItem value="cvt">{t('vehicle:transmissionTypes.cvt')}</SelectItem>
                <SelectItem value="dsg">{t('vehicle:transmissionTypes.dsg')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Operational Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('vehicle:operationalInformation')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mileage">{t('vehicle:mileage')}</Label>
            <Input
              id="mileage"
              type="text"
              value={formData.mileage}
              onChange={(e) => handleChange('mileage', e.target.value)}
              placeholder={t('vehicle:mileagePlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="average_consumption">{t('vehicle:averageConsumption')} (l/100km)</Label>
            <Input
              id="average_consumption"
              type="text"
              value={formData.average_consumption}
              onChange={(e) => handleChange('average_consumption', e.target.value)}
              placeholder={t('vehicle:consumptionPlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="last_service">{t('vehicle:lastService')}</Label>
            <Input
              id="last_service"
              type="date"
              value={formData.last_service}
              onChange={(e) => handleChange('last_service', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="next_inspection">{t('vehicle:nextServiceDue')}</Label>
            <Input
              id="next_inspection"
              type="date"
              value={formData.next_inspection}
              onChange={(e) => handleChange('next_inspection', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Financial Information - pouze při editaci */}
      {vehicle && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('vehicle:financialInformation')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_price">{t('vehicle:purchasePrice')} (Kč)</Label>
              <Input
                id="purchase_price"
                type="text"
                value={formData.purchase_price}
                onChange={(e) => handleChange('purchase_price', e.target.value)}
                placeholder={t('vehicle:pricePlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="insurance_monthly">{t('vehicle:insuranceCost')} {t('vehicle:monthlyAverage')} (Kč)</Label>
              <Input
                id="insurance_monthly"
                type="text"
                value={formData.insurance_monthly}
                onChange={(e) => handleChange('insurance_monthly', e.target.value)}
                placeholder={t('vehicle:insurancePlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="tax_yearly">{t('vehicle:taxPlaceholder')} (Kč)</Label>
              <Input
                id="tax_yearly"
                type="text"
                value={formData.tax_yearly}
                onChange={(e) => handleChange('tax_yearly', e.target.value)}
                placeholder={t('vehicle:taxPlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="last_repair_cost">{t('vehicle:lastService')} {t('vehicle:repair')} (Kč)</Label>
              <Input
                id="last_repair_cost"
                type="text"
                value={formData.last_repair_cost}
                onChange={(e) => handleChange('last_repair_cost', e.target.value)}
                placeholder={t('vehicle:repairPlaceholder')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? t('vehicle:saving') : (vehicle ? t('vehicle:addChanges') : t('vehicle:addVehicleButton'))}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          {t('vehicle:cancel')}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;

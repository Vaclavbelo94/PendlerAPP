
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleData } from '@/types/vehicle';

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
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Základní informace */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Základní informace</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Značka *</Label>
            <Input
              id="brand"
              type="text"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              type="text"
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="year">Rok výroby *</Label>
            <Input
              id="year"
              type="text"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="license_plate">SPZ *</Label>
            <Input
              id="license_plate"
              type="text"
              value={formData.license_plate}
              onChange={(e) => handleChange('license_plate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              type="text"
              value={formData.vin}
              onChange={(e) => handleChange('vin', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="color">Barva</Label>
            <Input
              id="color"
              type="text"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Technické údaje */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Technické údaje</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fuel_type">Typ paliva</Label>
            <Select value={formData.fuel_type} onValueChange={(value) => handleChange('fuel_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ paliva" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Benzín">Benzín</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="LPG">LPG</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="Elektro">Elektro</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="engine">Motor</Label>
            <Input
              id="engine"
              type="text"
              value={formData.engine}
              onChange={(e) => handleChange('engine', e.target.value)}
              placeholder="např. 1.6 TDI"
            />
          </div>
          
          <div>
            <Label htmlFor="power">Výkon</Label>
            <Input
              id="power"
              type="text"
              value={formData.power}
              onChange={(e) => handleChange('power', e.target.value)}
              placeholder="např. 85 kW"
            />
          </div>
          
          <div>
            <Label htmlFor="transmission">Převodovka</Label>
            <Select value={formData.transmission} onValueChange={(value) => handleChange('transmission', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte převodovku" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manuální">Manuální</SelectItem>
                <SelectItem value="Automatická">Automatická</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="DSG">DSG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Provozní údaje */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Provozní údaje</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mileage">Najeto km</Label>
            <Input
              id="mileage"
              type="text"
              value={formData.mileage}
              onChange={(e) => handleChange('mileage', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="average_consumption">Průměrná spotřeba (l/100km)</Label>
            <Input
              id="average_consumption"
              type="text"
              value={formData.average_consumption}
              onChange={(e) => handleChange('average_consumption', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="last_service">Poslední servis</Label>
            <Input
              id="last_service"
              type="date"
              value={formData.last_service}
              onChange={(e) => handleChange('last_service', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="next_inspection">Další STK</Label>
            <Input
              id="next_inspection"
              type="date"
              value={formData.next_inspection}
              onChange={(e) => handleChange('next_inspection', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Finanční údaje */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Finanční údaje</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchase_price">Pořizovací cena (Kč)</Label>
            <Input
              id="purchase_price"
              type="text"
              value={formData.purchase_price}
              onChange={(e) => handleChange('purchase_price', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="insurance_monthly">Pojištění měsíčně (Kč)</Label>
            <Input
              id="insurance_monthly"
              type="text"
              value={formData.insurance_monthly}
              onChange={(e) => handleChange('insurance_monthly', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="tax_yearly">Daň ročně (Kč)</Label>
            <Input
              id="tax_yearly"
              type="text"
              value={formData.tax_yearly}
              onChange={(e) => handleChange('tax_yearly', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="last_repair_cost">Poslední oprava (Kč)</Label>
            <Input
              id="last_repair_cost"
              type="text"
              value={formData.last_repair_cost}
              onChange={(e) => handleChange('last_repair_cost', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tlačítka */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Ukládání...' : (vehicle ? 'Uložit změny' : 'Přidat vozidlo')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Zrušit
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;

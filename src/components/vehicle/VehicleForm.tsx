import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VehicleForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false
}: VehicleFormProps) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    license_plate: '',
    vin: '',
    color: '',
    fuel_type: '',
    engine: '',
    power: '',
    transmission: '',
    mileage: '',
    average_consumption: '',
    purchase_price: '',
    insurance_monthly: '',
    tax_yearly: '',
    last_service: '',
    next_inspection: '',
    last_repair_cost: ''
  });

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelect = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Základní informace */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Základní informace</h3>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Značka *</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="např. Škoda, Volkswagen, ..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="např. Octavia, Golf, ..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Rok výroby *</Label>
            <Input
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="např. 2018"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="license_plate">SPZ *</Label>
            <Input
              id="license_plate"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              placeholder="např. 1A2 3456"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vin">VIN *</Label>
            <Input
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="identifikační číslo vozidla"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Barva *</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="např. černá, stříbrná, ..."
              required
            />
          </div>
        </div>
        
        {/* Technické informace */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Technické informace</h3>
          
          <div className="space-y-2">
            <Label htmlFor="fuel_type">Typ paliva *</Label>
            <Select 
              name="fuel_type" 
              value={formData.fuel_type} 
              onValueChange={(value) => handleSelect('fuel_type', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ paliva" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="benzin">Benzín</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="lpg">LPG</SelectItem>
                <SelectItem value="cng">CNG</SelectItem>
                <SelectItem value="elektro">Elektro</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="engine">Motor *</Label>
            <Input
              id="engine"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              placeholder="např. 1.5 TSI, 2.0 TDI, ..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="power">Výkon (kW) *</Label>
            <Input
              id="power"
              name="power"
              value={formData.power}
              onChange={handleChange}
              placeholder="např. 110"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transmission">Převodovka *</Label>
            <Select 
              name="transmission" 
              value={formData.transmission} 
              onValueChange={(value) => handleSelect('transmission', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ převodovky" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manuální</SelectItem>
                <SelectItem value="automatic">Automatická</SelectItem>
                <SelectItem value="dsg">DSG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Stav tachometru (km) *</Label>
            <Input
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="např. 95000"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="average_consumption">Průměrná spotřeba (l/100km) *</Label>
            <Input
              id="average_consumption"
              name="average_consumption"
              value={formData.average_consumption}
              onChange={handleChange}
              placeholder="např. 6.5"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Finanční informace */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Finanční informace</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Kupní cena (Kč) *</Label>
            <Input
              id="purchase_price"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="např. 250000"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insurance_monthly">Měsíční pojistné (Kč) *</Label>
            <Input
              id="insurance_monthly"
              name="insurance_monthly"
              value={formData.insurance_monthly}
              onChange={handleChange}
              placeholder="např. 1200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tax_yearly">Roční silniční daň (Kč) *</Label>
            <Input
              id="tax_yearly"
              name="tax_yearly"
              value={formData.tax_yearly}
              onChange={handleChange}
              placeholder="např. 2000"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Servisní informace */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Servisní informace</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="last_service">Poslední servis *</Label>
            <Input
              id="last_service"
              name="last_service"
              value={formData.last_service}
              onChange={handleChange}
              placeholder="např. 02/2023"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="next_inspection">Další technická kontrola *</Label>
            <Input
              id="next_inspection"
              name="next_inspection"
              value={formData.next_inspection}
              onChange={handleChange}
              placeholder="např. 05/2025"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_repair_cost">Náklady na poslední opravu (Kč) *</Label>
            <Input
              id="last_repair_cost"
              name="last_repair_cost"
              value={formData.last_repair_cost}
              onChange={handleChange}
              placeholder="např. 3500"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Zrušit
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-xs mr-2"></span>
              Ukládám...
            </>
          ) : initialValues ? "Uložit změny" : "Přidat vozidlo"}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { VehicleData } from '@/types/vehicle';

interface VehicleFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  vehicle?: VehicleData;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  vehicle 
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: vehicle || {
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
      purchase_price: '',
      average_consumption: '',
      insurance_monthly: '',
      tax_yearly: '',
      last_service: '',
      next_inspection: '',
      last_repair_cost: ''
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicle ? 'Upravit vozidlo' : 'Přidat vozidlo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Základní informace */}
          <div>
            <h3 className="text-lg font-medium mb-4">Základní informace</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Značka *</Label>
                <Input 
                  id="brand" 
                  {...register('brand', { required: 'Značka je povinná' })}
                  placeholder="Škoda, Volkswagen..."
                />
                {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input 
                  id="model" 
                  {...register('model', { required: 'Model je povinný' })}
                  placeholder="Octavia, Golf..."
                />
                {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
              </div>

              <div>
                <Label htmlFor="year">Rok výroby *</Label>
                <Input 
                  id="year" 
                  {...register('year', { required: 'Rok je povinný' })}
                  placeholder="2020"
                />
                {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
              </div>

              <div>
                <Label htmlFor="license_plate">SPZ *</Label>
                <Input 
                  id="license_plate" 
                  {...register('license_plate', { required: 'SPZ je povinná' })}
                  placeholder="1AB2345"
                />
                {errors.license_plate && <p className="text-sm text-red-500">{errors.license_plate.message}</p>}
              </div>

              <div>
                <Label htmlFor="vin">VIN *</Label>
                <Input 
                  id="vin" 
                  {...register('vin', { required: 'VIN je povinné' })}
                  placeholder="1HGBH41JXMN109186"
                />
                {errors.vin && <p className="text-sm text-red-500">{errors.vin.message}</p>}
              </div>

              <div>
                <Label htmlFor="color">Barva</Label>
                <Input 
                  id="color" 
                  {...register('color')}
                  placeholder="Černá, Bílá, Stříbrná..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Technické údaje */}
          <div>
            <h3 className="text-lg font-medium mb-4">Technické údaje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fuel_type">Palivo</Label>
                <Select onValueChange={(value) => setValue('fuel_type', value)}>
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

              <div>
                <Label htmlFor="engine">Motor</Label>
                <Input 
                  id="engine" 
                  {...register('engine')}
                  placeholder="1.6 TDI, 2.0 TSI..."
                />
              </div>

              <div>
                <Label htmlFor="power">Výkon (kW)</Label>
                <Input 
                  id="power" 
                  {...register('power')}
                  placeholder="110, 150..."
                />
              </div>

              <div>
                <Label htmlFor="transmission">Převodovka</Label>
                <Select onValueChange={(value) => setValue('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte převodovku" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manualni">Manuální</SelectItem>
                    <SelectItem value="automaticka">Automatická</SelectItem>
                    <SelectItem value="dsg">DSG</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mileage">Najeto km</Label>
                <Input 
                  id="mileage" 
                  {...register('mileage')}
                  placeholder="85000"
                />
              </div>

              <div>
                <Label htmlFor="average_consumption">Průměrná spotřeba (l/100km)</Label>
                <Input 
                  id="average_consumption" 
                  {...register('average_consumption')}
                  placeholder="6.5"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Finanční údaje */}
          <div>
            <h3 className="text-lg font-medium mb-4">Finanční údaje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchase_price">Nákupní cena (Kč)</Label>
                <Input 
                  id="purchase_price" 
                  {...register('purchase_price')}
                  placeholder="350000"
                />
              </div>

              <div>
                <Label htmlFor="insurance_monthly">Pojištění měsíčně (Kč)</Label>
                <Input 
                  id="insurance_monthly" 
                  {...register('insurance_monthly')}
                  placeholder="2500"
                />
              </div>

              <div>
                <Label htmlFor="tax_yearly">Daň ročně (Kč)</Label>
                <Input 
                  id="tax_yearly" 
                  {...register('tax_yearly')}
                  placeholder="1800"
                />
              </div>

              <div>
                <Label htmlFor="last_repair_cost">Poslední oprava (Kč)</Label>
                <Input 
                  id="last_repair_cost" 
                  {...register('last_repair_cost')}
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Servisní údaje */}
          <div>
            <h3 className="text-lg font-medium mb-4">Servisní údaje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="last_service">Poslední servis</Label>
                <Input 
                  id="last_service" 
                  type="date"
                  {...register('last_service')}
                />
              </div>

              <div>
                <Label htmlFor="next_inspection">Příští technická kontrola</Label>
                <Input 
                  id="next_inspection" 
                  type="date"
                  {...register('next_inspection')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Zrušit
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ukládám...' : (vehicle ? 'Uložit' : 'Přidat')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;

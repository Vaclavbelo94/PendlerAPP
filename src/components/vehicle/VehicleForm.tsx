
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: vehicle || {}
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicle ? 'Upravit vozidlo' : 'Přidat vozidlo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="year">Rok výroby *</Label>
              <Input 
                id="year" 
                {...register('year', { required: 'Rok je povinný' })}
                placeholder="2020"
              />
              {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="fuel_type">Palivo</Label>
              <Input 
                id="fuel_type" 
                {...register('fuel_type')}
                placeholder="Benzín, Diesel..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Najeto km</Label>
              <Input 
                id="mileage" 
                {...register('mileage')}
                placeholder="85000"
              />
            </div>
            
            <div>
              <Label htmlFor="engine">Motor</Label>
              <Input 
                id="engine" 
                {...register('engine')}
                placeholder="1.6 TDI"
              />
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

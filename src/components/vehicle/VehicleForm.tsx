
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleData } from '@/types/vehicle';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const fuelTypes = [
  { value: 'benzín', label: 'Benzín' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'lpg', label: 'LPG' },
  { value: 'cng', label: 'CNG' },
  { value: 'elektro', label: 'Elektro' },
  { value: 'hybrid', label: 'Hybrid' },
];

const vehicleSchema = z.object({
  brand: z.string().min(1, 'Zadejte značku vozidla'),
  model: z.string().min(1, 'Zadejte model vozidla'),
  year: z.string().regex(/^\d{4}$/, 'Zadejte platný rok (např. 2023)'),
  license_plate: z.string().min(1, 'Zadejte SPZ'),
  vin: z.string().min(1, 'Zadejte VIN'),
  fuel_type: z.string().min(1, 'Vyberte typ paliva'),
  color: z.string().min(1, 'Zadejte barvu vozidla'),
  mileage: z.string().min(1, 'Zadejte aktuální stav kilometrů'),
  engine: z.string().optional(),
  power: z.string().optional(),
  transmission: z.string().optional(),
  next_inspection: z.string().optional(),
  last_service: z.string().optional(),
  average_consumption: z.string().optional(),
  purchase_price: z.string().optional(),
  insurance_monthly: z.string().optional(),
  tax_yearly: z.string().optional(),
  last_repair_cost: z.string().optional(),
});

interface VehicleFormProps {
  initialData?: VehicleData;
  onSave: (data: VehicleData) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ initialData, onSave }) => {
  const isMobile = useIsMobile();
  const form = useForm<VehicleData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      brand: '',
      model: '',
      year: '',
      license_plate: '',
      vin: '',
      fuel_type: '',
      color: '',
      mileage: '',
      engine: '',
      power: '',
      transmission: '',
      next_inspection: '',
      last_service: '',
      average_consumption: '',
      purchase_price: '',
      insurance_monthly: '',
      tax_yearly: '',
      last_repair_cost: '',
    },
  });

  const handleSubmit = (data: VehicleData) => {
    onSave({
      ...data,
      id: initialData?.id,
    });
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Značka *</FormLabel>
                <FormControl>
                  <Input placeholder="Škoda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model *</FormLabel>
                <FormControl>
                  <Input placeholder="Octavia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rok výroby *</FormLabel>
                <FormControl>
                  <Input placeholder="2019" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="license_plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SPZ *</FormLabel>
                <FormControl>
                  <Input placeholder="5A2 3456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN *</FormLabel>
                <FormControl>
                  <Input placeholder="TMB3G7NE0K0123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ paliva *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte typ paliva" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barva *</FormLabel>
                <FormControl>
                  <Input placeholder="Modrá" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stav kilometrů *</FormLabel>
                <FormControl>
                  <Input placeholder="78500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">Technické údaje</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motor</FormLabel>
                  <FormControl>
                    <Input placeholder="2.0 TDI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Výkon</FormLabel>
                  <FormControl>
                    <Input placeholder="110 kW" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Převodovka</FormLabel>
                  <FormControl>
                    <Input placeholder="DSG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_inspection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Příští STK</FormLabel>
                  <FormControl>
                    <Input placeholder="06/2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poslední servis</FormLabel>
                  <FormControl>
                    <Input placeholder="02/2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="average_consumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Průměrná spotřeba</FormLabel>
                  <FormControl>
                    <Input placeholder="5.8 l/100km" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">Finanční údaje</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pořizovací cena</FormLabel>
                  <FormControl>
                    <Input placeholder="450 000 Kč" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurance_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Měsíční pojistné</FormLabel>
                  <FormControl>
                    <Input placeholder="1 250 Kč" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_yearly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roční silniční daň</FormLabel>
                  <FormControl>
                    <Input placeholder="3 600 Kč" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_repair_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poslední náklady na opravu</FormLabel>
                  <FormControl>
                    <Input placeholder="8 700 Kč" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">{initialData ? 'Uložit změny' : 'Přidat vozidlo'}</Button>
        </div>
      </form>
    </Form>
  );

  return isMobile ? (
    <ScrollArea className="h-[60vh] pr-4">{formContent}</ScrollArea>
  ) : (
    formContent
  );
};

export default VehicleForm;

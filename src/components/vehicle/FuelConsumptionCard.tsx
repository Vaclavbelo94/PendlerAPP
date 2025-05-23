
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FuelRecord } from '@/types/vehicle';
import { fetchFuelRecords, saveFuelRecord, deleteFuelRecord, calculateConsumption } from '@/services/vehicleService';
import { PlusCircle, TrashIcon, DropletIcon, CalendarIcon, LineChartIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart, 
  Bar
} from 'recharts';
import { format } from 'date-fns';

interface FuelConsumptionCardProps {
  vehicleId?: string;
  detailed?: boolean;
}

const fuelRecordSchema = z.object({
  vehicle_id: z.string(),
  date: z.string().min(1, 'Zadejte datum tankování'),
  amount_liters: z.number().min(0.1, 'Zadejte množství paliva'),
  price_per_liter: z.number().min(0.1, 'Zadejte cenu za litr'),
  total_cost: z.number().min(0.1, 'Zadejte celkovou cenu'),
  mileage: z.string().min(1, 'Zadejte stav kilometrů'),
  full_tank: z.boolean(),
  station: z.string().optional(),
});

const FuelConsumptionCard: React.FC<FuelConsumptionCardProps> = ({ vehicleId, detailed = false }) => {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);
  const [consumptionStats, setConsumptionStats] = useState<{
    averageConsumption: number;
    totalCost: number;
    totalDistance: number;
  }>({
    averageConsumption: 0,
    totalCost: 0,
    totalDistance: 0,
  });

  const form = useForm<FuelRecord>({
    resolver: zodResolver(fuelRecordSchema),
    defaultValues: {
      vehicle_id: vehicleId || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      amount_liters: 0,
      price_per_liter: 0,
      total_cost: 0,
      mileage: '',
      full_tank: true,
      station: '',
    },
  });

  useEffect(() => {
    if (vehicleId) {
      loadFuelRecords();
    }
  }, [vehicleId]);

  useEffect(() => {
    if (selectedRecord) {
      form.reset({
        ...selectedRecord,
        date: selectedRecord.date || format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      form.reset({
        vehicle_id: vehicleId || '',
        date: format(new Date(), 'yyyy-MM-dd'),
        amount_liters: 0,
        price_per_liter: 0,
        total_cost: 0,
        mileage: fuelRecords.length > 0 ? fuelRecords[0]?.mileage || '' : '',
        full_tank: true,
        station: '',
      });
    }
  }, [selectedRecord, form, vehicleId, fuelRecords]);

  const loadFuelRecords = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const records = await fetchFuelRecords(vehicleId);
      setFuelRecords(records);
      
      // Výpočet statistik spotřeby
      const stats = calculateConsumption(records);
      setConsumptionStats(stats);
    } catch (error) {
      console.error('Chyba při načítání záznamů o tankování:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: FuelRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: FuelRecord) => {
    try {
      const savedRecord = await saveFuelRecord({
        ...data,
        id: selectedRecord?.id,
      });
      
      if (savedRecord) {
        await loadFuelRecords(); // Znovu načíst záznamy a přepočítat statistiky
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Chyba při ukládání záznamu o tankování:', error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Opravdu chcete smazat tento záznam o tankování?')) {
      try {
        const success = await deleteFuelRecord(id);
        if (success) {
          await loadFuelRecords(); // Znovu načíst záznamy a přepočítat statistiky
        }
      } catch (error) {
        console.error('Chyba při mazání záznamu o tankování:', error);
      }
    }
  };

  // Výpočet celkové částky
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'amount_liters' || name === 'price_per_liter') {
        const amount = form.getValues('amount_liters');
        const price = form.getValues('price_per_liter');
        if (amount && price) {
          form.setValue('total_cost', parseFloat((amount * price).toFixed(2)));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const formatChartData = (records: FuelRecord[]) => {
    if (records.length < 2) return [];
    
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const chartData = [];
    
    for (let i = 1; i < sortedRecords.length; i++) {
      const currentMileage = parseFloat(sortedRecords[i].mileage);
      const prevMileage = parseFloat(sortedRecords[i-1].mileage);
      
      if (!isNaN(currentMileage) && !isNaN(prevMileage) && currentMileage > prevMileage) {
        const distance = currentMileage - prevMileage;
        const consumption = (sortedRecords[i-1].amount_liters / distance) * 100;
        
        chartData.push({
          date: format(new Date(sortedRecords[i].date), 'dd.MM.yyyy'),
          consumption: parseFloat(consumption.toFixed(2)),
          distance,
          mileage: currentMileage,
          pricePerLiter: sortedRecords[i].price_per_liter
        });
      }
    }
    
    return chartData;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Spotřeba paliva</CardTitle>
          <CardDescription>Sledování tankování a spotřeby</CardDescription>
        </div>
        <Button variant="outline" onClick={handleAddRecord}>
          <PlusCircle className="h-4 w-4 mr-2" /> Přidat tankování
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : fuelRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DropletIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Zatím zde nejsou žádné záznamy o tankování</p>
            <p className="text-sm mt-2">Klikněte na "Přidat tankování" pro přidání prvního záznamu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Souhrnné údaje */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Průměrná spotřeba</p>
                <p className="text-2xl font-semibold">{consumptionStats.averageConsumption.toFixed(1)} l/100 km</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Celkové náklady</p>
                <p className="text-2xl font-semibold">{consumptionStats.totalCost.toLocaleString()} Kč</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Celková vzdálenost</p>
                <p className="text-2xl font-semibold">{consumptionStats.totalDistance.toLocaleString()} km</p>
              </div>
            </div>

            {detailed && fuelRecords.length >= 2 && (
              <>
                {/* Graf spotřeby */}
                <div className="mt-8 border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5" /> Vývoj spotřeby
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={formatChartData(fuelRecords)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="consumption"
                          name="Spotřeba (l/100km)"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="pricePerLiter"
                          name="Cena za litr (Kč)"
                          stroke="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Graf najetých kilometrů */}
                <div className="mt-8 border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-4">Najeté kilometry mezi tankováními</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatChartData(fuelRecords)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="distance" name="Najeté km" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* Seznam tankování */}
            <div className={detailed ? "mt-8" : ""}>
              <h3 className="font-medium text-lg mb-4">{detailed ? "Historie tankování" : "Poslední tankování"}</h3>
              <div className="space-y-3">
                {(detailed ? fuelRecords : fuelRecords.slice(0, 3)).map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <DropletIcon className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">{record.amount_liters} litrů</h4>
                        <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded ml-2">
                          {record.full_tank ? 'Plná nádrž' : 'Částečné'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(record.date).toLocaleDateString('cs-CZ')}</span>
                        <span className="mx-1">•</span>
                        <span>{record.mileage} km</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Cena za litr: <span className="text-foreground">{record.price_per_liter} Kč</span>
                        </span>
                        <span className="text-muted-foreground">
                          Celkem: <span className="text-foreground font-medium">{record.total_cost} Kč</span>
                        </span>
                        {record.station && (
                          <span className="text-muted-foreground">
                            Čerpací stanice: <span className="text-foreground">{record.station}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mt-3 md:mt-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
                        Upravit
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteRecord(record.id!)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {!detailed && fuelRecords.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="link">Zobrazit všechny záznamy</Button>
                </div>
              )}
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRecord ? 'Upravit záznam o tankování' : 'Přidat záznam o tankování'}</DialogTitle>
              <DialogDescription>
                {selectedRecord 
                  ? 'Upravte informace o tankování' 
                  : 'Zadejte informace o novém tankování'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="amount_liters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Množství (litrů) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="45" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price_per_liter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cena za litr *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="37.90" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Celková cena *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="1705.50" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="station"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Čerpací stanice</FormLabel>
                        <FormControl>
                          <Input placeholder="MOL, Shell, OMV..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="full_tank"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Plná nádrž
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <input type="hidden" {...form.register("vehicle_id")} />
                
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => setIsDialogOpen(false)}>
                    Zrušit
                  </Button>
                  <Button type="submit">
                    {selectedRecord ? 'Uložit změny' : 'Přidat záznam'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FuelConsumptionCard;

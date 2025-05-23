
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ServiceRecord } from '@/types/vehicle';
import { fetchServiceRecords, saveServiceRecord, deleteServiceRecord } from '@/services/vehicleService';
import { PlusCircle, TrashIcon, WrenchIcon, CalendarIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { toast } from 'sonner';

interface ServiceRecordCardProps {
  vehicleId?: string;
}

const serviceRecordSchema = z.object({
  vehicle_id: z.string(),
  service_date: z.string(),
  service_type: z.string().min(1, 'Zadejte typ servisu'),
  description: z.string().min(1, 'Zadejte popis servisu'),
  mileage: z.string().min(1, 'Zadejte stav kilometrů'),
  cost: z.string().min(1, 'Zadejte cenu'),
  provider: z.string().min(1, 'Zadejte poskytovatele'),
});

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({ vehicleId }) => {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null);

  const form = useForm<ServiceRecord>({
    resolver: zodResolver(serviceRecordSchema),
    defaultValues: {
      vehicle_id: vehicleId || '',
      service_date: format(new Date(), 'yyyy-MM-dd'),
      service_type: '',
      description: '',
      mileage: '',
      cost: '',
      provider: '',
    },
  });

  useEffect(() => {
    if (vehicleId) {
      loadServiceRecords();
    }
  }, [vehicleId]);

  useEffect(() => {
    if (selectedRecord) {
      form.reset({
        ...selectedRecord,
        service_date: selectedRecord.service_date ? selectedRecord.service_date : format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      form.reset({
        vehicle_id: vehicleId || '',
        service_date: format(new Date(), 'yyyy-MM-dd'),
        service_type: '',
        description: '',
        mileage: '',
        cost: '',
        provider: '',
      });
    }
  }, [selectedRecord, form, vehicleId]);

  const loadServiceRecords = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const records = await fetchServiceRecords(vehicleId);
      setServiceRecords(records);
    } catch (error) {
      console.error('Chyba při načítání servisních záznamů:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: ServiceRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: ServiceRecord) => {
    try {
      const savedRecord = await saveServiceRecord({
        ...data,
        id: selectedRecord?.id,
      });
      
      if (savedRecord) {
        if (selectedRecord) {
          setServiceRecords(prev => prev.map(r => r.id === savedRecord.id ? savedRecord : r));
        } else {
          setServiceRecords(prev => [savedRecord, ...prev]);
        }
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Chyba při ukládání servisního záznamu:', error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Opravdu chcete smazat tento servisní záznam?')) {
      try {
        const success = await deleteServiceRecord(id);
        if (success) {
          setServiceRecords(prev => prev.filter(r => r.id !== id));
        }
      } catch (error) {
        console.error('Chyba při mazání servisního záznamu:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Historie servisu a údržby</CardTitle>
          <CardDescription>Záznamy o servisech, opravách a údržbě vozidla</CardDescription>
        </div>
        <Button onClick={handleAddRecord}>
          <PlusCircle className="h-4 w-4 mr-2" /> Přidat záznam
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : serviceRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <WrenchIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Zatím zde nejsou žádné servisní záznamy</p>
            <p className="text-sm mt-2">Klikněte na "Přidat záznam" pro vytvoření prvního záznamu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {serviceRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <WrenchIcon className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">{record.service_type}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{record.service_date ? new Date(record.service_date).toLocaleDateString('cs-CZ') : 'Datum není uvedeno'}</span>
                    <span className="mx-1">•</span>
                    <span>{record.mileage} km</span>
                  </div>
                  <p className="mb-2">{record.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground">Poskytovatel: <span className="text-foreground">{record.provider}</span></span>
                    <span className="text-muted-foreground">Cena: <span className="text-foreground font-medium">{record.cost} Kč</span></span>
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
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRecord ? 'Upravit servisní záznam' : 'Přidat servisní záznam'}</DialogTitle>
              <DialogDescription>
                {selectedRecord 
                  ? 'Upravte informace o servisním záznamu' 
                  : 'Zadejte informace o novém servisním záznamu'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ servisu *</FormLabel>
                        <FormControl>
                          <Input placeholder="Výměna oleje, STK, ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service_date"
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
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Popis *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Podrobný popis servisních úkonů..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cena *</FormLabel>
                        <FormControl>
                          <Input placeholder="2500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poskytovatel *</FormLabel>
                      <FormControl>
                        <Input placeholder="Autoservis Novák" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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

export default ServiceRecordCard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InsuranceRecord } from '@/types/vehicle';
import { fetchInsurance, saveInsurance, deleteInsurance } from '@/services/vehicleService';
import { PlusCircle, EditIcon, TrashIcon, ShieldCheckIcon, CalendarIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { differenceInDays, parseISO } from 'date-fns';

interface InsuranceCardProps {
  vehicleId?: string;
}

const insuranceSchema = z.object({
  vehicle_id: z.string(),
  provider: z.string().min(1, 'Zadejte poskytovatele pojištění'),
  policy_number: z.string().min(1, 'Zadejte číslo pojistky'),
  valid_from: z.string().min(1, 'Zadejte datum počátku platnosti'),
  valid_until: z.string().min(1, 'Zadejte datum konce platnosti'),
  monthly_cost: z.string().min(1, 'Zadejte měsíční náklady'),
  coverage_type: z.string().min(1, 'Vyberte typ pojištění'),
  notes: z.string().optional(),
});

const coverageTypes = [
  { value: 'povinne', label: 'Povinné ručení' },
  { value: 'havarijni', label: 'Havarijní pojištění' },
  { value: 'kombinovane', label: 'Kombinované pojištění' },
  { value: 'rozsirene', label: 'Rozšířené pojištění' },
];

const InsuranceCard: React.FC<InsuranceCardProps> = ({ vehicleId }) => {
  const [insuranceRecords, setInsuranceRecords] = useState<InsuranceRecord[]>([]);
  const [activeInsurance, setActiveInsurance] = useState<InsuranceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceRecord | null>(null);

  const form = useForm<InsuranceRecord>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      vehicle_id: vehicleId || '',
      provider: '',
      policy_number: '',
      valid_from: format(new Date(), 'yyyy-MM-dd'),
      valid_until: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
      monthly_cost: '',
      coverage_type: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (vehicleId) {
      loadInsuranceData();
    }
  }, [vehicleId]);

  useEffect(() => {
    if (selectedInsurance) {
      form.reset({
        ...selectedInsurance,
        valid_from: selectedInsurance.valid_from || format(new Date(), 'yyyy-MM-dd'),
        valid_until: selectedInsurance.valid_until || format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
        notes: selectedInsurance.notes || '',
      });
    } else {
      form.reset({
        vehicle_id: vehicleId || '',
        provider: '',
        policy_number: '',
        valid_from: format(new Date(), 'yyyy-MM-dd'),
        valid_until: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
        monthly_cost: '',
        coverage_type: '',
        notes: '',
      });
    }
  }, [selectedInsurance, form, vehicleId]);

  const loadInsuranceData = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const records = await fetchInsurance(vehicleId);
      setInsuranceRecords(records);
      
      // Najít aktivní pojištění (to, které je platné nyní)
      const now = new Date();
      const active = records.find(r => 
        new Date(r.valid_from) <= now && 
        new Date(r.valid_until) >= now
      );
      
      setActiveInsurance(active || (records.length > 0 ? records[0] : null));
    } catch (error) {
      console.error('Chyba při načítání pojištění:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInsurance = () => {
    setSelectedInsurance(null);
    setIsDialogOpen(true);
  };

  const handleEditInsurance = (insurance: InsuranceRecord) => {
    setSelectedInsurance(insurance);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: InsuranceRecord) => {
    try {
      const savedInsurance = await saveInsurance({
        ...data,
        id: selectedInsurance?.id,
      });
      
      if (savedInsurance) {
        await loadInsuranceData(); // Znovu načíst vše
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Chyba při ukládání pojištění:', error);
    }
  };

  const handleDeleteInsurance = async (id: string) => {
    if (confirm('Opravdu chcete smazat toto pojištění?')) {
      try {
        const success = await deleteInsurance(id);
        if (success) {
          await loadInsuranceData(); // Znovu načíst vše
        }
      } catch (error) {
        console.error('Chyba při mazání pojištění:', error);
      }
    }
  };

  const getCoverageTypeLabel = (type: string) => {
    const coverageType = coverageTypes.find(t => t.value === type);
    return coverageType ? coverageType.label : type;
  };

  const getDaysUntilExpiry = (validUntil: string) => {
    const today = new Date();
    const expiryDate = parseISO(validUntil);
    return differenceInDays(expiryDate, today);
  };

  const getExpiryStatus = (validUntil: string) => {
    const daysLeft = getDaysUntilExpiry(validUntil);
    
    if (daysLeft < 0) {
      return { status: 'expired', text: 'Vypršelo', color: 'text-destructive' };
    } else if (daysLeft <= 30) {
      return { status: 'expiring-soon', text: `Vyprší za ${daysLeft} dnů`, color: 'text-amber-500' };
    } else {
      return { status: 'valid', text: `Platné (${daysLeft} dnů)`, color: 'text-green-600' };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Pojištění</CardTitle>
          <CardDescription>Informace o pojištění vozidla</CardDescription>
        </div>
        <Button variant="outline" onClick={handleAddInsurance}>
          <PlusCircle className="h-4 w-4 mr-2" /> Přidat pojištění
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : activeInsurance ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-lg">{activeInsurance.provider}</h3>
                  <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded ml-2">
                    {getCoverageTypeLabel(activeInsurance.coverage_type)}
                  </span>
                </div>
                <div className={getExpiryStatus(activeInsurance.valid_until).color + " text-sm font-medium"}>
                  {getExpiryStatus(activeInsurance.valid_until).text}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Číslo pojistky</p>
                  <p className="font-medium">{activeInsurance.policy_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Měsíční náklady</p>
                  <p className="font-medium">{activeInsurance.monthly_cost} Kč</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platnost od-do</p>
                  <p className="font-medium">
                    {new Date(activeInsurance.valid_from).toLocaleDateString('cs-CZ')} - {new Date(activeInsurance.valid_until).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              </div>

              {activeInsurance.notes && (
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">Poznámky:</p>
                  <p>{activeInsurance.notes}</p>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={() => handleEditInsurance(activeInsurance)}>
                  <EditIcon className="h-4 w-4 mr-1" /> Upravit
                </Button>
              </div>
            </div>

            {insuranceRecords.length > 1 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Historie pojištění</h4>
                <div className="space-y-3">
                  {insuranceRecords
                    .filter(record => record.id !== activeInsurance.id)
                    .map((record) => (
                      <div key={record.id} className="p-3 border rounded flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{record.provider}</span>
                            <span className="text-xs">{getCoverageTypeLabel(record.coverage_type)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(record.valid_from).toLocaleDateString('cs-CZ')} - {new Date(record.valid_until).toLocaleDateString('cs-CZ')}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button variant="ghost" size="sm" onClick={() => handleEditInsurance(record)}>
                            Upravit
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteInsurance(record.id!)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ShieldCheckIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Zatím zde nejsou žádné záznamy o pojištění</p>
            <p className="text-sm mt-2">Klikněte na "Přidat pojištění" pro přidání pojištění vozidla</p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedInsurance ? 'Upravit pojištění' : 'Přidat pojištění'}</DialogTitle>
              <DialogDescription>
                {selectedInsurance 
                  ? 'Upravte informace o pojištění' 
                  : 'Zadejte informace o novém pojištění'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poskytovatel *</FormLabel>
                        <FormControl>
                          <Input placeholder="Kooperativa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="policy_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Číslo pojistky *</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valid_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platnost od *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="valid_until"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platnost do *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monthly_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Měsíční náklad *</FormLabel>
                        <FormControl>
                          <Input placeholder="1250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="coverage_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ pojištění *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte typ pojištění" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {coverageTypes.map((type) => (
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
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poznámky</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Další informace o pojištění..." {...field} />
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
                    {selectedInsurance ? 'Uložit změny' : 'Přidat pojištění'}
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

export default InsuranceCard;

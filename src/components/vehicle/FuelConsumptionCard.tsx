
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Fuel, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFuelRecords, saveFuelRecord, deleteFuelRecord } from '@/services/vehicleService';
import { FuelRecord } from '@/types/vehicle';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FuelConsumptionCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const FuelConsumptionCard: React.FC<FuelConsumptionCardProps> = ({ vehicleId, fullView = false }) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<FuelRecord | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    amount_liters: '',
    price_per_liter: '',
    total_cost: '',
    mileage: '',
    full_tank: true,
    station: ''
  });

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  const { data: fuelRecords = [], isLoading } = useQuery({
    queryKey: ['fuel-records', vehicleId],
    queryFn: () => fetchFuelRecords(vehicleId),
    enabled: !!vehicleId
  });

  const addMutation = useMutation({
    mutationFn: (data: Partial<FuelRecord>) => saveFuelRecord({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-records', vehicleId] });
      success('Záznam o tankování byl přidán');
      setIsAddSheetOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání záznamu');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<FuelRecord>) => saveFuelRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-records', vehicleId] });
      success('Záznam o tankování byl aktualizován');
      setIsEditSheetOpen(false);
      setEditingRecord(null);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci záznamu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFuelRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-records', vehicleId] });
      success('Záznam o tankování byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání záznamu');
    }
  });

  const resetForm = () => {
    setFormData({
      date: '',
      amount_liters: '',
      price_per_liter: '',
      total_cost: '',
      mileage: '',
      full_tank: true,
      station: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      amount_liters: parseFloat(formData.amount_liters),
      price_per_liter: parseFloat(formData.price_per_liter),
      total_cost: parseFloat(formData.total_cost)
    };

    if (editingRecord) {
      updateMutation.mutate({ ...data, id: editingRecord.id });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (record: FuelRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      amount_liters: record.amount_liters.toString(),
      price_per_liter: record.price_per_liter.toString(),
      total_cost: record.total_cost.toString(),
      mileage: record.mileage,
      full_tank: record.full_tank,
      station: record.station
    });
    setIsEditSheetOpen(true);
  };

  const handleDelete = (record: FuelRecord) => {
    setDeletingRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingRecord?.id) {
      deleteMutation.mutate(deletingRecord.id);
    }
  };

  const totalCost = fuelRecords.reduce((sum, record) => sum + record.total_cost, 0);
  const averageConsumption = fuelRecords.length > 0 
    ? fuelRecords.reduce((sum, record) => sum + record.amount_liters, 0) / fuelRecords.length 
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Spotřeba paliva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Načítání...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={fullView ? "h-full" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Spotřeba paliva
            </CardTitle>
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Přidat
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Přidat tankování</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="date">Datum</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Množství (l)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount_liters}
                      onChange={(e) => setFormData({...formData, amount_liters: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Cena za litr (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      value={formData.price_per_liter}
                      onChange={(e) => setFormData({...formData, price_per_liter: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total">Celková cena (€)</Label>
                    <Input
                      id="total"
                      type="number"
                      step="0.01"
                      value={formData.total_cost}
                      onChange={(e) => setFormData({...formData, total_cost: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Stav tachometru (km)</Label>
                    <Input
                      id="mileage"
                      type="text"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="station">Čerpací stanice</Label>
                    <Input
                      id="station"
                      type="text"
                      value={formData.station}
                      onChange={(e) => setFormData({...formData, station: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addMutation.isPending}>
                      {addMutation.isPending ? 'Ukládání...' : 'Uložit'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddSheetOpen(false)}>
                      Zrušit
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          {fuelRecords.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné záznamy o tankování</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Celkové náklady</p>
                  <p className="text-2xl font-bold">{totalCost.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Průměrná spotřeba</p>
                  <p className="text-2xl font-bold">{averageConsumption.toFixed(1)} l</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {(fullView ? fuelRecords : fuelRecords.slice(0, 3)).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{record.station}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('cs-CZ')} • {record.amount_liters}l • {record.total_cost.toFixed(2)}€
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(record)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Upravit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(record)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Smazat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
              
              {!fullView && fuelRecords.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  A {fuelRecords.length - 3} dalších záznamů...
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Upravit tankování</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-date">Datum</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-amount">Množství (l)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount_liters}
                onChange={(e) => setFormData({...formData, amount_liters: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Cena za litr (€)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.001"
                value={formData.price_per_liter}
                onChange={(e) => setFormData({...formData, price_per_liter: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-total">Celková cena (€)</Label>
              <Input
                id="edit-total"
                type="number"
                step="0.01"
                value={formData.total_cost}
                onChange={(e) => setFormData({...formData, total_cost: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-mileage">Stav tachometru (km)</Label>
              <Input
                id="edit-mileage"
                type="text"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-station">Čerpací stanice</Label>
              <Input
                id="edit-station"
                type="text"
                value={formData.station}
                onChange={(e) => setFormData({...formData, station: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Ukládání...' : 'Uložit'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditSheetOpen(false);
                  setEditingRecord(null);
                  resetForm();
                }}
              >
                Zrušit
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat záznam o tankování</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento záznam o tankování? Tato akce je nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setDeletingRecord(null);
            }}>
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Mazání...' : 'Smazat'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FuelConsumptionCard;

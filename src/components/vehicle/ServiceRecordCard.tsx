import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Wrench, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServiceRecords, saveServiceRecord, deleteServiceRecord } from '@/services/vehicleService';
import { ServiceRecord } from '@/types/vehicle';
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

interface ServiceRecordCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({ vehicleId, fullView = false }) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<ServiceRecord | null>(null);
  const [formData, setFormData] = useState({
    service_date: '',
    service_type: '',
    description: '',
    mileage: '',
    cost: '',
    provider: ''
  });

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  const { data: serviceRecords = [], isLoading } = useQuery({
    queryKey: ['service-records', vehicleId],
    queryFn: () => fetchServiceRecords(vehicleId),
    enabled: !!vehicleId
  });

  const addMutation = useMutation({
    mutationFn: (data: Partial<ServiceRecord>) => saveServiceRecord({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-records', vehicleId] });
      success('Servisní záznam byl přidán');
      setIsAddSheetOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání záznamu');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ServiceRecord>) => saveServiceRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-records', vehicleId] });
      success('Servisní záznam byl aktualizován');
      setIsEditSheetOpen(false);
      setEditingRecord(null);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci záznamu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteServiceRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-records', vehicleId] });
      success('Servisní záznam byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání záznamu');
    }
  });

  const resetForm = () => {
    setFormData({
      service_date: '',
      service_type: '',
      description: '',
      mileage: '',
      cost: '',
      provider: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRecord) {
      updateMutation.mutate({ ...formData, id: editingRecord.id });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (record: ServiceRecord) => {
    setEditingRecord(record);
    setFormData({
      service_date: record.service_date,
      service_type: record.service_type,
      description: record.description,
      mileage: record.mileage,
      cost: record.cost,
      provider: record.provider
    });
    setIsEditSheetOpen(true);
  };

  const handleDelete = (record: ServiceRecord) => {
    setDeletingRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingRecord?.id) {
      deleteMutation.mutate(deletingRecord.id);
    }
  };

  const totalCost = serviceRecords.reduce((sum, record) => sum + parseFloat(record.cost), 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Servisní záznamy
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
              <Wrench className="h-5 w-5" />
              Servisní záznamy
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
                  <SheetTitle>Přidat servisní záznam</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="service-date">Datum servisu</Label>
                    <Input
                      id="service-date"
                      type="date"
                      value={formData.service_date}
                      onChange={(e) => setFormData({...formData, service_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-type">Typ servisu</Label>
                    <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ servisu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pravidelná údržba">Pravidelná údržba</SelectItem>
                        <SelectItem value="Oprava">Oprava</SelectItem>
                        <SelectItem value="Výměna olejů">Výměna olejů</SelectItem>
                        <SelectItem value="Výměna pneumatik">Výměna pneumatik</SelectItem>
                        <SelectItem value="Techničtá kontrola">Technická kontrola</SelectItem>
                        <SelectItem value="Ostatní">Ostatní</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Popis</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    <Label htmlFor="cost">Náklady (€)</Label>
                    <Input
                      id="cost"
                      type="text"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="provider">Poskytovatel</Label>
                    <Input
                      id="provider"
                      type="text"
                      value={formData.provider}
                      onChange={(e) => setFormData({...formData, provider: e.target.value})}
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
          {serviceRecords.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné servisní záznamy</p>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Celkové náklady na servis</p>
                <p className="text-2xl font-bold">{totalCost.toFixed(2)} €</p>
              </div>
              
              <div className="space-y-2">
                {(fullView ? serviceRecords : serviceRecords.slice(0, 3)).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{record.service_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.service_date).toLocaleDateString('cs-CZ')} • {record.provider} • {parseFloat(record.cost).toFixed(2)}€
                      </p>
                      <p className="text-sm text-muted-foreground">{record.description}</p>
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
              
              {!fullView && serviceRecords.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  A {serviceRecords.length - 3} dalších záznamů...
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
            <SheetTitle>Upravit servisní záznam</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-service-date">Datum servisu</Label>
              <Input
                id="edit-service-date"
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({...formData, service_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-service-type">Typ servisu</Label>
              <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ servisu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pravidelná údržba">Pravidelná údržba</SelectItem>
                  <SelectItem value="Oprava">Oprava</SelectItem>
                  <SelectItem value="Výměna olejů">Výměna olejů</SelectItem>
                  <SelectItem value="Výměna pneumatik">Výměna pneumatik</SelectItem>
                  <SelectItem value="Techničtá kontrola">Technická kontrola</SelectItem>
                  <SelectItem value="Ostatní">Ostatní</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description">Popis</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              <Label htmlFor="edit-cost">Náklady (€)</Label>
              <Input
                id="edit-cost"
                type="text"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-provider">Poskytovatel</Label>
              <Input
                id="edit-provider"
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
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
            <AlertDialogTitle>Smazat servisní záznam</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento servisní záznam? Tato akce je nevratná.
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

export default ServiceRecordCard;

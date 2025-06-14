
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, ClipboardCheck, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInspectionRecords, saveInspectionRecord, deleteInspectionRecord } from '@/services/vehicleService';
import { InspectionRecord } from '@/types/vehicle';
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

interface InspectionCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ vehicleId, fullView = false }) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InspectionRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<InspectionRecord | null>(null);
  const [formData, setFormData] = useState({
    inspection_date: '',
    next_inspection_date: '',
    result: '',
    station: '',
    cost: '',
    mileage: '',
    notes: ''
  });

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  const { data: inspections = [], isLoading } = useQuery({
    queryKey: ['inspection-records', vehicleId],
    queryFn: () => fetchInspectionRecords(vehicleId),
    enabled: !!vehicleId
  });

  const addMutation = useMutation({
    mutationFn: (data: Partial<InspectionRecord>) => saveInspectionRecord({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-records', vehicleId] });
      success('STK záznam byl přidán');
      setIsAddSheetOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání STK záznamu');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InspectionRecord>) => saveInspectionRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-records', vehicleId] });
      success('STK záznam byl aktualizován');
      setIsEditSheetOpen(false);
      setEditingRecord(null);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci STK záznamu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInspectionRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-records', vehicleId] });
      success('STK záznam byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání STK záznamu');
    }
  });

  const resetForm = () => {
    setFormData({
      inspection_date: '',
      next_inspection_date: '',
      result: '',
      station: '',
      cost: '',
      mileage: '',
      notes: ''
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

  const handleEdit = (record: InspectionRecord) => {
    setEditingRecord(record);
    setFormData({
      inspection_date: record.inspection_date,
      next_inspection_date: record.next_inspection_date,
      result: record.result,
      station: record.station,
      cost: record.cost,
      mileage: record.mileage,
      notes: record.notes || ''
    });
    setIsEditSheetOpen(true);
  };

  const handleDelete = (record: InspectionRecord) => {
    setDeletingRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingRecord?.id) {
      deleteMutation.mutate(deletingRecord.id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            STK
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
              <ClipboardCheck className="h-5 w-5" />
              STK
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
                  <SheetTitle>Přidat STK záznam</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="inspection-date">Datum STK</Label>
                    <Input
                      id="inspection-date"
                      type="date"
                      value={formData.inspection_date}
                      onChange={(e) => setFormData({...formData, inspection_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="next-inspection-date">Další STK</Label>
                    <Input
                      id="next-inspection-date"
                      type="date"
                      value={formData.next_inspection_date}
                      onChange={(e) => setFormData({...formData, next_inspection_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="result">Výsledek</Label>
                    <Select value={formData.result} onValueChange={(value) => setFormData({...formData, result: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte výsledek" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Schváleno">Schváleno</SelectItem>
                        <SelectItem value="Schváleno s vadami">Schváleno s vadami</SelectItem>
                        <SelectItem value="Neschváleno">Neschváleno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="station">Stanice STK</Label>
                    <Input
                      id="station"
                      type="text"
                      value={formData.station}
                      onChange={(e) => setFormData({...formData, station: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Cena (Kč)</Label>
                    <Input
                      id="cost"
                      type="text"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
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
                    <Label htmlFor="notes">Poznámky</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
          {inspections.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné STK záznamy</p>
          ) : (
            <div className="space-y-2">
              {(fullView ? inspections : inspections.slice(0, 3)).map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{inspection.station}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(inspection.inspection_date).toLocaleDateString('cs-CZ')} • {inspection.result} • {inspection.cost} Kč
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Další STK: {new Date(inspection.next_inspection_date).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(inspection)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Upravit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(inspection)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Smazat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {!fullView && inspections.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  A {inspections.length - 3} dalších záznamů...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Upravit STK záznam</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-inspection-date">Datum STK</Label>
              <Input
                id="edit-inspection-date"
                type="date"
                value={formData.inspection_date}
                onChange={(e) => setFormData({...formData, inspection_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-next-inspection-date">Další STK</Label>
              <Input
                id="edit-next-inspection-date"
                type="date"
                value={formData.next_inspection_date}
                onChange={(e) => setFormData({...formData, next_inspection_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-result">Výsledek</Label>
              <Select value={formData.result} onValueChange={(value) => setFormData({...formData, result: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte výsledek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Schváleno">Schváleno</SelectItem>
                  <SelectItem value="Schváleno s vadami">Schváleno s vadami</SelectItem>
                  <SelectItem value="Neschváleno">Neschváleno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-station">Stanice STK</Label>
              <Input
                id="edit-station"
                type="text"
                value={formData.station}
                onChange={(e) => setFormData({...formData, station: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-cost">Cena (Kč)</Label>
              <Input
                id="edit-cost"
                type="text"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
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
              <Label htmlFor="edit-notes">Poznámky</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
            <AlertDialogTitle>Smazat STK záznam</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento STK záznam? Tato akce je nevratná.
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

export default InspectionCard;

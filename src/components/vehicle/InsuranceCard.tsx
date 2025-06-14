import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Shield, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInsuranceRecords, saveInsuranceRecord, deleteInsuranceRecord } from '@/services/vehicleService';
import { InsuranceRecord } from '@/types/vehicle';
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

interface InsuranceCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ vehicleId, fullView = false }) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InsuranceRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<InsuranceRecord | null>(null);
  const [formData, setFormData] = useState({
    provider: '',
    policy_number: '',
    valid_from: '',
    valid_until: '',
    monthly_cost: '',
    coverage_type: '',
    notes: ''
  });

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  const { data: insuranceRecords = [], isLoading } = useQuery({
    queryKey: ['insurance-records', vehicleId],
    queryFn: () => fetchInsuranceRecords(vehicleId),
    enabled: !!vehicleId
  });

  const addMutation = useMutation({
    mutationFn: (data: Partial<InsuranceRecord>) => saveInsuranceRecord({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-records', vehicleId] });
      success('Pojistný záznam byl přidán');
      setIsAddSheetOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání záznamu');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsuranceRecord>) => saveInsuranceRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-records', vehicleId] });
      success('Pojistný záznam byl aktualizován');
      setIsEditSheetOpen(false);
      setEditingRecord(null);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci záznamu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInsuranceRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-records', vehicleId] });
      success('Pojistný záznam byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání záznamu');
    }
  });

  const resetForm = () => {
    setFormData({
      provider: '',
      policy_number: '',
      valid_from: '',
      valid_until: '',
      monthly_cost: '',
      coverage_type: '',
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

  const handleEdit = (record: InsuranceRecord) => {
    setEditingRecord(record);
    setFormData({
      provider: record.provider,
      policy_number: record.policy_number,
      valid_from: record.valid_from,
      valid_until: record.valid_until,
      monthly_cost: record.monthly_cost,
      coverage_type: record.coverage_type,
      notes: record.notes || ''
    });
    setIsEditSheetOpen(true);
  };

  const handleDelete = (record: InsuranceRecord) => {
    setDeletingRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingRecord?.id) {
      deleteMutation.mutate(deletingRecord.id);
    }
  };

  const totalMonthlyCost = insuranceRecords.reduce((sum, record) => sum + parseFloat(record.monthly_cost), 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pojištění
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
              <Shield className="h-5 w-5" />
              Pojištění
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
                  <SheetTitle>Přidat pojištění</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="provider">Pojišťovna</Label>
                    <Input
                      id="provider"
                      type="text"
                      value={formData.provider}
                      onChange={(e) => setFormData({...formData, provider: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="policy-number">Číslo pojistky</Label>
                    <Input
                      id="policy-number"
                      type="text"
                      value={formData.policy_number}
                      onChange={(e) => setFormData({...formData, policy_number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valid-from">Platnost od</Label>
                    <Input
                      id="valid-from"
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valid-until">Platnost do</Label>
                    <Input
                      id="valid-until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-cost">Měsíční náklady (€)</Label>
                    <Input
                      id="monthly-cost"
                      type="text"
                      value={formData.monthly_cost}
                      onChange={(e) => setFormData({...formData, monthly_cost: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverage-type">Typ pojištění</Label>
                    <Select value={formData.coverage_type} onValueChange={(value) => setFormData({...formData, coverage_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ pojištění" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Povinné ručení">Povinné ručení</SelectItem>
                        <SelectItem value="Havarijní pojištění">Havarijní pojištění</SelectItem>
                        <SelectItem value="Kombinované">Kombinované</SelectItem>
                      </SelectContent>
                    </Select>
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
          {insuranceRecords.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné pojistné záznamy</p>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Celkové měsíční náklady</p>
                <p className="text-2xl font-bold">{totalMonthlyCost.toFixed(2)} €</p>
              </div>
              
              <div className="space-y-2">
                {(fullView ? insuranceRecords : insuranceRecords.slice(0, 3)).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{record.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.coverage_type} • {parseFloat(record.monthly_cost).toFixed(2)}€/měsíc
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Platnost: {new Date(record.valid_from).toLocaleDateString('cs-CZ')} - {new Date(record.valid_until).toLocaleDateString('cs-CZ')}
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
              
              {!fullView && insuranceRecords.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  A {insuranceRecords.length - 3} dalších záznamů...
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
            <SheetTitle>Upravit pojištění</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-provider">Pojišťovna</Label>
              <Input
                id="edit-provider"
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-policy-number">Číslo pojistky</Label>
              <Input
                id="edit-policy-number"
                type="text"
                value={formData.policy_number}
                onChange={(e) => setFormData({...formData, policy_number: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-valid-from">Platnost od</Label>
              <Input
                id="edit-valid-from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-valid-until">Platnost do</Label>
              <Input
                id="edit-valid-until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-monthly-cost">Měsíční náklady (€)</Label>
              <Input
                id="edit-monthly-cost"
                type="text"
                value={formData.monthly_cost}
                onChange={(e) => setFormData({...formData, monthly_cost: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-coverage-type">Typ pojištění</Label>
              <Select value={formData.coverage_type} onValueChange={(value) => setFormData({...formData, coverage_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ pojištění" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Povinné ručení">Povinné ručení</SelectItem>
                  <SelectItem value="Havarijní pojištění">Havarijní pojištění</SelectItem>
                  <SelectItem value="Kombinované">Kombinované</SelectItem>
                </SelectContent>
              </Select>
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
            <AlertDialogTitle>Smazat pojistný záznam</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento pojistný záznam? Tato akce je nevratná.
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

export default InsuranceCard;

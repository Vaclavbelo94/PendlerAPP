
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, MapPin, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVignetteRecords, saveVignetteRecord, deleteVignetteRecord } from '@/services/vehicleService';
import { VignetteRecord } from '@/types/vehicle';
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

interface VignetteCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const VignetteCard: React.FC<VignetteCardProps> = ({ vehicleId, fullView = false }) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VignetteRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<VignetteRecord | null>(null);
  const [formData, setFormData] = useState({
    country: '',
    vignette_type: '',
    valid_from: '',
    valid_until: '',
    cost: '',
    purchase_location: '',
    notes: ''
  });

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  const { data: vignettes = [], isLoading } = useQuery({
    queryKey: ['vignette-records', vehicleId],
    queryFn: () => fetchVignetteRecords(vehicleId),
    enabled: !!vehicleId
  });

  const addMutation = useMutation({
    mutationFn: (data: Partial<VignetteRecord>) => saveVignetteRecord({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vignette-records', vehicleId] });
      success('Dálniční známka byla přidána');
      setIsAddSheetOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání dálniční známky');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<VignetteRecord>) => saveVignetteRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vignette-records', vehicleId] });
      success('Dálniční známka byla aktualizována');
      setIsEditSheetOpen(false);
      setEditingRecord(null);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci dálniční známky');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVignetteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vignette-records', vehicleId] });
      success('Dálniční známka byla smazána');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání dálniční známky');
    }
  });

  const resetForm = () => {
    setFormData({
      country: '',
      vignette_type: '',
      valid_from: '',
      valid_until: '',
      cost: '',
      purchase_location: '',
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

  const handleEdit = (record: VignetteRecord) => {
    setEditingRecord(record);
    setFormData({
      country: record.country,
      vignette_type: record.vignette_type,
      valid_from: record.valid_from,
      valid_until: record.valid_until,
      cost: record.cost,
      purchase_location: record.purchase_location || '',
      notes: record.notes || ''
    });
    setIsEditSheetOpen(true);
  };

  const handleDelete = (record: VignetteRecord) => {
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
            <MapPin className="h-5 w-5" />
            Dálniční známky
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
              <MapPin className="h-5 w-5" />
              Dálniční známky
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
                  <SheetTitle>Přidat dálniční známku</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="country">Země</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte zemi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Česká republika">Česká republika</SelectItem>
                        <SelectItem value="Slovensko">Slovensko</SelectItem>
                        <SelectItem value="Rakousko">Rakousko</SelectItem>
                        <SelectItem value="Německo">Německo</SelectItem>
                        <SelectItem value="Švýcarsko">Švýcarsko</SelectItem>
                        <SelectItem value="Slovinsko">Slovinsko</SelectItem>
                        <SelectItem value="Maďarsko">Maďarsko</SelectItem>
                        <SelectItem value="Bulharsko">Bulharsko</SelectItem>
                        <SelectItem value="Rumunsko">Rumunsko</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vignette-type">Typ známky</Label>
                    <Select value={formData.vignette_type} onValueChange={(value) => setFormData({...formData, vignette_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ známky" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10 dní">10 dní</SelectItem>
                        <SelectItem value="1 měsíc">1 měsíc</SelectItem>
                        <SelectItem value="1 rok">1 rok</SelectItem>
                        <SelectItem value="Elektronická">Elektronická</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="valid-from">Platná od</Label>
                    <Input
                      id="valid-from"
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valid-until">Platná do</Label>
                    <Input
                      id="valid-until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
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
                    <Label htmlFor="purchase-location">Místo nákupu</Label>
                    <Input
                      id="purchase-location"
                      type="text"
                      value={formData.purchase_location}
                      onChange={(e) => setFormData({...formData, purchase_location: e.target.value})}
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
          {vignettes.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné dálniční známky</p>
          ) : (
            <div className="space-y-2">
              {(fullView ? vignettes : vignettes.slice(0, 3)).map((vignette) => (
                <div key={vignette.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{vignette.country} - {vignette.vignette_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(vignette.valid_from).toLocaleDateString('cs-CZ')} - {new Date(vignette.valid_until).toLocaleDateString('cs-CZ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vignette.cost} Kč
                      {vignette.purchase_location && ` • ${vignette.purchase_location}`}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(vignette)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Upravit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(vignette)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Smazat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {!fullView && vignettes.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  A {vignettes.length - 3} dalších známek...
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
            <SheetTitle>Upravit dálniční známku</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-country">Země</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte zemi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Česká republika">Česká republika</SelectItem>
                  <SelectItem value="Slovensko">Slovensko</SelectItem>
                  <SelectItem value="Rakousko">Rakousko</SelectItem>
                  <SelectItem value="Německo">Německo</SelectItem>
                  <SelectItem value="Švýcarsko">Švýcarsko</SelectItem>
                  <SelectItem value="Slovinsko">Slovinsko</SelectItem>
                  <SelectItem value="Maďarsko">Maďarsko</SelectItem>
                  <SelectItem value="Bulharsko">Bulharsko</SelectItem>
                  <SelectItem value="Rumunsko">Rumunsko</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-vignette-type">Typ známky</Label>
              <Select value={formData.vignette_type} onValueChange={(value) => setFormData({...formData, vignette_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ známky" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10 dní">10 dní</SelectItem>
                  <SelectItem value="1 měsíc">1 měsíc</SelectItem>
                  <SelectItem value="1 rok">1 rok</SelectItem>
                  <SelectItem value="Elektronická">Elektronická</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-valid-from">Platná od</Label>
              <Input
                id="edit-valid-from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-valid-until">Platná do</Label>
              <Input
                id="edit-valid-until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
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
              <Label htmlFor="edit-purchase-location">Místo nákupu</Label>
              <Input
                id="edit-purchase-location"
                type="text"
                value={formData.purchase_location}
                onChange={(e) => setFormData({...formData, purchase_location: e.target.value})}
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
            <AlertDialogTitle>Smazat dálniční známku</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tuto dálniční známku? Tato akce je nevratná.
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

export default VignetteCard;

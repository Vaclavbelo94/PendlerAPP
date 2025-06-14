
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Shield, FileText, Car, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInsuranceRecords, saveInsuranceRecord, deleteInsuranceRecord, fetchDocuments, saveDocument, deleteDocument } from '@/services/vehicleService';
import { InsuranceRecord, DocumentRecord } from '@/types/vehicle';
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

interface OthersCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const OthersCard: React.FC<OthersCardProps> = ({ vehicleId, fullView = false }) => {
  const [activeTab, setActiveTab] = useState('insurance');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  // Insurance queries
  const { data: insuranceRecords = [], isLoading: isLoadingInsurance } = useQuery({
    queryKey: ['insurance-records', vehicleId],
    queryFn: () => fetchInsuranceRecords(vehicleId),
    enabled: !!vehicleId
  });

  // Documents queries
  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['documents', vehicleId],
    queryFn: () => fetchDocuments(vehicleId),
    enabled: !!vehicleId
  });

  // Insurance mutations
  const addInsuranceMutation = useMutation({
    mutationFn: (data: Partial<InsuranceRecord>) => saveInsuranceRecord({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-records', vehicleId] });
      success('Pojistný záznam byl přidán');
      closeSheets();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání pojistného záznamu');
    }
  });

  const updateInsuranceMutation = useMutation({
    mutationFn: (data: Partial<InsuranceRecord>) => saveInsuranceRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-records', vehicleId] });
      success('Pojistný záznam byl aktualizován');
      closeSheets();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci pojistného záznamu');
    }
  });

  const deleteInsuranceMutation = useMutation({
    mutationFn: (id: string) => deleteInsuranceRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-records', vehicleId] });
      success('Pojistný záznam byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání pojistného záznamu');
    }
  });

  // Document mutations
  const addDocumentMutation = useMutation({
    mutationFn: (data: Partial<DocumentRecord>) => saveDocument({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', vehicleId] });
      success('Dokument byl přidán');
      closeSheets();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání dokumentu');
    }
  });

  const updateDocumentMutation = useMutation({
    mutationFn: (data: Partial<DocumentRecord>) => saveDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', vehicleId] });
      success('Dokument byl aktualizován');
      closeSheets();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci dokumentu');
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', vehicleId] });
      success('Dokument byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingRecord(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání dokumentu');
    }
  });

  const closeSheets = () => {
    setIsAddSheetOpen(false);
    setIsEditSheetOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'insurance') {
      if (editingRecord) {
        updateInsuranceMutation.mutate({ ...formData, id: editingRecord.id });
      } else {
        addInsuranceMutation.mutate(formData);
      }
    } else if (activeTab === 'documents') {
      if (editingRecord) {
        updateDocumentMutation.mutate({ ...formData, id: editingRecord.id });
      } else {
        addDocumentMutation.mutate(formData);
      }
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData(record);
    setIsEditSheetOpen(true);
  };

  const handleDelete = (record: any) => {
    setDeletingRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingRecord?.id) return;
    
    if (activeTab === 'insurance') {
      deleteInsuranceMutation.mutate(deletingRecord.id);
    } else if (activeTab === 'documents') {
      deleteDocumentMutation.mutate(deletingRecord.id);
    }
  };

  const renderInsuranceForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="provider">Pojišťovna</Label>
        <Input
          id="provider"
          value={formData.provider || ''}
          onChange={(e) => setFormData({...formData, provider: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="policy-number">Číslo pojistky</Label>
        <Input
          id="policy-number"
          value={formData.policy_number || ''}
          onChange={(e) => setFormData({...formData, policy_number: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="valid-from">Platnost od</Label>
        <Input
          id="valid-from"
          type="date"
          value={formData.valid_from || ''}
          onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="valid-until">Platnost do</Label>
        <Input
          id="valid-until"
          type="date"
          value={formData.valid_until || ''}
          onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="monthly-cost">Měsíční náklady</Label>
        <Input
          id="monthly-cost"
          value={formData.monthly_cost || ''}
          onChange={(e) => setFormData({...formData, monthly_cost: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="coverage-type">Typ pojištění</Label>
        <Select value={formData.coverage_type || ''} onValueChange={(value) => setFormData({...formData, coverage_type: value})}>
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
          value={formData.notes || ''}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>
    </div>
  );

  const renderDocumentForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="document-name">Název dokumentu</Label>
        <Input
          id="document-name"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="document-type">Typ dokumentu</Label>
        <Select value={formData.type || ''} onValueChange={(value) => setFormData({...formData, type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte typ dokumentu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technický průkaz">Technický průkaz</SelectItem>
            <SelectItem value="STK protokol">STK protokol</SelectItem>
            <SelectItem value="Dálniční známka">Dálniční známka</SelectItem>
            <SelectItem value="Servisní kniha">Servisní kniha</SelectItem>
            <SelectItem value="Ostatní">Ostatní</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="expiry-date">Datum expirace</Label>
        <Input
          id="expiry-date"
          type="date"
          value={formData.expiry_date || ''}
          onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="document-notes">Poznámky</Label>
        <Textarea
          id="document-notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>
    </div>
  );

  const renderRecordsList = (records: any[], type: string) => {
    if (records.length === 0) {
      return <p className="text-muted-foreground">Zatím žádné záznamy</p>;
    }

    return (
      <div className="space-y-2">
        {(fullView ? records : records.slice(0, 3)).map((record) => (
          <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{type === 'insurance' ? record.provider : record.name}</p>
              <p className="text-sm text-muted-foreground">
                {type === 'insurance' 
                  ? `${record.coverage_type} • ${record.policy_number}`
                  : `${record.type}${record.expiry_date ? ` • Vyprší: ${new Date(record.expiry_date).toLocaleDateString('cs-CZ')}` : ''}`
                }
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
        
        {!fullView && records.length > 3 && (
          <p className="text-sm text-muted-foreground mt-2">
            A {records.length - 3} dalších záznamů...
          </p>
        )}
      </div>
    );
  };

  if (isLoadingInsurance || isLoadingDocuments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ostatní
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
              <FileText className="h-5 w-5" />
              Ostatní
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
                  <SheetTitle>
                    Přidat {activeTab === 'insurance' ? 'pojištění' : 'dokument'}
                  </SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="mt-4">
                  {activeTab === 'insurance' ? renderInsuranceForm() : renderDocumentForm()}
                  <div className="flex gap-2 mt-6">
                    <Button type="submit" disabled={addInsuranceMutation.isPending || addDocumentMutation.isPending}>
                      {(addInsuranceMutation.isPending || addDocumentMutation.isPending) ? 'Ukládání...' : 'Uložit'}
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insurance" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Pojištění
              </TabsTrigger>
              <TabsTrigger value="stk" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                STK
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dokumenty
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="insurance" className="mt-4">
              {renderRecordsList(insuranceRecords, 'insurance')}
            </TabsContent>
            
            <TabsContent value="stk" className="mt-4">
              <p className="text-muted-foreground">STK funkcionality budou implementovány později</p>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              {renderRecordsList(documents, 'documents')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Upravit {activeTab === 'insurance' ? 'pojištění' : 'dokument'}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="mt-4">
            {activeTab === 'insurance' ? renderInsuranceForm() : renderDocumentForm()}
            <div className="flex gap-2 mt-6">
              <Button type="submit" disabled={updateInsuranceMutation.isPending || updateDocumentMutation.isPending}>
                {(updateInsuranceMutation.isPending || updateDocumentMutation.isPending) ? 'Ukládání...' : 'Uložit'}
              </Button>
              <Button type="button" variant="outline" onClick={closeSheets}>
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
            <AlertDialogTitle>Smazat záznam</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento záznam? Tato akce je nevratná.
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
              disabled={deleteInsuranceMutation.isPending || deleteDocumentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {(deleteInsuranceMutation.isPending || deleteDocumentMutation.isPending) ? 'Mazání...' : 'Smazat'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OthersCard;

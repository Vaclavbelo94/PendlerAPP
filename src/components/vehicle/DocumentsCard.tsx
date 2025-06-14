import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, FileText, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDocuments, saveDocument, deleteDocument } from '@/services/vehicleService';
import { DocumentRecord } from '@/types/vehicle';
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

interface DocumentsCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ vehicleId, fullView = false }) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<DocumentRecord | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    expiry_date: '',
    notes: '',
    file_path: ''
  });

  const { success, error } = useStandardizedToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', vehicleId],
    queryFn: () => fetchDocuments(vehicleId),
    enabled: !!vehicleId
  });

  const addMutation = useMutation({
    mutationFn: (data: Partial<DocumentRecord>) => saveDocument({ ...data, vehicle_id: vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', vehicleId] });
      success('Dokument byl přidán');
      setIsAddSheetOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při přidávání dokumentu');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<DocumentRecord>) => saveDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', vehicleId] });
      success('Dokument byl aktualizován');
      setIsEditSheetOpen(false);
      setEditingDocument(null);
      resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při aktualizaci dokumentu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', vehicleId] });
      success('Dokument byl smazán');
      setIsDeleteDialogOpen(false);
      setDeletingDocument(null);
    },
    onError: (err: any) => {
      error(err.message || 'Chyba při mazání dokumentu');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      expiry_date: '',
      notes: '',
      file_path: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDocument) {
      updateMutation.mutate({ ...formData, id: editingDocument.id });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (document: DocumentRecord) => {
    setEditingDocument(document);
    setFormData({
      name: document.name,
      type: document.type,
      expiry_date: document.expiry_date || '',
      notes: document.notes || '',
      file_path: document.file_path || ''
    });
    setIsEditSheetOpen(true);
  };

  const handleDelete = (document: DocumentRecord) => {
    setDeletingDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingDocument?.id) {
      deleteMutation.mutate(deletingDocument.id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumenty
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
              Dokumenty
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
                  <SheetTitle>Přidat dokument</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="document-name">Název dokumentu</Label>
                    <Input
                      id="document-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document-type">Typ dokumentu</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ dokumentu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technický průkaz">Technický průkaz</SelectItem>
                        <SelectItem value="Doklad o pojištění">Doklad o pojištění</SelectItem>
                        <SelectItem value="STK protokol">STK protokol</SelectItem>
                        <SelectItem value="Servisní kniha">Servisní kniha</SelectItem>
                        <SelectItem value="Smlouva o koupi">Smlouva o koupi</SelectItem>
                        <SelectItem value="Ostatní">Ostatní</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiry-date">Datum expirace</Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="document-notes">Poznámky</Label>
                    <Textarea
                      id="document-notes"
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
          {documents.length === 0 ? (
            <p className="text-muted-foreground">Zatím žádné dokumenty</p>
          ) : (
            <div className="space-y-2">
              {(fullView ? documents : documents.slice(0, 3)).map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {document.type}
                      {document.expiry_date && (
                        <> • Vyprší: {new Date(document.expiry_date).toLocaleDateString('cs-CZ')}</>
                      )}
                    </p>
                    {document.notes && (
                      <p className="text-sm text-muted-foreground">{document.notes}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(document)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Upravit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(document)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Smazat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {!fullView && documents.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  A {documents.length - 3} dalších dokumentů...
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
            <SheetTitle>Upravit dokument</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-document-name">Název dokumentu</Label>
              <Input
                id="edit-document-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-document-type">Typ dokumentu</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ dokumentu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technický průkaz">Technický průkaz</SelectItem>
                  <SelectItem value="Doklad o pojištění">Doklad o pojištění</SelectItem>
                  <SelectItem value="STK protokol">STK protokol</SelectItem>
                  <SelectItem value="Servisní kniha">Servisní kniha</SelectItem>
                  <SelectItem value="Smlouva o koupi">Smlouva o koupi</SelectItem>
                  <SelectItem value="Ostatní">Ostatní</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-expiry-date">Datum expirace</Label>
              <Input
                id="edit-expiry-date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-document-notes">Poznámky</Label>
              <Textarea
                id="edit-document-notes"
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
                  setEditingDocument(null);
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
            <AlertDialogTitle>Smazat dokument</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento dokument? Tato akce je nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setDeletingDocument(null);
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

export default DocumentsCard;

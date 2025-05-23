
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DocumentRecord } from '@/types/vehicle';
import { fetchDocuments, saveDocument, deleteDocument } from '@/services/vehicleService';
import { PlusCircle, TrashIcon, FileIcon, CalendarIcon, FileTextIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface DocumentsCardProps {
  vehicleId?: string;
}

const documentSchema = z.object({
  vehicle_id: z.string(),
  name: z.string().min(1, 'Zadejte název dokumentu'),
  type: z.string().min(1, 'Vyberte typ dokumentu'),
  expiry_date: z.string().optional(),
  notes: z.string().optional(),
});

const documentTypes = [
  { value: 'manual', label: 'Návod k obsluze' },
  { value: 'stk', label: 'STK protokol' },
  { value: 'insurance', label: 'Pojištění' },
  { value: 'service_book', label: 'Servisní knížka' },
  { value: 'invoice', label: 'Faktura' },
  { value: 'other', label: 'Ostatní' },
];

const DocumentsCard: React.FC<DocumentsCardProps> = ({ vehicleId }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord | null>(null);

  const form = useForm<DocumentRecord>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      vehicle_id: vehicleId || '',
      name: '',
      type: '',
      expiry_date: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (vehicleId) {
      loadDocuments();
    }
  }, [vehicleId]);

  useEffect(() => {
    if (selectedDocument) {
      form.reset({
        ...selectedDocument,
        expiry_date: selectedDocument.expiry_date || '',
        notes: selectedDocument.notes || '',
      });
    } else {
      form.reset({
        vehicle_id: vehicleId || '',
        name: '',
        type: '',
        expiry_date: '',
        notes: '',
      });
    }
  }, [selectedDocument, form, vehicleId]);

  const loadDocuments = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const docs = await fetchDocuments(vehicleId);
      setDocuments(docs);
    } catch (error) {
      console.error('Chyba při načítání dokumentů:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setIsDialogOpen(true);
  };

  const handleEditDocument = (document: DocumentRecord) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: DocumentRecord) => {
    try {
      const savedDocument = await saveDocument({
        ...data,
        id: selectedDocument?.id,
      });
      
      if (savedDocument) {
        if (selectedDocument) {
          setDocuments(prev => prev.map(d => d.id === savedDocument.id ? savedDocument : d));
        } else {
          setDocuments(prev => [savedDocument, ...prev]);
        }
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Chyba při ukládání dokumentu:', error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Opravdu chcete smazat tento dokument?')) {
      try {
        const success = await deleteDocument(id);
        if (success) {
          setDocuments(prev => prev.filter(d => d.id !== id));
        }
      } catch (error) {
        console.error('Chyba při mazání dokumentu:', error);
      }
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(t => t.value === type);
    return docType ? docType.label : type;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Dokumenty</CardTitle>
          <CardDescription>Správa dokumentů k vozidlu</CardDescription>
        </div>
        <Button onClick={handleAddDocument}>
          <PlusCircle className="h-4 w-4 mr-2" /> Přidat dokument
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileTextIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Zatím zde nejsou žádné dokumenty</p>
            <p className="text-sm mt-2">Klikněte na "Přidat dokument" pro přidání prvního dokumentu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileIcon className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">{document.name}</h3>
                    <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded ml-2">
                      {getDocumentTypeLabel(document.type)}
                    </span>
                  </div>
                  {document.expiry_date && (
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Platnost do: {new Date(document.expiry_date).toLocaleDateString('cs-CZ')}</span>
                    </div>
                  )}
                  {document.notes && <p className="text-sm mt-2">{document.notes}</p>}
                </div>
                <div className="flex items-center mt-3 md:mt-0">
                  <Button variant="ghost" size="sm" onClick={() => handleEditDocument(document)}>
                    Upravit
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteDocument(document.id!)}>
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
              <DialogTitle>{selectedDocument ? 'Upravit dokument' : 'Přidat dokument'}</DialogTitle>
              <DialogDescription>
                {selectedDocument 
                  ? 'Upravte informace o dokumentu' 
                  : 'Zadejte informace o novém dokumentu'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Název dokumentu *</FormLabel>
                      <FormControl>
                        <Input placeholder="STK protokol 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ dokumentu *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte typ dokumentu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {documentTypes.map((type) => (
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
                  
                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum platnosti</FormLabel>
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poznámky</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Další informace o dokumentu..." {...field} />
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
                    {selectedDocument ? 'Uložit změny' : 'Přidat dokument'}
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

export default DocumentsCard;

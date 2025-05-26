
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentRecord } from '@/types/vehicle';
import { saveDocument } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useStandardizedToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    expiry_date: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const document: Partial<DocumentRecord> = {
        vehicle_id: vehicleId,
        name: formData.name,
        type: formData.type,
        expiry_date: formData.expiry_date || undefined,
        notes: formData.notes || undefined
      };

      await saveDocument(document);
      success('Dokument byl úspěšně přidán');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || 'Chyba při ukládání dokumentu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Přidat dokument</DialogTitle>
          <DialogDescription>
            Zadejte údaje o novém dokumentu
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Název dokumentu *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Technický průkaz"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Typ dokumentu *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ dokumentu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technicky_prukaz">Technický průkaz</SelectItem>
                <SelectItem value="pojistka">Pojistka</SelectItem>
                <SelectItem value="stk">STK</SelectItem>
                <SelectItem value="emise">Emisní kontrola</SelectItem>
                <SelectItem value="kupni_smlouva">Kupní smlouva</SelectItem>
                <SelectItem value="servisni_kniha">Servisní kniha</SelectItem>
                <SelectItem value="jine">Jiné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiry_date">Datum vypršení</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Dodatečné informace..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ukládám...' : 'Přidat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;

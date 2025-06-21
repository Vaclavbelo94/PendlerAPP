
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
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
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
      success(t('documentSavedSuccessfully') || 'Dokument byl úspěšně přidán');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || (t('errorSavingDocument') || 'Chyba při ukládání dokumentu'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addDocument') || 'Přidat dokument'}</DialogTitle>
          <DialogDescription>
            {t('enterNewDocumentDetails') || 'Zadejte údaje o novém dokumentu'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('documentName') || 'Název dokumentu'} *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('technicalCertificate') || 'Technický průkaz'}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">{t('documentType') || 'Typ dokumentu'} *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectDocumentType') || 'Vyberte typ dokumentu'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technicky_prukaz">{t('technicalCertificate') || 'Technický průkaz'}</SelectItem>
                <SelectItem value="pojistka">{t('insurance') || 'Pojistka'}</SelectItem>
                <SelectItem value="stk">{t('stk') || 'STK'}</SelectItem>
                <SelectItem value="emise">{t('emissionControl') || 'Emisní kontrola'}</SelectItem>
                <SelectItem value="kupni_smlouva">{t('purchaseContract') || 'Kupní smlouva'}</SelectItem>
                <SelectItem value="servisni_kniha">{t('serviceBook') || 'Servisní kniha'}</SelectItem>
                <SelectItem value="jine">{t('other') || 'Jiné'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiry_date">{t('expirationDate') || 'Datum vypršení'}</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">{t('notes') || 'Poznámky'}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={t('additionalInformation') || 'Dodatečné informace...'}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel') || 'Zrušit'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (t('saving') || 'Ukládám...') : (t('add') || 'Přidat')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;

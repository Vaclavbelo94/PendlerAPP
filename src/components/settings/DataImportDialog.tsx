
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { dataExportService } from '@/services/dataExportService';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface DataImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DataImportDialog: React.FC<DataImportDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const { t } = useTranslation('settings');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      toast.error('Prosím vyberte JSON soubor');
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !user) return;

    setIsImporting(true);
    try {
      await dataExportService.importFromJSON(selectedFile, user.id);
      toast.success('Data byla úspěšně importována');
      onOpenChange(false);
      setSelectedFile(null);
      
      // Refresh the page to load imported data
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Chyba při importu dat');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('importData') || 'Importovat data'}
          </DialogTitle>
          <DialogDescription>
            Nahrajte JSON soubor s vašimi daty vyexportovanými z této aplikace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Upozornění</p>
              <p>Import nahradí všechna vaše současná data. Doporučujeme nejprve vytvořit zálohu.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-file">Vyberte JSON soubor</Label>
            <Input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isImporting}
            />
          </div>

          {selectedFile && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Vybraný soubor:</span> {selectedFile.name}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Velikost: {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
            >
              {t('cancel') || 'Zrušit'}
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? 'Importuji...' : (t('import') || 'Importovat')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

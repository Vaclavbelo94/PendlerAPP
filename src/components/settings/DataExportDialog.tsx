
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Table, Database } from 'lucide-react';
import { toast } from 'sonner';
import { dataExportService } from '@/services/dataExportService';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface DataExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DataExportDialog: React.FC<DataExportDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const { t } = useTranslation('settings');
  const [exportFormat, setExportFormat] = useState('json');
  const [csvDataType, setCsvDataType] = useState('shifts');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    {
      value: 'json',
      label: 'JSON',
      description: 'Kompletní záloha všech dat pro import zpět do aplikace',
      icon: Database
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Přehledné tabulky pro jednotlivé kategorie dat',
      icon: Table
    },
    {
      value: 'csv',
      label: 'CSV',
      description: 'Základní formát pro další zpracování (jedna kategorie)',
      icon: FileText
    }
  ];

  const csvDataOptions = [
    { value: 'shifts', label: 'Směny' },
    { value: 'vehicles', label: 'Vozidla' },
    { value: 'taxCalculations', label: 'Daňové výpočty' },
    { value: 'vocabulary', label: 'Slovíčka' }
  ];

  const handleExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const userData = await dataExportService.getAllUserData(user.id);

      switch (exportFormat) {
        case 'json':
          await dataExportService.exportToJSON(userData);
          break;
        case 'excel':
          await dataExportService.exportToExcel(userData);
          break;
        case 'csv':
          await dataExportService.exportToCSV(userData, csvDataType);
          break;
      }

      toast.success('Export dat byl úspěšně dokončen');
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Chyba při exportu dat');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('exportData') || 'Exportovat data'}
          </DialogTitle>
          <DialogDescription>
            Vyberte formát pro export vašich dat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Formát exportu</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="flex items-center gap-2 font-medium cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {exportFormat === 'csv' && (
            <div className="space-y-2">
              <Label>Kategorie dat pro CSV export</Label>
              <Select value={csvDataType} onValueChange={setCsvDataType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {csvDataOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              {t('cancel') || 'Zrušit'}
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportuji...' : (t('export') || 'Exportovat')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

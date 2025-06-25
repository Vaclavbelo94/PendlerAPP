
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { importDHLSchedule, ImportScheduleData } from '@/services/dhl/dhlScheduleImporter';
import { validateScheduleData } from '@/services/dhl/scheduleValidator';
import { toast } from 'sonner';

export const ScheduleUploader: React.FC = () => {
  const { positions, workGroups, isLoading } = useDHLData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [formData, setFormData] = useState({
    positionId: '',
    workGroupId: '',
    scheduleName: ''
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      toast.error('Prosím vyberte JSON soubor');
      return;
    }

    setSelectedFile(file);
    
    // Read and parse JSON
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        setJsonData(parsed);
        
        // Validate immediately
        const validationResult = validateScheduleData(parsed, file.name);
        setValidation(validationResult);
        
        // Auto-fill schedule name if not set
        if (!formData.scheduleName) {
          const baseName = file.name.replace('.json', '');
          setFormData(prev => ({ ...prev, scheduleName: baseName }));
        }
        
      } catch (error) {
        console.error('JSON parse error:', error);
        toast.error('Neplatný JSON soubor');
        setSelectedFile(null);
        setJsonData(null);
        setValidation(null);
      }
    };
    reader.readAsText(file);
  }, [formData.scheduleName]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Create a proper event object
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.files = event.dataTransfer.files;
      
      const syntheticEvent = {
        target: fileInput,
        currentTarget: fileInput
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileSelect(syntheticEvent);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const clearFile = () => {
    setSelectedFile(null);
    setJsonData(null);
    setValidation(null);
  };

  const handleImport = async () => {
    if (!selectedFile || !jsonData || !validation?.isValid) {
      toast.error('Prosím vyberte platný soubor a vyplňte všechna pole');
      return;
    }

    if (!formData.positionId || !formData.workGroupId || !formData.scheduleName) {
      toast.error('Prosím vyplňte všechna povinná pole');
      return;
    }

    setIsImporting(true);

    try {
      const importData: ImportScheduleData = {
        positionId: formData.positionId,
        workGroupId: formData.workGroupId,
        scheduleName: formData.scheduleName,
        jsonData: jsonData,
        fileName: selectedFile.name
      };

      const result = await importDHLSchedule(importData);

      if (result.success) {
        toast.success(result.message);
        // Reset form
        clearFile();
        setFormData({
          positionId: '',
          workGroupId: '',
          scheduleName: ''
        });
      } else {
        toast.error(`Import failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Chyba při importu souboru');
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Načítám DHL data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          selectedFile 
            ? 'border-green-300 bg-green-50 dark:bg-green-950/20' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFile}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {validation && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {validation.isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Soubor je platný</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-red-600 font-medium">Soubor obsahuje chyby</span>
                    </>
                  )}
                </div>
                
                <div className="text-sm space-y-1">
                  <p>Celkem směn: <Badge variant="secondary">{validation.summary.totalShifts}</Badge></p>
                  <p>Celkem dní: <Badge variant="secondary">{validation.summary.totalDays}</Badge></p>
                  {validation.summary.detectedWoche && (
                    <p>Detekované Woche: <Badge variant="secondary">{validation.summary.detectedWoche}</Badge></p>
                  )}
                </div>

                {validation.errors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Chyby:</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      {validation.errors.map((error: any, index: number) => (
                        <li key={index}>• {error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Varování:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      {validation.warnings.map((warning: any, index: number) => (
                        <li key={index}>• {warning.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">Přetáhněte JSON soubor nebo klikněte pro výběr</p>
              <p className="text-sm text-muted-foreground">Podporované formáty: JSON</p>
            </div>
            <Input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="max-w-xs mx-auto"
            />
          </div>
        )}
      </div>

      {/* Import Form */}
      {selectedFile && validation?.isValid && (
        <Card>
          <CardHeader>
            <CardTitle>Nastavení importu</CardTitle>
            <CardDescription>
              Vyberte pozici a pracovní skupinu pro tento plán směn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Pozice</Label>
                <Select value={formData.positionId} onValueChange={(value) => setFormData(prev => ({ ...prev, positionId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte pozici" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name} ({position.position_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workGroup">Pracovní skupina</Label>
                <Select value={formData.workGroupId} onValueChange={(value) => setFormData(prev => ({ ...prev, workGroupId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte pracovní skupinu" />
                  </SelectTrigger>
                  <SelectContent>
                    {workGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} (Týden {group.week_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleName">Název plánu</Label>
              <Input
                id="scheduleName"
                value={formData.scheduleName}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduleName: e.target.value }))}
                placeholder="Např. Technik - Týden 1 - Leden 2025"
              />
            </div>

            <Button 
              onClick={handleImport} 
              disabled={isImporting || !formData.positionId || !formData.workGroupId || !formData.scheduleName}
              className="w-full"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importuji...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importovat plán směn
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

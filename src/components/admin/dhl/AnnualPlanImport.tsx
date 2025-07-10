import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateAnnualPlan, importAnnualPlan, parseAnnualPlanData } from '@/utils/dhl/annualPlanImporter';
import { AnnualPlanImportData } from '@/types/dhl';
import * as XLSX from 'xlsx';

interface AnnualPlanImportProps {
  onImportComplete?: () => void;
}

const AnnualPlanImport: React.FC<AnnualPlanImportProps> = ({ onImportComplete }) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<AnnualPlanImportData | null>(null);
  const [validation, setValidation] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; error?: string } | null>(null);
  const { toast } = useToast();

  // Available positions for annual plans
  const positions = [
    'Wechselschicht 30h',
    'Wechselschicht 25h',
    'SoEst Nacht/Spät 30h',
    'SoEst Nacht/Spät 32h',
    'TeamL Spät/Nacht',
    'TeamL SpG/NVP'
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportData(null);
    setValidation(null);
    setImportResult(null);

    try {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
        toast({
          title: 'Neplatný formát souboru',
          description: 'Prosím vyberte Excel (.xlsx, .xls) nebo CSV soubor.',
          variant: 'destructive'
        });
        return;
      }

      const arrayBuffer = await selectedFile.arrayBuffer();
      let data: any[][];

      if (fileExtension === 'csv') {
        const text = new TextDecoder().decode(arrayBuffer);
        data = text.split('\n').map(row => row.split(';'));
      } else {
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      }

      if (!selectedPosition) {
        toast({
          title: 'Vyberte pozici',
          description: 'Nejprve vyberte pozici před nahráním souboru.',
          variant: 'destructive'
        });
        return;
      }

      const parsedData = parseAnnualPlanData(data, selectedPosition);
      const validationResult = validateAnnualPlan(parsedData);

      setImportData(parsedData);
      setValidation(validationResult);

      if (validationResult.isValid) {
        toast({
          title: 'Soubor úspěšně načten',
          description: `Připraven import pro ${validationResult.summary.totalWeeks} týdnů.`
        });
      } else {
        toast({
          title: 'Chyby ve validaci',
          description: `Nalezeno ${validationResult.errors.length} chyb. Zkontrolujte formát dat.`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Chyba při načítání souboru',
        description: 'Nepodařilo se načíst soubor. Zkontrolujte formát.',
        variant: 'destructive'
      });
    }
  };

  const handleImport = async () => {
    if (!importData || !validation?.isValid) return;

    setIsImporting(true);
    try {
      // Get current user ID (in real app, this would come from auth)
      const result = await importAnnualPlan(importData, 'admin-user-id');
      
      setImportResult(result);
      
      if (result.success) {
        toast({
          title: 'Import dokončen',
          description: `Úspěšně naimportováno ${result.scheduleIds?.length || 0} směnových plánů.`
        });
        onImportComplete?.();
      } else {
        toast({
          title: 'Chyba při importu',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Chyba při importu',
        description: 'Nepodařilo se naimportovat data.',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import ročních směnových plánů
          </CardTitle>
          <CardDescription>
            Nahrajte Excel nebo CSV soubor s ročními směnovými plány pro vybranou pozici.
            Soubor musí obsahovat všech 53 kalendářních týdnů (KW01-KW53) a odpovídající woche skupiny.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Position Selection */}
          <div className="space-y-2">
            <Label htmlFor="position">Pozice</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte pozici pro import" />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Soubor s ročním plánem</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              disabled={!selectedPosition}
            />
            {!selectedPosition && (
              <p className="text-sm text-muted-foreground">
                Nejprve vyberte pozici
              </p>
            )}
          </div>

          {/* Validation Results */}
          {validation && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {validation.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <h4 className="font-medium">
                  Výsledek validace
                </h4>
              </div>

              {/* Summary */}
              <div className="flex gap-2">
                <Badge variant="outline">
                  {validation.summary.totalWeeks} týdnů
                </Badge>
                <Badge variant="outline">
                  {validation.summary.totalWocheGroups} skupin
                </Badge>
                <Badge variant={validation.isValid ? "default" : "destructive"}>
                  {validation.isValid ? 'Validní' : 'Nevalidní'}
                </Badge>
              </div>

              {/* Errors */}
              {validation.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Chyby:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validation.errors.slice(0, 5).map((error: string, index: number) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                        {validation.errors.length > 5 && (
                          <li className="text-sm">... a dalších {validation.errors.length - 5} chyb</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Warnings */}
              {validation.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Upozornění:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validation.warnings.slice(0, 3).map((warning: string, index: number) => (
                          <li key={index} className="text-sm">{warning}</li>
                        ))}
                        {validation.warnings.length > 3 && (
                          <li className="text-sm">... a dalších {validation.warnings.length - 3} upozornění</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <Alert variant={importResult.success ? "default" : "destructive"}>
              {importResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {importResult.success 
                  ? 'Import byl úspěšně dokončen!'
                  : `Chyba při importu: ${importResult.error}`
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Import Button */}
          <Button
            onClick={handleImport}
            disabled={!validation?.isValid || isImporting || importResult?.success}
            className="w-full"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Importuji...
              </>
            ) : importResult?.success ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Import dokončen
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4 mr-2" />
                Spustit import
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Formát souboru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Struktura souboru:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>První řádek: hlavičky sloupců (woche1, woche2, ..., woche15)</li>
              <li>První sloupec: kalendářní týdny (KW01, KW02, ..., KW53)</li>
              <li>Buňky: časové rozmezí směny (např. "06:00-14:00") nebo "OFF" pro volno</li>
            </ul>
            
            <p><strong>Příklad:</strong></p>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <div>     | woche1  | woche2  | woche3  |</div>
              <div>KW01 | 06:00-14:00 | OFF     | 14:00-22:00 |</div>
              <div>KW02 | 14:00-22:00 | 06:00-14:00 | OFF     |</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnualPlanImport;
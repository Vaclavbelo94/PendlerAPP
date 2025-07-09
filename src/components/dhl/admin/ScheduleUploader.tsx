import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useAuth } from '@/hooks/auth';
import { validateScheduleData } from '@/services/dhl/scheduleValidator';
import { importDHLSchedule } from '@/services/dhl/dhlScheduleImporter';
import { analyzeJsonFormat, suggestWorkGroupFromFilename } from '@/services/dhl/jsonFormatDetector';
import { JsonFormatDetector } from './JsonFormatDetector';
import { SchedulePreview } from './SchedulePreview';
import { toast } from 'sonner';
import './MobileDHLStyles.css';

export const ScheduleUploader: React.FC = () => {
  const { user } = useAuth();
  const { positions, workGroups, isLoading } = useDHLData(user?.id || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [formatAnalysis, setFormatAnalysis] = useState<any>(null);
  const [formData, setFormData] = useState({
    positionId: '',
    workGroupId: '',
    scheduleName: '',
    importAllGroups: false,
    selectedWoche: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'preview' | 'success'>('select');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Prosím vyberte JSON soubor');
      return;
    }

    try {
      setSelectedFile(file);
      const text = await file.text();
      const data = JSON.parse(text);
      setJsonData(data);
      
      // Analyze JSON format first
      const analysis = analyzeJsonFormat(data, file.name);
      setFormatAnalysis(analysis);
      
      // Auto-fill form based on analysis
      if (analysis.suggestedName) {
        setFormData(prev => ({ ...prev, scheduleName: analysis.suggestedName }));
      }
      
      // Auto-suggest work group if detected
      if (analysis.suggestedGroup) {
        const suggestedWorkGroup = workGroups.find(wg => wg.week_number === analysis.suggestedGroup);
        if (suggestedWorkGroup) {
          setFormData(prev => ({ 
            ...prev, 
            workGroupId: suggestedWorkGroup.id,
            selectedWoche: analysis.suggestedGroup
          }));
        }
      }
      
      // Set import all groups for yearly data
      if (analysis.formatType === 'wechselschicht_yearly' && analysis.detectedGroups.length === 15) {
        setFormData(prev => ({ ...prev, importAllGroups: true }));
      }
      
      // Validate with position context if available
      const validationResult = await validateScheduleData(
        data, 
        file.name, 
        formData.positionId || undefined
      );
      setValidation(validationResult);
      
      if (validationResult.isValid) {
        if (analysis.confidence >= 70) {
          toast.success(`✅ ${analysis.formatType === 'wechselschicht_yearly' ? 'Roční Wechselschicht' : 'Standardní'} formát rozpoznán (${analysis.confidence}% jistota)`);
        }
        setStep('preview');
      } else {
        toast.error('Soubor obsahuje chyby, prosím zkontrolujte a opravte je');
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Chyba při čtení souboru - neplatný JSON formát');
      setSelectedFile(null);
      setJsonData(null);
      setValidation(null);
      setFormatAnalysis(null);
    }
  };

  const handlePositionChange = async (positionId: string) => {
    setFormData(prev => ({ ...prev, positionId }));
    
    // Re-validate if we have data
    if (jsonData && selectedFile) {
      const validationResult = await validateScheduleData(
        jsonData, 
        selectedFile.name, 
        positionId || undefined
      );
      setValidation(validationResult);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !jsonData || !validation?.isValid) {
      toast.error('Nelze importovat - chybí data nebo jsou neplatná');
      return;
    }

    if (!formData.positionId || !formData.workGroupId || !formData.scheduleName) {
      toast.error('Prosím vyplňte všechna povinná pole');
      return;
    }

    try {
      setIsProcessing(true);
      
      const result = await importDHLSchedule({
        positionId: formData.positionId,
        workGroupId: formData.workGroupId,
        scheduleName: formData.scheduleName,
        jsonData: jsonData,
        fileName: selectedFile.name,
        importAllGroups: formData.importAllGroups,
        selectedWoche: formData.selectedWoche
      });

      if (result.success) {
        if (result.groupsProcessed) {
          toast.success(`${result.message} (${result.groupsProcessed} skupin)`);
        } else {
          toast.success(result.message);
        }
        setStep('success');
        
        // Reset form after successful import
        setTimeout(() => {
          setStep('select');
          setSelectedFile(null);
          setJsonData(null);
          setValidation(null);
          setFormData({
            positionId: '',
            workGroupId: '',
            scheduleName: '',
            importAllGroups: false,
            selectedWoche: 1
          });
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Chyba při importu dat');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setStep('select');
    setSelectedFile(null);
    setJsonData(null);
    setValidation(null);
    setFormatAnalysis(null);
  };

  if (step === 'select') {
    return (
      <div className="space-y-4">
        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Pozice *</Label>
            <Select 
              value={formData.positionId} 
              onValueChange={handlePositionChange}
              disabled={isLoading}
            >
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

          <div>
            <Label htmlFor="workGroup">Pracovní skupina *</Label>
            <Select 
              value={formData.workGroupId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, workGroupId: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte skupinu" />
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

        <div>
          <Label htmlFor="scheduleName">Název plánu *</Label>
          <Input
            id="scheduleName"
            value={formData.scheduleName}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduleName: e.target.value }))}
            placeholder="např. Wechselschicht 30h - 2024"
          />
        </div>

        {/* Wechselschicht import options */}
        {validation && Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].kalenderwoche && (
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">🔄 Wechselschicht 30h Import</h4>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="importAllGroups"
                checked={formData.importAllGroups}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  importAllGroups: e.target.checked 
                }))}
                className="rounded border-blue-300"
              />
              <Label htmlFor="importAllGroups" className="text-sm text-blue-700 dark:text-blue-300">
                Importovat všech 15 pracovních skupin najednou
              </Label>
            </div>

            {!formData.importAllGroups && (
              <div>
                <Label htmlFor="selectedWoche" className="text-sm text-blue-700 dark:text-blue-300">
                  Vyberte konkrétní pracovní skupinu:
                </Label>
                <Select 
                  value={formData.selectedWoche.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, selectedWoche: parseInt(value) }))}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Vyberte skupinu" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((woche) => (
                      <SelectItem key={woche} value={woche.toString()}>
                        Pracovní skupina {woche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <p className="text-xs text-blue-600 dark:text-blue-400">
              {formData.importAllGroups 
                ? '💡 Bude vytvořeno 15 samostatných plánů směn (jeden pro každou skupinu)'
                : `💡 Bude vytvořen plán pouze pro skupinu ${formData.selectedWoche}`
              }
            </p>
          </div>
        )}

        {/* File upload */}
        <div>
          <Label htmlFor="file">JSON soubor s plánem směn *</Label>
          <Input
            id="file"
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
        </div>

        {/* Smart Format Detection */}
        {formatAnalysis && (
          <JsonFormatDetector 
            analysis={formatAnalysis} 
            fileName={selectedFile?.name || ''} 
          />
        )}

        {/* Format information */}
        <div className="space-y-4 mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 dark:text-blue-200">📋 Podporované formáty JSON</h4>
          
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300">🔄 Wechselschicht 30h (Roční plán)</h5>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 ml-4">
                <li>• <code>kalenderwoche</code> - KW01, KW02, ...</li>
                <li>• <code>woche</code> - Pracovní skupina (1-15)</li>
                <li>• <code>den</code> - Mo, Di, Mi, Do, Fr, Sa, So</li>
                <li>• <code>start</code> - HH:MM nebo null pro volno</li>
                <li>• <code>ende</code> - HH:MM</li>
              </ul>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                💡 Automaticky generuje směny pro celý rok z kalendářních týdnů
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300">📅 Standardní formát</h5>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 ml-4">
                <li>• <code>base_date, woche, YYYY-MM-DD</code></li>
                <li>• <code>start_time, end_time</code></li>
              </ul>
            </div>
          </div>
        </div>

        {validation && !validation.isValid && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800 dark:text-red-200">Chyby ve validaci</span>
            </div>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {validation.errors.map((error: any, index: number) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <SchedulePreview
        jsonData={jsonData}
        validation={validation}
        formData={formData}
        handleImport={handleImport}
        resetUpload={resetUpload}
      />
    );
  }

  if (step === 'success') {
    return (
      <Card className="text-center p-8">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Import úspěšný!</h3>
        <p className="text-muted-foreground mb-4">
          Rozvrh směn byl úspěšně importován do systému.
        </p>
        <Button
          onClick={() => {
          setSelectedFile(null);
          setJsonData(null);
          setValidation(null);
          setFormatAnalysis(null);
        setFormData({
          positionId: '',
          workGroupId: '',
          scheduleName: '',
          importAllGroups: false,
          selectedWoche: 1
        });
          setStep('select');
        }}
        variant="outline"
        >
          Importovat další rozvrh
        </Button>
      </Card>
    );
  }

  return null;
};

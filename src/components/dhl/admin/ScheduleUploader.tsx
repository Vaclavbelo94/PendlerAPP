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
import { SchedulePreview } from './SchedulePreview';
import { toast } from 'sonner';
import './MobileDHLStyles.css';

export const ScheduleUploader: React.FC = () => {
  const { user } = useAuth();
  const { positions, workGroups, isLoading } = useDHLData(user?.id || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [formData, setFormData] = useState({
    positionId: '',
    workGroupId: '',
    scheduleName: ''
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
      
      // Validate with position context if available
      const validationResult = await validateScheduleData(
        data, 
        file.name, 
        formData.positionId || undefined
      );
      setValidation(validationResult);
      
      if (validationResult.isValid) {
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
        fileName: selectedFile.name
      });

      if (result.success) {
        toast.success(result.message);
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
            scheduleName: ''
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
            placeholder="např. Sortierer Woche 1 - Leden 2024"
          />
        </div>

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
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Import úspěšně dokončen</p>
        </div>
      </div>
    );
  }

  return null;
};

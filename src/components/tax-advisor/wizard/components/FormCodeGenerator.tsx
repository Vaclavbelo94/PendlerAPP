import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Download, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { TaxWizardData, TaxCalculationResult } from '../types';

interface FormCodeGeneratorProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onLoadData?: (data: TaxWizardData) => void;
}

const FormCodeGenerator: React.FC<FormCodeGeneratorProps> = ({ 
  data, 
  result, 
  onLoadData 
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const { toast } = useToast();
  const [formCode, setFormCode] = useState<string>('');
  const [loadCode, setLoadCode] = useState<string>('');

  // Generování kódu formuláře
  const generateFormCode = () => {
    const formData = {
      personalInfo: data.personalInfo,
      employmentInfo: data.employmentInfo,
      reisepauschale: data.reisepauschale,
      deductions: data.deductions,
      result: result,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Jednoduchý hash pro kód
    const jsonString = JSON.stringify(formData);
    const hash = btoa(encodeURIComponent(jsonString)).substring(0, 12).toUpperCase();
    
    // Uložení do localStorage s kódem jako klíčem
    localStorage.setItem(`tax_form_${hash}`, jsonString);
    
    setFormCode(hash);
    return hash;
  };

  useEffect(() => {
    if (data.personalInfo.firstName && data.employmentInfo.employerName) {
      generateFormCode();
    }
  }, [data, result]);

  const copyToClipboard = async () => {
    if (!formCode) return;
    
    try {
      await navigator.clipboard.writeText(formCode);
      toast({
        title: t('wizard.formCode.copied'),
        description: t('wizard.formCode.copiedDescription'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('wizard.formCode.copyError'),
        variant: "destructive",
      });
    }
  };

  const regenerateCode = () => {
    const newCode = generateFormCode();
    toast({
      title: t('wizard.formCode.regenerated'),
      description: `${t('wizard.formCode.newCode')}: ${newCode}`,
    });
  };

  const loadFormData = () => {
    if (!loadCode.trim()) {
      toast({
        title: t('common.error'),
        description: t('wizard.formCode.enterCode'),
        variant: "destructive",
      });
      return;
    }

    try {
      const savedData = localStorage.getItem(`tax_form_${loadCode.trim().toUpperCase()}`);
      if (!savedData) {
        toast({
          title: t('common.error'),
          description: t('wizard.formCode.codeNotFound'),
          variant: "destructive",
        });
        return;
      }

      const parsedData = JSON.parse(decodeURIComponent(atob(savedData.replace(/[^A-Za-z0-9+/]/g, ''))));
      
      if (onLoadData && parsedData.personalInfo) {
        onLoadData(parsedData);
        toast({
          title: t('wizard.formCode.loaded'),
          description: t('wizard.formCode.loadedDescription'),
        });
        setLoadCode('');
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('wizard.formCode.loadError'),
        variant: "destructive",
      });
    }
  };

  const downloadBackup = () => {
    if (!formCode) return;

    const formData = {
      personalInfo: data.personalInfo,
      employmentInfo: data.employmentInfo,
      reisepauschale: data.reisepauschale,
      deductions: data.deductions,
      result: result,
      formCode: formCode,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_form_backup_${formCode}_${new Date().getFullYear()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t('wizard.formCode.downloaded'),
      description: t('wizard.formCode.downloadedDescription'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Generování kódu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            {t('wizard.formCode.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('wizard.formCode.description')}
          </p>
          
          {formCode && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="form-code">{t('wizard.formCode.yourCode')}:</Label>
                <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                  {formCode}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.copy')}
                </Button>
                <Button variant="outline" size="sm" onClick={regenerateCode}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.regenerate')}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadBackup}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.backup')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Načtení existujícího kódu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('wizard.formCode.loadTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('wizard.formCode.loadDescription')}
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="load-code">{t('wizard.formCode.enterCode')}:</Label>
              <Input
                id="load-code"
                value={loadCode}
                onChange={(e) => setLoadCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234..."
                className="font-mono"
                maxLength={12}
              />
            </div>
            <Button onClick={loadFormData} className="mt-6">
              <Upload className="h-4 w-4 mr-2" />
              {t('wizard.formCode.load')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormCodeGenerator;
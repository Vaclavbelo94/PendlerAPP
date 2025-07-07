import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Download, Upload, Save, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const { t } = useTranslation(['taxAdvisor', 'common']);
  const { toast } = useToast();
  const [formCode, setFormCode] = useState<string>('');
  const [loadCode, setLoadCode] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Migrace existujících localStorage dat do databáze
  const migrateLocalStorageData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Najít všechny lokální kódy formulářů
    const localCodes = Object.keys(localStorage).filter(key => key.startsWith('tax_form_'));
    
    for (const key of localCodes) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(decodeURIComponent(atob(data.replace(/[^A-Za-z0-9+/]/g, ''))));
          
          // Uložit do databáze
          await supabase
            .from('tax_form_drafts')
            .upsert({
              user_id: user.id,
              form_type: 'tax_wizard_legacy',
              form_data: parsedData as any
            });
          
          // Odstranit z localStorage po úspěšné migraci
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Migration error for key:', key, error);
      }
    }
  };

  // Generování kódu formuláře a uložení do databáze
  const generateAndSaveFormCode = async () => {
    if (!data.personalInfo.firstName || !data.employmentInfo.employerName) {
      return;
    }

    setIsSaving(true);
    try {
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
      
      // Uložení do databáze s použitím aktuálně přihlášeného uživatele
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('tax_form_drafts')
          .upsert({
            user_id: user.id,
            form_type: 'tax_wizard',
            form_data: formData as any
          }, {
            onConflict: 'user_id,form_type'
          });

        if (error) {
          console.error('Error saving form draft:', error);
          // Fallback na localStorage
          localStorage.setItem(`tax_form_${hash}`, jsonString);
        }
      } else {
        // Fallback na localStorage pokud není uživatel přihlášen
        localStorage.setItem(`tax_form_${hash}`, jsonString);
      }
      
      setFormCode(hash);
      return hash;
    } catch (error) {
      console.error('Error generating form code:', error);
      toast({
        title: t('error', { ns: 'common' }),
        description: t('wizard.formCode.generateError'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Spustit migraci při načtení komponenty
  useEffect(() => {
    migrateLocalStorageData();
  }, []);

  // Auto-save funkcionalita 
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (data.personalInfo.firstName && data.employmentInfo.employerName) {
        generateAndSaveFormCode();
      }
    }, 30000); // Auto-save každých 30 sekund

    return () => clearInterval(autoSaveInterval);
  }, [data, result]);

  useEffect(() => {
    if (data.personalInfo.firstName && data.employmentInfo.employerName) {
      generateAndSaveFormCode();
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
        title: t('error', { ns: 'common' }),
        description: t('wizard.formCode.copyError'),
        variant: "destructive",
      });
    }
  };

  const regenerateCode = async () => {
    const newCode = await generateAndSaveFormCode();
    if (newCode) {
      toast({
        title: t('wizard.formCode.regenerated'),
        description: `${t('wizard.formCode.newCode')}: ${newCode}`,
      });
    }
  };

  const loadFormData = async () => {
    if (!loadCode.trim()) {
      toast({
        title: t('error', { ns: 'common' }),
        description: t('wizard.formCode.enterCode'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Nejprve zkusíme databázi pro aktuálního uživatele
      const { data: { user } } = await supabase.auth.getUser();
      let formDrafts = null;
      let error = null;
      
      if (user) {
        const response = await supabase
          .from('tax_form_drafts')
          .select('form_data')
          .eq('form_type', 'tax_wizard')
          .eq('user_id', user.id)
          .maybeSingle();
        
        formDrafts = response.data;
        error = response.error;
      }

      let parsedData = null;

      if (!error && formDrafts?.form_data) {
        parsedData = formDrafts.form_data;
      } else {
        // Fallback na localStorage s konkrétním kódem
        const savedData = localStorage.getItem(`tax_form_${loadCode.trim().toUpperCase()}`);
        if (savedData) {
          try {
            parsedData = JSON.parse(decodeURIComponent(atob(savedData.replace(/[^A-Za-z0-9+/]/g, ''))));
          } catch (parseError) {
            console.error('Parse error:', parseError);
          }
        }
      }

      if (!parsedData) {
        toast({
        title: t('error', { ns: 'common' }),
          description: t('wizard.formCode.codeNotFound'),
          variant: "destructive",
        });
        return;
      }
      
      if (onLoadData && parsedData.personalInfo) {
        onLoadData(parsedData);
        toast({
          title: t('wizard.formCode.loaded'),
          description: t('wizard.formCode.loadedDescription'),
        });
        setLoadCode('');
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      toast({
        title: t('error', { ns: 'common' }),
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

  // Synchronizace dat mezi zařízeními
  const syncCrossDevice = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data: drafts, error } = await supabase
        .from('tax_form_drafts')
        .select('*')
        .eq('user_id', user.id)
        .eq('form_type', 'tax_wizard');

      if (!error && drafts && drafts.length > 0) {
        const latestDraft = drafts[0];
        if (onLoadData && latestDraft.form_data) {
          onLoadData(latestDraft.form_data as any);
          toast({
            title: t('wizard.formCode.synced'),
            description: t('wizard.formCode.syncedDescription'),
          });
        }
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generování kódu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
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
                {isSaving && (
                  <Badge variant="secondary" className="animate-pulse">
                    {t('saving', { ns: 'common' })}
                  </Badge>
                )}
                {!navigator.onLine && (
                  <Badge variant="outline" className="text-orange-600">
                    {t('offline', { ns: 'common' })}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.copy')}
                </Button>
                <Button variant="outline" size="sm" onClick={regenerateCode} disabled={isSaving}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.regenerate')}
                </Button>
                <Button variant="outline" size="sm" onClick={syncCrossDevice}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.sync')}
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

          {/* Offline support indikátor */}
          {!navigator.onLine && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                🔄 <strong>{t('wizard.formCode.offlineMode')}:</strong> {t('wizard.formCode.offlineModeDescription')}
              </p>
            </div>
          )}
          
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
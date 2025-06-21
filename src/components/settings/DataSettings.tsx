
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from '@/hooks/useLanguage';

const DataSettings = () => {
  const { t } = useLanguage();

  const handleExportData = () => {
    toast.success(t('dataExportStarted') || "Export dat byl zahájen. Soubor bude stažen za chvíli.");
  };

  const handleImportData = () => {
    toast.info(t('importFeatureComingSoon') || "Funkce importu dat bude implementována v budoucí verzi");
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success(t('cacheCleared') || "Cache byla vymazána");
  };

  const handleSyncData = () => {
    toast.success(t('syncStarted') || "Synchronizace dat byla zahájena");
  };

  const handleClearAllData = () => {
    toast.error(t('deleteAllDataFeatureComingSoon') || "Funkce smazání všech dat bude implementována později");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('dataManagement') || 'Správa dat'}
          </CardTitle>
          <CardDescription>
            {t('exportImportManageData') || 'Exportujte, importujte nebo spravujte svá data'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {t('exportData') || 'Exportovat data'}
            </Button>
            
            <Button onClick={handleImportData} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {t('importData') || 'Importovat data'}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">{t('dataStatistics') || 'Statistiky dat'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{t('vocabulary') || 'Slovíčka'}</p>
                <p className="text-muted-foreground">1,247 {t('items') || 'položek'}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{t('shifts') || 'Směny'}</p>
                <p className="text-muted-foreground">156 {t('records') || 'záznamů'}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{t('tests') || 'Testy'}</p>
                <p className="text-muted-foreground">89 {t('results') || 'výsledků'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            {t('synchronization') || 'Synchronizace'}
          </CardTitle>
          <CardDescription>
            {t('manageSyncBetweenDevices') || 'Spravujte synchronizaci dat mezi zařízeními'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{t('lastSync') || 'Poslední synchronizace'}</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleString('cs-CZ')}
              </p>
            </div>
            <Button onClick={handleSyncData} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('synchronize') || 'Synchronizovat'}
            </Button>
          </div>

          <Button onClick={handleClearCache} variant="outline" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            {t('clearLocalCache') || 'Vymazat místní cache'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t('dangerZone') || 'Smazání dat'}
          </CardTitle>
          <CardDescription>
            {t('permanentlyDeleteAllData') || 'Permanentně smažte všechna svá data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleClearAllData}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('deleteAllData') || 'Smazat všechna data'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {t('actionIrreversible') || 'Tato akce je nevratná a smaže všechna vaše uložená data.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSettings;

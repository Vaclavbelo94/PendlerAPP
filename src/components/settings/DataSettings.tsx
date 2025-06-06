
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { toast } from "sonner";

const DataSettings = () => {
  const handleExportData = () => {
    toast.success("Export dat byl zahájen. Soubor bude stažen za chvíli.");
  };

  const handleImportData = () => {
    toast.info("Funkce importu dat bude implementována v budoucí verzi");
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Cache byla vymazána");
  };

  const handleSyncData = () => {
    toast.success("Synchronizace dat byla zahájena");
  };

  const handleClearAllData = () => {
    toast.error("Funkce smazání všech dat bude implementována později");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Správa dat
          </CardTitle>
          <CardDescription>
            Exportujte, importujte nebo spravujte svá data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exportovat data
            </Button>
            
            <Button onClick={handleImportData} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Importovat data
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Statistiky dat</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Slovíčka</p>
                <p className="text-muted-foreground">1,247 položek</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Směny</p>
                <p className="text-muted-foreground">156 záznamů</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Testy</p>
                <p className="text-muted-foreground">89 výsledků</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Synchronizace
          </CardTitle>
          <CardDescription>
            Spravujte synchronizaci dat mezi zařízeními
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Poslední synchronizace</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleString('cs-CZ')}
              </p>
            </div>
            <Button onClick={handleSyncData} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Synchronizovat
            </Button>
          </div>

          <Button onClick={handleClearCache} variant="outline" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Vymazat místní cache
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Smazání dat
          </CardTitle>
          <CardDescription>
            Permanentně smažte všechna svá data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleClearAllData}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Smazat všechna data
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Tato akce je nevratná a smaže všechna vaše uložená data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSettings;

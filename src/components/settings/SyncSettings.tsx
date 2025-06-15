
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Download, Upload, Database, Cloud } from 'lucide-react';
import { toast } from "sonner";

export const SyncSettings = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState('300000'); // 5 minutes
  const [backgroundSync, setBackgroundSync] = useState(true);
  const [syncNotifications, setSyncNotifications] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('syncSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setAutoSync(parsed.autoSync ?? true);
        setSyncInterval(parsed.syncInterval ?? '300000');
        setBackgroundSync(parsed.backgroundSync ?? true);
        setSyncNotifications(parsed.syncNotifications ?? true);
        if (parsed.lastSyncTime) {
          setLastSyncTime(new Date(parsed.lastSyncTime));
        }
      } catch (error) {
        console.error('Error loading sync settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    const settings = {
      autoSync,
      syncInterval,
      backgroundSync,
      syncNotifications,
      lastSyncTime: lastSyncTime?.toISOString()
    };
    
    localStorage.setItem('syncSettings', JSON.stringify(settings));
    toast.success("Nastavení synchronizace bylo uloženo");
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      const now = new Date();
      setLastSyncTime(now);
      
      // Update localStorage with new sync time
      const currentSettings = JSON.parse(localStorage.getItem('syncSettings') || '{}');
      currentSettings.lastSyncTime = now.toISOString();
      localStorage.setItem('syncSettings', JSON.stringify(currentSettings));
      
      toast.success("Synchronizace byla dokončena");
    } catch (error) {
      toast.error("Chyba při synchronizaci");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportData = () => {
    // Create export data
    const exportData = {
      settings: {
        appearance: localStorage.getItem('appearanceSettings'),
        language: localStorage.getItem('languageSettings'),
        sync: localStorage.getItem('syncSettings'),
        notifications: localStorage.getItem('notificationSettings')
      },
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pendlerapp-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data byla exportována");
  };

  const syncIntervals = [
    { value: '60000', label: '1 minuta' },
    { value: '300000', label: '5 minut' },
    { value: '600000', label: '10 minut' },
    { value: '1800000', label: '30 minut' },
    { value: '3600000', label: '1 hodina' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Automatická synchronizace
          </CardTitle>
          <CardDescription>
            Nastavte, jak často se mají synchronizovat vaše data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoSync">Povolit automatickou synchronizaci</Label>
              <p className="text-sm text-muted-foreground">
                Data se budou synchronizovat automaticky v nastaveném intervalu
              </p>
            </div>
            <Switch
              id="autoSync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backgroundSync">Synchronizace na pozadí</Label>
              <p className="text-sm text-muted-foreground">
                Synchronizovat i když není aplikace aktivní
              </p>
            </div>
            <Switch
              id="backgroundSync"
              checked={backgroundSync}
              onCheckedChange={setBackgroundSync}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="syncNotifications">Oznámení o synchronizaci</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat stav synchronizace
              </p>
            </div>
            <Switch
              id="syncNotifications"
              checked={syncNotifications}
              onCheckedChange={setSyncNotifications}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="syncInterval">Interval synchronizace</Label>
            <Select value={syncInterval} onValueChange={setSyncInterval} disabled={!autoSync}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte interval" />
              </SelectTrigger>
              <SelectContent>
                {syncIntervals.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Ruční synchronizace
          </CardTitle>
          <CardDescription>
            Synchronizujte data okamžitě nebo zobrazte stav
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Poslední synchronizace</p>
              <p className="text-sm text-muted-foreground">
                {lastSyncTime ? lastSyncTime.toLocaleString('cs-CZ') : 'Nikdy'}
              </p>
            </div>
            <Button 
              onClick={handleManualSync} 
              disabled={isSyncing}
              className="min-w-32"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Synchronizuji...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchronizovat
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Správa dat
          </CardTitle>
          <CardDescription>
            Exportujte nebo importujte svá nastavení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="outline" className="h-12">
              <Download className="h-4 w-4 mr-2" />
              Exportovat nastavení
            </Button>
            
            <Button variant="outline" className="h-12" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Importovat nastavení
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Exportovaná nastavení obsahují všechny vaše preference, 
              ale neobsahují osobní data jako hesla nebo citlivé informace.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="min-w-32">
          Uložit změny
        </Button>
      </div>
    </div>
  );
};

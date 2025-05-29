import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Wifi, BellRing, Download, HardDrive, Trash2 } from 'lucide-react';
import { toast } from "sonner";

const DeviceSettings = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [dataCompression, setDataCompression] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    // Load device settings and calculate storage
    const loadSettings = () => {
      const saved = localStorage.getItem('deviceSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPushNotifications(parsed.pushNotifications ?? true);
          setOfflineMode(parsed.offlineMode ?? false);
          setAutoDownload(parsed.autoDownload ?? true);
          setDataCompression(parsed.dataCompression ?? false);
        } catch (error) {
          console.error('Error loading device settings:', error);
        }
      }
      
      // Calculate storage usage
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length;
        }
      }
      setStorageUsed(Math.round(total / 1024)); // KB
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const deviceSettings = {
        pushNotifications,
        offlineMode,
        autoDownload,
        dataCompression
      };
      
      localStorage.setItem('deviceSettings', JSON.stringify(deviceSettings));
      toast.success("Nastavení zařízení byla uložena");
    } catch (error) {
      console.error('Error saving device settings:', error);
      toast.error("Chyba při ukládání nastavení");
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      // Clear various caches but keep important settings
      const keysToKeep = ['deviceSettings', 'auth_session', 'theme'];
      const keysToRemove: string[] = [];
      
      for (let key in localStorage) {
        if (!keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      sessionStorage.clear();
      
      // Clear service worker cache if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      setStorageUsed(0);
      toast.success("Cache byla vymazána");
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error("Chyba při mazání cache");
    } finally {
      setLoading(false);
    }
  };

  const downloadOfflineData = async () => {
    if (!offlineMode) {
      toast.info("Nejprve povolte offline režim");
      return;
    }
    
    setLoading(true);
    try {
      // Simulate downloading offline data
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Offline data byla stažena");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Nastavení zařízení
          </CardTitle>
          <CardDescription>
            Konfigurace pro mobilní zařízení a offline režim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Push notifikace
              </Label>
              <p className="text-sm text-muted-foreground">
                Povoluje zasílání upozornění na zařízení
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="offlineMode" className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Offline režim
              </Label>
              <p className="text-sm text-muted-foreground">
                Umožňuje používání aplikace bez internetového připojení
              </p>
            </div>
            <Switch
              id="offlineMode"
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoDownload" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Automatické stahování
              </Label>
              <p className="text-sm text-muted-foreground">
                Automaticky stahuje obsah pro offline použití
              </p>
            </div>
            <Switch
              id="autoDownload"
              checked={autoDownload}
              onCheckedChange={setAutoDownload}
              disabled={!offlineMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dataCompression" className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Komprese dat
              </Label>
              <p className="text-sm text-muted-foreground">
                Šetří datový objem kompresí přenášených dat
              </p>
            </div>
            <Switch
              id="dataCompression"
              checked={dataCompression}
              onCheckedChange={setDataCompression}
            />
          </div>

          {offlineMode && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Offline data</Label>
                <div className="flex gap-2">
                  <Button 
                    onClick={downloadOfflineData} 
                    disabled={loading}
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {loading ? "Stahuji..." : "Stáhnout offline data"}
                  </Button>
                  <Badge variant="secondary">
                    {autoDownload ? "Auto-sync zapnutý" : "Ruční režim"}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Úložiště a cache</CardTitle>
          <CardDescription>
            Správa místního úložiště aplikace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Použité úložiště</span>
              <span className="text-sm text-muted-foreground">{storageUsed} KB</span>
            </div>
            <Progress value={Math.min((storageUsed / 1000) * 100, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Doporučeno vymazat cache při dosažení 500 KB
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={clearCache} 
              disabled={loading}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? "Mažu..." : "Vymazat cache"}
            </Button>
            
            {storageUsed > 500 && (
              <Badge variant="destructive" className="ml-auto">
                Doporučeno vymazat
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? "Ukládám..." : "Uložit nastavení"}
        </Button>
      </div>
    </div>
  );
};

export default DeviceSettings;

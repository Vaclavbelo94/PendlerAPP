
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Wifi, BellRing, Download, HardDrive } from 'lucide-react';
import { toast } from "sonner";

const DeviceSettings = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [dataCompression, setDataCompression] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load device settings from localStorage on mount
    const savedDeviceSettings = localStorage.getItem('deviceSettings');
    if (savedDeviceSettings) {
      try {
        const parsed = JSON.parse(savedDeviceSettings);
        setPushNotifications(parsed.pushNotifications ?? true);
        setOfflineMode(parsed.offlineMode ?? false);
        setAutoDownload(parsed.autoDownload ?? true);
        setDataCompression(parsed.dataCompression ?? false);
      } catch (error) {
        console.error('Error loading device settings:', error);
      }
    }
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
      // Clear various caches
      localStorage.removeItem('cachedData');
      sessionStorage.clear();
      
      // Clear service worker cache if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      toast.success("Cache byla vymazána");
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error("Chyba při mazání cache");
    } finally {
      setLoading(false);
    }
  };

  const getStorageUsage = () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length;
        }
      }
      return (total / 1024).toFixed(2); // KB
    } catch (error) {
      return "0";
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
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Použité úložiště</p>
              <p className="text-sm text-muted-foreground">
                {getStorageUsage()} KB v místním úložišti
              </p>
            </div>
            <Button variant="outline" onClick={clearCache} disabled={loading}>
              {loading ? "Mažu..." : "Vymazat cache"}
            </Button>
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

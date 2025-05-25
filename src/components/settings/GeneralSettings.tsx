
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Smartphone, Wifi, Battery } from 'lucide-react';
import { toast } from "sonner";
import { useSyncSettings } from "@/hooks/useSyncSettings";

const GeneralSettings = () => {
  const { settings: syncSettings, updateSettings: updateSyncSettings, loading: syncLoading } = useSyncSettings();
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [defaultView, setDefaultView] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load general settings from localStorage on mount
    const savedGeneralSettings = localStorage.getItem('generalSettings');
    if (savedGeneralSettings) {
      try {
        const parsed = JSON.parse(savedGeneralSettings);
        setAutoSave(parsed.autoSave ?? true);
        setCompactMode(parsed.compactMode ?? false);
        setAutoRefresh(parsed.autoRefresh ?? true);
        setDefaultView(parsed.defaultView ?? "dashboard");
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const generalSettings = {
        autoSave,
        compactMode,
        autoRefresh,
        defaultView
      };
      
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      toast.success("Obecná nastavení byla uložena");
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error("Chyba při ukládání nastavení");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setAutoSave(true);
    setCompactMode(false);
    setAutoRefresh(true);
    setDefaultView("dashboard");
    localStorage.removeItem('generalSettings');
    toast.success("Nastavení byla resetována na výchozí hodnoty");
  };

  const formatLastSyncTime = (lastSyncTime?: string) => {
    if (!lastSyncTime) return 'Nikdy';
    try {
      return new Date(lastSyncTime).toLocaleString('cs-CZ');
    } catch (error) {
      return 'Neznámý';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Obecná nastavení
          </CardTitle>
          <CardDescription>
            Základní předvolby aplikace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoSave">Automatické ukládání</Label>
              <p className="text-sm text-muted-foreground">
                Automaticky ukládá změny při editaci
              </p>
            </div>
            <Switch
              id="autoSave"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactMode" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Kompaktní režim
              </Label>
              <p className="text-sm text-muted-foreground">
                Zmenší rozložení pro lepší využití prostoru
              </p>
            </div>
            <Switch
              id="compactMode"
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoRefresh" className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Automatické obnovování
              </Label>
              <p className="text-sm text-muted-foreground">
                Pravidelně aktualizuje data v pozadí
              </p>
            </div>
            <Switch
              id="autoRefresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="defaultView">Výchozí zobrazení</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte výchozí stránku" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="shifts">Moje směny</SelectItem>
                <SelectItem value="vocabulary">Slovník</SelectItem>
                <SelectItem value="profile">Profil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4" />
              <span className="font-medium">Synchronizace</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Nastavení synchronizace dat mezi zařízeními
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableBackgroundSync">Synchronizace na pozadí</Label>
                  <p className="text-xs text-muted-foreground">
                    Automaticky synchronizuje data na pozadí
                  </p>
                </div>
                <Switch
                  id="enableBackgroundSync"
                  checked={syncSettings.enableBackgroundSync}
                  onCheckedChange={(checked) => 
                    updateSyncSettings({ enableBackgroundSync: checked })
                  }
                  disabled={syncLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showSyncNotifications">Oznámení synchronizace</Label>
                  <p className="text-xs text-muted-foreground">
                    Zobrazuje oznámení o stavu synchronizace
                  </p>
                </div>
                <Switch
                  id="showSyncNotifications"
                  checked={syncSettings.showSyncNotifications}
                  onCheckedChange={(checked) => 
                    updateSyncSettings({ showSyncNotifications: checked })
                  }
                  disabled={syncLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Poslední synchronizace</span>
                <span className="text-sm text-muted-foreground">
                  {formatLastSyncTime(syncSettings.lastSyncTime)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? "Ukládám..." : "Uložit nastavení"}
        </Button>
        <Button variant="outline" onClick={handleResetSettings}>
          Resetovat na výchozí
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;

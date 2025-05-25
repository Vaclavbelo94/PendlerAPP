
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Smartphone, Wifi, Battery } from 'lucide-react';
import { toast } from "sonner";

interface GeneralSettingsProps {
  syncSettings: any;
  updateSyncSettings: (settings: any) => void;
}

const GeneralSettings = ({ syncSettings, updateSyncSettings }: GeneralSettingsProps) => {
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [defaultView, setDefaultView] = useState("dashboard");

  const handleSaveSettings = () => {
    const settings = {
      autoSave,
      compactMode,
      autoRefresh,
      defaultView
    };
    
    localStorage.setItem('generalSettings', JSON.stringify(settings));
    toast.success("Obecná nastavení byla uložena");
  };

  const handleResetSettings = () => {
    setAutoSave(true);
    setCompactMode(false);
    setAutoRefresh(true);
    setDefaultView("dashboard");
    localStorage.removeItem('generalSettings');
    toast.success("Nastavení byla resetována na výchozí hodnoty");
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
            <div className="flex items-center justify-between">
              <span className="text-sm">Poslední synchronizace</span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleString('cs-CZ')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSaveSettings}>
          Uložit nastavení
        </Button>
        <Button variant="outline" onClick={handleResetSettings}>
          Resetovat na výchozí
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;

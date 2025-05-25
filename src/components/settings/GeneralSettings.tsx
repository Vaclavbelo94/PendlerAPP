
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Zap, Download } from 'lucide-react';
import { toast } from "sonner";
import { SyncSettings } from '@/hooks/useSyncSettings';

interface GeneralSettingsProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
}

const GeneralSettings = ({ syncSettings, updateSyncSettings }: GeneralSettingsProps) => {
  const [autoSave, setAutoSave] = useState(true);
  const [defaultView, setDefaultView] = useState("dashboard");
  const [itemsPerPage, setItemsPerPage] = useState("20");

  const handleSaveSettings = () => {
    // Save general settings logic would go here
    toast.success("Obecná nastavení byla uložena");
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
            Základní nastavení pro chování aplikace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoSave">Automatické ukládání</Label>
              <p className="text-sm text-muted-foreground">
                Automaticky uložit změny při opuštění stránky
              </p>
            </div>
            <Switch
              id="autoSave"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="defaultView">Výchozí pohled po přihlášení</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte výchozí stránku" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="shifts">Směny</SelectItem>
                <SelectItem value="vocabulary">Slovíčka</SelectItem>
                <SelectItem value="calculator">Kalkulačka</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemsPerPage">Počet položek na stránku</Label>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte počet položek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 položek</SelectItem>
                <SelectItem value="20">20 položek</SelectItem>
                <SelectItem value="50">50 položek</SelectItem>
                <SelectItem value="100">100 položek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Synchronizace
          </CardTitle>
          <CardDescription>
            Nastavení pro synchronizaci dat mezi zařízeními
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backgroundSync">Synchronizace na pozadí</Label>
              <p className="text-sm text-muted-foreground">
                Synchronizovat data automaticky na pozadí
              </p>
            </div>
            <Switch
              id="backgroundSync"
              checked={syncSettings.enableBackgroundSync}
              onCheckedChange={(checked) => updateSyncSettings({ enableBackgroundSync: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="syncNotifications">Oznámení o synchronizaci</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat oznámení o stavu synchronizace
              </p>
            </div>
            <Switch
              id="syncNotifications"
              checked={syncSettings.showSyncNotifications}
              onCheckedChange={(checked) => updateSyncSettings({ showSyncNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Offline režim
          </CardTitle>
          <CardDescription>
            Nastavení pro práci bez internetového připojení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="offlineMode">Povolit offline režim</Label>
              <p className="text-sm text-muted-foreground">
                Umožnit používání aplikace bez internetového připojení
              </p>
            </div>
            <Switch id="offlineMode" defaultChecked />
          </div>

          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Stáhnout data pro offline použití
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Uložit nastavení
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;

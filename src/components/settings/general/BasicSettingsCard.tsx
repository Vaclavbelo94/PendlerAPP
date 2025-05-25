
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Smartphone, Wifi } from 'lucide-react';

interface BasicSettingsCardProps {
  autoSave: boolean;
  setAutoSave: (value: boolean) => void;
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  defaultView: string;
  setDefaultView: (value: string) => void;
}

const BasicSettingsCard = ({
  autoSave,
  setAutoSave,
  compactMode,
  setCompactMode,
  autoRefresh,
  setAutoRefresh,
  defaultView,
  setDefaultView
}: BasicSettingsCardProps) => {
  return (
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
      </CardContent>
    </Card>
  );
};

export default BasicSettingsCard;

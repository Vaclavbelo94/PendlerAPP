
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from 'lucide-react';

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

const BasicSettingsCard: React.FC<BasicSettingsCardProps> = ({
  autoSave,
  setAutoSave,
  compactMode,
  setCompactMode,
  autoRefresh,
  setAutoRefresh,
  defaultView,
  setDefaultView
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Základní nastavení
        </CardTitle>
        <CardDescription>
          Obecné nastavení chování aplikace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Automatické ukládání</Label>
            <p className="text-sm text-muted-foreground">
              Automaticky ukládat změny bez potvrzení
            </p>
          </div>
          <Switch
            id="autoSave"
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="compactMode">Kompaktní režim</Label>
            <p className="text-sm text-muted-foreground">
              Menší rozestupy a kompaktnější UI prvky
            </p>
          </div>
          <Switch
            id="compactMode"
            checked={compactMode}
            onCheckedChange={setCompactMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoRefresh">Automatické obnovování</Label>
            <p className="text-sm text-muted-foreground">
              Automaticky obnovovat data v pravidelných intervalech
            </p>
          </div>
          <Switch
            id="autoRefresh"
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultView">Výchozí zobrazení</Label>
          <Select value={defaultView} onValueChange={setDefaultView}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte výchozí stránku" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="shifts">Směny</SelectItem>
              <SelectItem value="vehicles">Vozidla</SelectItem>
              <SelectItem value="language">Výuka němčiny</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicSettingsCard;

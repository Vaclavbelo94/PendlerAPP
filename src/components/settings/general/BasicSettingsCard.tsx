
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('basicSettings') || 'Základní nastavení'}
        </CardTitle>
        <CardDescription>
          {t('generalAppSettings') || 'Obecné nastavení chování aplikace'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">{t('autoSave') || 'Automatické ukládání'}</Label>
            <p className="text-sm text-muted-foreground">
              {t('autoSaveDesc') || 'Automaticky ukládat změny bez potvrzení'}
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
            <Label htmlFor="compactMode">{t('compactMode') || 'Kompaktní režim'}</Label>
            <p className="text-sm text-muted-foreground">
              {t('compactModeDesc') || 'Menší rozestupy a kompaktnější UI prvky'}
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
            <Label htmlFor="autoRefresh">{t('autoRefresh') || 'Automatické obnovování'}</Label>
            <p className="text-sm text-muted-foreground">
              {t('autoRefreshDesc') || 'Automaticky obnovovat data v pravidelných intervalech'}
            </p>
          </div>
          <Switch
            id="autoRefresh"
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultView">{t('defaultView') || 'Výchozí zobrazení'}</Label>
          <Select value={defaultView} onValueChange={setDefaultView}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectDefaultPage') || 'Vyberte výchozí stránku'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">{t('dashboard') || 'Dashboard'}</SelectItem>
              <SelectItem value="shifts">{t('shifts') || 'Směny'}</SelectItem>
              <SelectItem value="vehicles">{t('vehicles') || 'Vozidla'}</SelectItem>
              <SelectItem value="vocabulary">{t('vocabulary') || 'Slovníček'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicSettingsCard;

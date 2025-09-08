import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SystemConfig {
  id?: string;
  config_key: string;
  config_value: any;
  description?: string;
}

export const MobileSettings: React.FC = () => {
  const { hasPermission } = useAdminV2();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState({
    notifications_enabled: true,
    maintenance_mode: false,
    registration_enabled: true,
    premium_codes_enabled: true,
    max_login_attempts: 5,
    session_timeout_minutes: 60,
    backup_frequency_hours: 24
  });

  const { data: systemConfig, isLoading } = useQuery({
    queryKey: ['mobile-admin-system-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .order('config_key');

      if (error) throw error;
      
      // Transform array to object for easier handling
      const configObj = data.reduce((acc: any, item: any) => {
        acc[item.config_key] = item.config_value;
        return acc;
      }, {});

      return { raw: data, config: configObj };
    },
    enabled: hasPermission('admin')
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      // Update or insert system config entries
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_config')
        .upsert(updates, { onConflict: 'config_key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-admin-system-config'] });
      toast.success('Nastavení bylo uloženo');
    },
    onError: () => {
      toast.error('Nepodařilo se uložit nastavení');
    }
  });

  const handleSave = () => {
    updateConfigMutation.mutate(settings);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!hasPermission('admin')) {
    return (
      <div className="p-4 text-center">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nemáte oprávnění ke správě systémových nastavení.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Nastavení
        </h1>
        <Button 
          onClick={handleSave}
          disabled={updateConfigMutation.isPending}
        >
          {updateConfigMutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Uložit
        </Button>
      </div>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Systémová nastavení
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Režim údržby</Label>
              <p className="text-sm text-muted-foreground">
                Zakáže přístup pro běžné uživatele
              </p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => handleSettingChange('maintenance_mode', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Povolené registrace</Label>
              <p className="text-sm text-muted-foreground">
                Umožní novým uživatelům registraci
              </p>
            </div>
            <Switch
              checked={settings.registration_enabled}
              onCheckedChange={(checked) => handleSettingChange('registration_enabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Premium kódy</Label>
              <p className="text-sm text-muted-foreground">
                Povolí používání premium kódů
              </p>
            </div>
            <Switch
              checked={settings.premium_codes_enabled}
              onCheckedChange={(checked) => handleSettingChange('premium_codes_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bezpečnost
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max_login_attempts">Maximální počet pokusů o přihlášení</Label>
            <Input
              id="max_login_attempts"
              type="number"
              min="3"
              max="10"
              value={settings.max_login_attempts}
              onChange={(e) => handleSettingChange('max_login_attempts', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session_timeout">Timeout relace (minuty)</Label>
            <Input
              id="session_timeout"
              type="number"
              min="15"
              max="480"
              value={settings.session_timeout_minutes}
              onChange={(e) => handleSettingChange('session_timeout_minutes', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifikace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Systémové notifikace</Label>
              <p className="text-sm text-muted-foreground">
                Odesílání notifikací uživatelům
              </p>
            </div>
            <Switch
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => handleSettingChange('notifications_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Zálohy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup_frequency">Frekvence zálohování (hodiny)</Label>
            <Input
              id="backup_frequency"
              type="number"
              min="1"
              max="168"
              value={settings.backup_frequency_hours}
              onChange={(e) => handleSettingChange('backup_frequency_hours', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Jak často se vytváří automatické zálohy databáze
            </p>
          </div>
        </CardContent>
      </Card>

      {/* UI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Vzhled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Nastavení vzhledu bude dostupné v další verzi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Display */}
      {isLoading ? (
        <Card>
          <CardContent className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Aktuální konfigurace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(systemConfig?.config || {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
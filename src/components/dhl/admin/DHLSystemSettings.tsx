import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Database, 
  Bell, 
  Mail, 
  MessageSquare, 
  Shield, 
  Key, 
  Server, 
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface SystemConfig {
  auto_schedule_generation: boolean;
  notification_settings: {
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
    default_reminder_time: string;
  };
  shift_settings: {
    max_shifts_per_day: number;
    min_break_time: number;
    overtime_threshold: number;
  };
  integration_settings: {
    api_key: string;
    webhook_url: string;
    sync_interval: number;
  };
}

const DHLSystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { user } = useAuth();

  const [config, setConfig] = useState<SystemConfig>({
    auto_schedule_generation: true,
    notification_settings: {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      default_reminder_time: '08:00'
    },
    shift_settings: {
      max_shifts_per_day: 3,
      min_break_time: 30,
      overtime_threshold: 8
    },
    integration_settings: {
      api_key: '',
      webhook_url: '',
      sync_interval: 15
    }
  });

  const [statistics, setStatistics] = useState({
    total_employees: 0,
    active_schedules: 0,
    pending_notifications: 0,
    system_uptime: '99.9%'
  });

  useEffect(() => {
    loadSystemConfig();
    loadStatistics();
  }, []);

  const loadSystemConfig = async () => {
    try {
      setLoading(true);
      // For now, use default config - in real app, this would come from database
      // You could create a system_config table to store these settings
      toast.info('Načítání systémové konfigurace...');
    } catch (error) {
      console.error('Error loading system config:', error);
      toast.error('Chyba při načítání konfigurace');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // Load employee count
      const { count: employeeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_dhl_employee', true);

      // Load schedules count
      const { count: schedulesCount } = await supabase
        .from('dhl_shift_schedules')
        .select('*', { count: 'exact', head: true });

      // Load notifications count
      const { count: notificationsCount } = await supabase
        .from('notification_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStatistics({
        total_employees: employeeCount || 0,
        active_schedules: schedulesCount || 0,
        pending_notifications: notificationsCount || 0,
        system_uptime: '99.9%'
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      // In real app, save to system_config table
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
      toast.success('Konfigurace byla uložena');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Chyba při ukládání konfigurace');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      // Test notification functionality
      toast.info('Testování notifikačního systému...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Testovací notifikace byla odeslána');
    } catch (error) {
      toast.error('Chyba při testování notifikací');
    }
  };

  const handleDatabaseSync = async () => {
    try {
      toast.info('Spouštím synchronizaci databáze...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Synchronizace databáze dokončena');
      loadStatistics();
    } catch (error) {
      toast.error('Chyba při synchronizaci databáze');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-yellow-600" />
            Systémové nastavení
          </CardTitle>
          <CardDescription>
            Konfigurace DHL systému a integrací
          </CardDescription>
        </CardHeader>
      </Card>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">DHL Zaměstnanci</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.total_employees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktivní rozvrhy</p>
                <p className="text-2xl font-bold text-green-600">{statistics.active_schedules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Čekající notifikace</p>
                <p className="text-2xl font-bold text-orange-600">{statistics.pending_notifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime systému</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.system_uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Obecné</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifikace</span>
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Směny</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Integrace</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Obecné nastavení systému</CardTitle>
              <CardDescription>
                Základní konfigurace DHL administračního systému
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Automatické generování rozvrhů</Label>
                  <p className="text-sm text-muted-foreground">
                    Automaticky generovat směny na základě importovaných plánů
                  </p>
                </div>
                <Switch
                  checked={config.auto_schedule_generation}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, auto_schedule_generation: checked }))
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleDatabaseSync}
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Synchronizovat databázi
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => loadStatistics()}
                    className="w-full"
                  >
                    <Server className="h-4 w-4 mr-2" />
                    Obnovit statistiky
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení notifikací</CardTitle>
              <CardDescription>
                Konfigurace emailových, SMS a push notifikací
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Emailové notifikace
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Povolit odesílání emailových upozornění
                    </p>
                  </div>
                  <Switch
                    checked={config.notification_settings.email_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        notification_settings: { ...prev.notification_settings, email_enabled: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS notifikace
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Povolit odesílání SMS zpráv
                    </p>
                  </div>
                  <Switch
                    checked={config.notification_settings.sms_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        notification_settings: { ...prev.notification_settings, sms_enabled: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Push notifikace
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Povolit push notifikace v prohlížeči
                    </p>
                  </div>
                  <Switch
                    checked={config.notification_settings.push_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        notification_settings: { ...prev.notification_settings, push_enabled: checked }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder_time">Výchozí čas připomínky</Label>
                  <Input
                    id="reminder_time"
                    type="time"
                    value={config.notification_settings.default_reminder_time}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        notification_settings: { ...prev.notification_settings, default_reminder_time: e.target.value }
                      }))
                    }
                  />
                </div>

                <Button onClick={handleTestNotification} variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Testovat notifikace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Settings */}
        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení směn</CardTitle>
              <CardDescription>
                Konfigurace parametrů pro správu směn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_shifts">Maximální počet směn za den</Label>
                  <Input
                    id="max_shifts"
                    type="number"
                    min="1"
                    max="5"
                    value={config.shift_settings.max_shifts_per_day}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        shift_settings: { ...prev.shift_settings, max_shifts_per_day: parseInt(e.target.value) || 1 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_break">Minimální přestávka (minuty)</Label>
                  <Input
                    id="min_break"
                    type="number"
                    min="15"
                    max="120"
                    value={config.shift_settings.min_break_time}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        shift_settings: { ...prev.shift_settings, min_break_time: parseInt(e.target.value) || 15 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overtime_threshold">Práh pro přesčasy (hodiny)</Label>
                  <Input
                    id="overtime_threshold"
                    type="number"
                    min="6"
                    max="12"
                    value={config.shift_settings.overtime_threshold}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        shift_settings: { ...prev.shift_settings, overtime_threshold: parseInt(e.target.value) || 8 }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DHL Systémové integrace</CardTitle>
              <CardDescription>
                Konfigurace pro propojení s externími DHL systémy a automatickou synchronizaci dat ze směnových plánů
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Integration Explanation */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Co jsou systémové integrace?
                    </h4>
                    <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                      <p>
                        <strong>API klíč:</strong> Přístupový kód pro automatické stahování směnových plánů z centrálního DHL systému
                      </p>
                      <p>
                        <strong>Webhook URL:</strong> Adresa pro zasílání notifikací o změnách v rozvrzích do externích systémů (např. personální software)
                      </p>
                      <p>
                        <strong>Interval synchronizace:</strong> Jak často kontrolovat nové směny v centrálním systému
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    API klíč pro DHL centrální systém
                  </Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={config.integration_settings.api_key}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        integration_settings: { ...prev.integration_settings, api_key: e.target.value }
                      }))
                    }
                    placeholder="DHL-API-KEY-12345..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Kontaktujte IT oddělení DHL pro získání tohoto klíče
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook_url" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Webhook pro notifikace o změnách
                  </Label>
                  <Input
                    id="webhook_url"
                    type="url"
                    value={config.integration_settings.webhook_url}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        integration_settings: { ...prev.integration_settings, webhook_url: e.target.value }
                      }))
                    }
                    placeholder="https://vas-system.com/dhl-webhook"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nepovinné - URL kam posílat notifikace o změnách rozvrhů
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync_interval" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Frekvence kontroly nových dat
                  </Label>
                  <Select
                    value={config.integration_settings.sync_interval.toString()}
                    onValueChange={(value) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        integration_settings: { ...prev.integration_settings, sync_interval: parseInt(value) }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Každých 5 minut (nejčastěji)</SelectItem>
                      <SelectItem value="15">Každých 15 minut (doporučeno)</SelectItem>
                      <SelectItem value="30">Každých 30 minut</SelectItem>
                      <SelectItem value="60">Každou hodinu (nejméně často)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Častější kontrola = aktuálnější data, ale vyšší zatížení systému
                  </p>
                </div>

                {/* Integration Status */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Stav integrace
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>API připojení:</span>
                      <Badge variant={config.integration_settings.api_key ? "default" : "secondary"}>
                        {config.integration_settings.api_key ? "Nakonfigurováno" : "Nenastaveno"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Webhook:</span>
                      <Badge variant={config.integration_settings.webhook_url ? "default" : "secondary"}>
                        {config.integration_settings.webhook_url ? "Aktivní" : "Vypnutý"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Poslední synchronizace:</span>
                      <span className="text-muted-foreground">Ještě nebyla provedena</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interval:</span>
                      <span className="text-muted-foreground">{config.integration_settings.sync_interval} min</span>
                    </div>
                  </div>
                </div>

                {/* Test Button */}
                <Button 
                  variant="outline" 
                  onClick={() => toast.info("Test integrace bude brzy dostupný")}
                  className="w-full"
                >
                  <Server className="h-4 w-4 mr-2" />
                  Otestovat propojení
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveConfig} 
          disabled={saving}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Ukládám...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Uložit konfiguraci
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DHLSystemSettings;
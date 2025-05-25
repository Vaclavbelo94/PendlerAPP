
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Clock, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface EmailSettings {
  enabled: boolean;
  shiftReminders: boolean;
  weeklyReports: boolean;
  reminderHours: number;
}

export const EmailNotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<EmailSettings>({
    enabled: true,
    shiftReminders: true,
    weeklyReports: false,
    reminderHours: 24
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_extended_profiles')
        .select('email_notifications, shift_notifications, language_reminders')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading email settings:', error);
        return;
      }

      if (data) {
        setSettings(prev => ({
          ...prev,
          enabled: data.email_notifications ?? true,
          shiftReminders: data.shift_notifications ?? true
        }));
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_extended_profiles')
        .upsert({
          user_id: user.id,
          email_notifications: settings.enabled,
          shift_notifications: settings.shiftReminders,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Nastavení uloženo",
        description: "Email notifikace byly úspěšně nastaveny"
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit nastavení emailových notifikací",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = <K extends keyof EmailSettings>(key: K, value: EmailSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email oznámení
        </CardTitle>
        <CardDescription>
          Spravujte nastavení emailových notifikací
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-enabled">Povolit email oznámení</Label>
            <p className="text-sm text-muted-foreground">
              Dostávat důležitá upozornění e-mailem
            </p>
          </div>
          <Switch
            id="email-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shift-reminders" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Připomenutí směn
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dostávat upozornění před začátkem směny
                </p>
              </div>
              <Switch
                id="shift-reminders"
                checked={settings.shiftReminders}
                onCheckedChange={(checked) => updateSetting('shiftReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-reports" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Týdenní reporty
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dostávat souhrn týdne každý pátek
                </p>
              </div>
              <Switch
                id="weekly-reports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-hours">Čas připomenutí před směnou</Label>
              <Select 
                value={settings.reminderHours.toString()} 
                onValueChange={(value) => updateSetting('reminderHours', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte čas připomenutí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hodina</SelectItem>
                  <SelectItem value="4">4 hodiny</SelectItem>
                  <SelectItem value="24">24 hodin</SelectItem>
                  <SelectItem value="48">48 hodin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={isLoading}>
            {isLoading ? 'Ukládání...' : 'Uložit nastavení'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

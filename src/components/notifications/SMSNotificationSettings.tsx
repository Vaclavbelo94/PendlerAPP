import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone, Clock, TestTube } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const SMSNotificationSettings = () => {
  const { user } = useAuth();
  const { t } = useTranslation('settings');
  const [preferences, setPreferences] = useState<any>(null);
  const [workData, setWorkData] = useState<any>(null);
  const [testPhone, setTestPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
      loadWorkData();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_work_data')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading work data:', error);
        return;
      }

      setWorkData(data);
      if (data?.phone_number) {
        setTestPhone(`+${data.phone_country_code || '420'}${data.phone_number}`);
      }
    } catch (error) {
      console.error('Error loading work data:', error);
    }
  };

  const updatePreference = async (field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user?.id,
          [field]: value
        });

      if (error) throw error;

      setPreferences(prev => ({ ...prev, [field]: value }));
      toast.success(t('settingsUpdated'));
    } catch (error) {
      console.error('Error updating preference:', error);
      toast.error(t('errorUpdatingSettings'));
    }
  };

  const sendTestSMS = async () => {
    if (!testPhone) {
      toast.error('Zadejte telefonní číslo');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumber: testPhone,
          message: '🚚 TEST: Testovací SMS z Pendler Assistant. Vaše notifikace fungují správně!',
          userId: user?.id,
          smsType: 'test'
        }
      });

      if (error) throw error;

      toast.success('Testovací SMS byla odeslána!');
    } catch (error) {
      console.error('Error sending test SMS:', error);
      toast.error('Odeslání SMS se nezdařilo: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('smsNotifications')}
        </CardTitle>
        <CardDescription>
          Nastavení SMS upozornění na změny směn a připomínky
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sms-enabled">Povolit SMS upozornění</Label>
            <p className="text-sm text-muted-foreground">
              Příjem SMS zpráv o změnách směn a připomínkách
            </p>
          </div>
          <Switch
            id="sms-enabled"
            checked={preferences?.sms_notifications || false}
            onCheckedChange={(checked) => updatePreference('sms_notifications', checked)}
          />
        </div>

        {preferences?.sms_notifications && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Předstih SMS připomínky
              </Label>
              <Select
                value={preferences?.sms_reminder_advance?.toString() || '30'}
                onValueChange={(value) => updatePreference('sms_reminder_advance', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minut před směnou</SelectItem>
                  <SelectItem value="30">30 minut před směnou</SelectItem>
                  <SelectItem value="60">1 hodina před směnou</SelectItem>
                  <SelectItem value="120">2 hodiny před směnou</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="immediate-sms">Okamžité SMS při změnách</Label>
                <p className="text-sm text-muted-foreground">
                  SMS se odešle okamžitě při změně času směny
                </p>
              </div>
              <Switch
                id="immediate-sms"
                checked={preferences?.immediate_notifications || false}
                onCheckedChange={(checked) => updatePreference('immediate_notifications', checked)}
              />
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Testovací SMS
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="+420123456789"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendTestSMS} 
                    disabled={sending || !testPhone}
                    variant="outline"
                  >
                    {sending ? 'Odesílá...' : 'Test SMS'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Telefonní číslo z profilu: {workData?.phone_number ? `+${workData.phone_country_code}${workData.phone_number}` : 'Není nastaveno'}
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">ℹ️ Informace o SMS</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Denní limit: 5 SMS na uživatele</li>
                <li>• SMS se odesílají zdarma pomocí FreeSMS API</li>
                <li>• Priorita: Push → SMS → Email</li>
                <li>• Okamžité SMS při změnách od DHL Admin</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
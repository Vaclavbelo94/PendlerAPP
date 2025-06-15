
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Clock, Calendar } from 'lucide-react';
import { toast } from "sonner";

export const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setEmailNotifications(parsed.emailNotifications ?? true);
        setPushNotifications(parsed.pushNotifications ?? true);
        setShiftReminders(parsed.shiftReminders ?? true);
        setWeeklyReports(parsed.weeklyReports ?? false);
        setSystemUpdates(parsed.systemUpdates ?? true);
        setMarketingEmails(parsed.marketingEmails ?? false);
        setReminderTime(parsed.reminderTime ?? '08:00');
        setQuietHoursEnabled(parsed.quietHoursEnabled ?? false);
        setQuietHoursStart(parsed.quietHoursStart ?? '22:00');
        setQuietHoursEnd(parsed.quietHoursEnd ?? '07:00');
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    const settings = {
      emailNotifications,
      pushNotifications,
      shiftReminders,
      weeklyReports,
      systemUpdates,
      marketingEmails,
      reminderTime,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast.success("Nastavení oznámení bylo uloženo");
  };

  const handleTestNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('PendlerApp', {
          body: 'Toto je testovací oznámení',
          icon: '/favicon.ico'
        });
        toast.success("Testovací oznámení bylo odesláno");
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('PendlerApp', {
              body: 'Toto je testovací oznámení',
              icon: '/favicon.ico'
            });
            toast.success("Testovací oznámení bylo odesláno");
          }
        });
      } else {
        toast.error("Oznámení jsou zakázána v prohlížeči");
      }
    } else {
      toast.error("Váš prohlížeč nepodporuje oznámení");
    }
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push({ value: time, label: time });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Typy oznámení
          </CardTitle>
          <CardDescription>
            Vyberte, jaké oznámení chcete dostávat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">E-mailová oznámení</Label>
              <p className="text-sm text-muted-foreground">
                Dostávat oznámení na e-mail
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Push oznámení</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat oznámení v prohlížeči
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shiftReminders">Připomínky směn</Label>
              <p className="text-sm text-muted-foreground">
                Upozornění na nadcházející směny
              </p>
            </div>
            <Switch
              id="shiftReminders"
              checked={shiftReminders}
              onCheckedChange={setShiftReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyReports">Týdenní souhrny</Label>
              <p className="text-sm text-muted-foreground">
                Přehled týdenních aktivit
              </p>
            </div>
            <Switch
              id="weeklyReports"
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="systemUpdates">Systémová oznámení</Label>
              <p className="text-sm text-muted-foreground">
                Upozornění na aktualizace a změny
              </p>
            </div>
            <Switch
              id="systemUpdates"
              checked={systemUpdates}
              onCheckedChange={setSystemUpdates}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketingové e-maily</Label>
              <p className="text-sm text-muted-foreground">
                Novinky a speciální nabídky
              </p>
            </div>
            <Switch
              id="marketingEmails"
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Časování oznámení
          </CardTitle>
          <CardDescription>
            Nastavte, kdy chcete dostávat oznámení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Čas připomínek</Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte čas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="06:00">6:00</SelectItem>
                <SelectItem value="07:00">7:00</SelectItem>
                <SelectItem value="08:00">8:00</SelectItem>
                <SelectItem value="09:00">9:00</SelectItem>
                <SelectItem value="10:00">10:00</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quietHours">Tichá doba</Label>
                <p className="text-sm text-muted-foreground">
                  Nevposílat oznámení během určených hodin
                </p>
              </div>
              <Switch
                id="quietHours"
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>

            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Začátek</Label>
                  <Select value={quietHoursStart} onValueChange={setQuietHoursStart}>
                    <SelectTrigger>
                      <SelectValue placeholder="Začátek" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quietEnd">Konec</Label>
                  <Select value={quietHoursEnd} onValueChange={setQuietHoursEnd}>
                    <SelectTrigger>
                      <SelectValue placeholder="Konec" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Test oznámení
          </CardTitle>
          <CardDescription>
            Otestujte, zda oznámení fungují správně
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTestNotification} variant="outline" className="w-full">
            Odeslat testovací oznámení
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="min-w-32">
          Uložit změny
        </Button>
      </div>
    </div>
  );
};

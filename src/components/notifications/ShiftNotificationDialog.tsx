
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Calendar } from 'lucide-react';
import { toast } from "sonner";

interface NotificationSettings {
  enabled: boolean;
  beforeShift: number; // minutes before shift
  dailyReminder: boolean;
  weeklyReminder: boolean;
  reminderTime: string;
}

const ShiftNotificationDialog = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    beforeShift: 30,
    dailyReminder: false,
    weeklyReminder: false,
    reminderTime: "08:00"
  });

  const handleSaveSettings = () => {
    localStorage.setItem('shiftNotificationSettings', JSON.stringify(settings));
    
    if (settings.enabled && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast.success("Nastavení notifikací bylo uloženo");
        } else {
          toast.error("Pro notifikace je potřeba povolit oznámení v prohlížeči");
        }
      });
    } else {
      toast.success("Nastavení notifikací bylo uloženo");
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Nastavit notifikace
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nastavení notifikací směn</DialogTitle>
          <DialogDescription>
            Nakonfigurujte, kdy chcete být upozorněni na nadcházející směny
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Základní nastavení
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled">Povolit notifikace</Label>
                <Switch
                  id="notifications-enabled"
                  checked={settings.enabled}
                  onCheckedChange={(enabled) => setSettings(prev => ({ ...prev, enabled }))}
                />
              </div>
              
              {settings.enabled && (
                <div className="space-y-2">
                  <Label>Upozornit před směnou</Label>
                  <Select
                    value={settings.beforeShift.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, beforeShift: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minut</SelectItem>
                      <SelectItem value="30">30 minut</SelectItem>
                      <SelectItem value="60">1 hodina</SelectItem>
                      <SelectItem value="120">2 hodiny</SelectItem>
                      <SelectItem value="1440">1 den</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {settings.enabled && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Pravidelné připomínky
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-reminder">Denní připomínka</Label>
                  <Switch
                    id="daily-reminder"
                    checked={settings.dailyReminder}
                    onCheckedChange={(dailyReminder) => setSettings(prev => ({ ...prev, dailyReminder }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-reminder">Týdenní souhrn</Label>
                  <Switch
                    id="weekly-reminder"
                    checked={settings.weeklyReminder}
                    onCheckedChange={(weeklyReminder) => setSettings(prev => ({ ...prev, weeklyReminder }))}
                  />
                </div>
                
                {(settings.dailyReminder || settings.weeklyReminder) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Čas připomínky
                    </Label>
                    <Select
                      value={settings.reminderTime}
                      onValueChange={(reminderTime) => setSettings(prev => ({ ...prev, reminderTime }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00</SelectItem>
                        <SelectItem value="08:00">8:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Zrušit
          </Button>
          <Button onClick={handleSaveSettings} className="flex-1">
            Uložit nastavení
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftNotificationDialog;

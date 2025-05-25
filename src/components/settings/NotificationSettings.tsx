
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Clock } from 'lucide-react';
import { toast } from "sonner";
import { SyncSettings } from '@/hooks/useSyncSettings';

interface NotificationSettingsProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
}

const NotificationSettings = ({ syncSettings, updateSyncSettings }: NotificationSettingsProps) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [vocabularyReminders, setVocabularyReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState("30");

  const handleSaveSettings = () => {
    toast.success("Nastavení oznámení byla uložena");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Oznámení
          </CardTitle>
          <CardDescription>
            Spravujte, jaké typy upozornění chcete dostávat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mailová oznámení
              </Label>
              <p className="text-sm text-muted-foreground">
                Dostávat důležitá oznámení e-mailem
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push oznámení
              </Label>
              <p className="text-sm text-muted-foreground">
                Dostávat oznámení přímo v prohlížeči
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="syncNotifications">Oznámení o synchronizaci</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat stav synchronizace dat
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
            <Clock className="h-5 w-5" />
            Připomenutí
          </CardTitle>
          <CardDescription>
            Nastavení automatických připomenutí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shiftReminders">Připomenutí směn</Label>
              <p className="text-sm text-muted-foreground">
                Dostávat upozornění před začátkem směny
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
              <Label htmlFor="vocabularyReminders">Připomenutí slovíček</Label>
              <p className="text-sm text-muted-foreground">
                Dostávat připomenutí pro opakování slovíček
              </p>
            </div>
            <Switch
              id="vocabularyReminders"
              checked={vocabularyReminders}
              onCheckedChange={setVocabularyReminders}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderTime">Čas připomenutí před směnou</Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte čas připomenutí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minut</SelectItem>
                <SelectItem value="30">30 minut</SelectItem>
                <SelectItem value="60">1 hodina</SelectItem>
                <SelectItem value="120">2 hodiny</SelectItem>
                <SelectItem value="240">4 hodiny</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

export default NotificationSettings;

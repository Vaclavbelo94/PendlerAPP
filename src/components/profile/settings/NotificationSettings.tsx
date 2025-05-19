
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  shiftNotifications: boolean;
  languageReminders: boolean;
  handleInputChange: (field: string, value: boolean) => void;
}

const NotificationSettings = ({
  emailNotifications,
  shiftNotifications,
  languageReminders,
  handleInputChange,
}: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Nastavení oznámení</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="emailNotifications">E-mailová oznámení</Label>
          <p className="text-sm text-muted-foreground">Dostávat důležitá oznámení e-mailem</p>
        </div>
        <Switch
          id="emailNotifications"
          checked={emailNotifications}
          onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="shiftNotifications">Oznámení o směnách</Label>
          <p className="text-sm text-muted-foreground">Dostávat upozornění o začátku směny</p>
        </div>
        <Switch
          id="shiftNotifications"
          checked={shiftNotifications}
          onCheckedChange={(checked) => handleInputChange('shiftNotifications', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="languageReminders">Jazyková připomenutí</Label>
          <p className="text-sm text-muted-foreground">Dostávat připomenutí pro učení slovíček</p>
        </div>
        <Switch
          id="languageReminders"
          checked={languageReminders}
          onCheckedChange={(checked) => handleInputChange('languageReminders', checked)}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;

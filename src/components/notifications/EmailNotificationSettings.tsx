
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from 'lucide-react';

export const EmailNotificationSettings = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [frequency, setFrequency] = useState('daily');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          E-mailová oznámení
        </CardTitle>
        <CardDescription>
          Nastavte, jak často chcete dostávat e-mailová oznámení
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-enabled">Povolit e-mailová oznámení</Label>
          <Switch
            id="email-enabled"
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
          />
        </div>
        
        {emailEnabled && (
          <div className="space-y-2">
            <Label>Frekvence oznámení</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Okamžitě</SelectItem>
                <SelectItem value="daily">Denní souhrn</SelectItem>
                <SelectItem value="weekly">Týdenní souhrn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

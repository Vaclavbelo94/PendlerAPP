
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PushNotificationSettings = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setPushEnabled(true);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push notifikace
        </CardTitle>
        <CardDescription>
          Nastavte push notifikace pro důležité události
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === 'denied' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Push notifikace jsou zakázané. Povolte je v nastavení prohlížeče.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <Label htmlFor="push-enabled">Povolit push notifikace</Label>
          <div className="flex items-center gap-2">
            {permission === 'default' && (
              <Button onClick={requestPermission} size="sm">
                Povolit
              </Button>
            )}
            <Switch
              id="push-enabled"
              checked={pushEnabled && permission === 'granted'}
              onCheckedChange={setPushEnabled}
              disabled={permission !== 'granted'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

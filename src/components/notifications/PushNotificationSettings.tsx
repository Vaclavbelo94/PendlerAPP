
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell } from 'lucide-react';
import { toast } from "sonner";

export const PushNotificationSettings = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      setPushEnabled(result === 'granted');
      
      if (result === 'granted') {
        toast.success("Push notifikace byly povoleny");
      } else {
        toast.error("Push notifikace byly zamítnuty");
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
          Nastavení push notifikací v prohlížeči
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pushNotifications">Push notifikace</Label>
            <p className="text-sm text-muted-foreground">
              Povolit oznámení v prohlížeči
            </p>
          </div>
          <Switch
            id="pushNotifications"
            checked={pushEnabled}
            onCheckedChange={(checked) => {
              if (checked && permission !== 'granted') {
                requestPermission();
              } else {
                setPushEnabled(checked);
              }
            }}
          />
        </div>

        {permission === 'denied' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Push notifikace jsou zakázané. Pro jejich povolení je potřeba změnit nastavení v prohlížeči.
            </p>
          </div>
        )}

        {permission === 'default' && (
          <Button onClick={requestPermission} variant="outline" className="w-full">
            Povolit push notifikace
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

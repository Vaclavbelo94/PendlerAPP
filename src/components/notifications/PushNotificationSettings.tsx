
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Smartphone } from 'lucide-react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { toast } from '@/components/ui/use-toast';

export const PushNotificationSettings: React.FC = () => {
  const { permission, isSupported, requestPermission, showNotification } = useNotificationPermission();

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      toast({
        title: "Oprávnění uděleno",
        description: "Push notifikace jsou nyní povoleny"
      });
      
      // Show test notification
      showNotification('Test notifikace', {
        body: 'Push notifikace fungují správně!',
        tag: 'test-notification'
      });
    } else {
      toast({
        title: "Oprávnění zamítnuto",
        description: "Push notifikace nelze povolit",
        variant: "destructive"
      });
    }
  };

  const handleTestNotification = () => {
    if (permission === 'granted') {
      showNotification('Test notifikace', {
        body: 'Toto je testovací zpráva z PendlerApp',
        tag: 'test-notification'
      });
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Povoleno', color: 'text-green-600', icon: Bell };
      case 'denied':
        return { text: 'Zamítnuto', color: 'text-red-600', icon: BellOff };
      default:
        return { text: 'Nepožádáno', color: 'text-yellow-600', icon: Bell };
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push oznámení
          </CardTitle>
          <CardDescription>
            Váš prohlížeč nepodporuje push notifikace
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const status = getPermissionStatus();
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Push oznámení
        </CardTitle>
        <CardDescription>
          Spravujte nastavení push notifikací v prohlížeči
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              Stav oprávnění
            </Label>
            <p className="text-sm text-muted-foreground">
              {status.text}
            </p>
          </div>
          <div className="flex gap-2">
            {permission !== 'granted' && (
              <Button 
                onClick={handleRequestPermission}
                variant="outline"
              >
                Povolit notifikace
              </Button>
            )}
            {permission === 'granted' && (
              <Button 
                onClick={handleTestNotification}
                variant="outline"
              >
                Test notifikace
              </Button>
            )}
          </div>
        </div>

        {permission === 'granted' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Push notifikace jsou aktivní</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Budete dostávat upozornění o nadcházejících směnách a dalších důležitých událostech.
            </p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <BellOff className="h-4 w-4" />
              <span className="font-medium">Push notifikace jsou zakázány</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Pro povolení notifikací přejděte do nastavení prohlížeče a povolte oznámení pro tento web.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

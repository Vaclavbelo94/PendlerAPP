import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationService } from '@/services/NotificationService';
import { useAuth } from '@/hooks/auth';
import { Calendar, Car, Settings, Shield } from 'lucide-react';

export const NotificationTestPanel: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const createTestNotifications = async () => {
    // Test shift notification
    await notificationService.createShiftNotification(
      user.id,
      'created',
      { id: 'test-1', date: '2024-01-15', start_time: '08:00' },
      'cs'
    );

    // Test rideshare notification
    await notificationService.createRideshareNotification(
      user.id,
      'request',
      { id: 'test-2', origin: 'Praha', destination: 'Brno', time: '14:00' },
      'cs'
    );

    // Test system notification
    await notificationService.createSystemNotification(
      user.id,
      'announcement',
      { title: 'Systémové oznámení', message: 'Nová funkce byla přidána do aplikace!' },
      'cs'
    );

    // Test admin notification
    await notificationService.createAdminNotification(
      user.id,
      'warning',
      { title: 'Důležité upozornění', message: 'Prosím aktualizujte své údaje.' },
      'cs'
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Test oznámení systému
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            onClick={createTestNotifications}
            className="w-full"
            variant="outline"
          >
            Vytvořit testovací oznámení
          </Button>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Směna</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-3 w-3" />
              <span>Spolujízda</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>Systém</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
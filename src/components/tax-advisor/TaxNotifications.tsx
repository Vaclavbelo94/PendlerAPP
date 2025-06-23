
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string;
  type: 'deadline' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  actionLabel?: string;
  actionUrl?: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'Termín daňového přiznání',
    message: 'Zbývá 15 dní do termínu podání daňového přiznání za rok 2023',
    date: '2024-03-15',
    actionLabel: 'Vyplnit přiznání',
    actionUrl: '/tax-return'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Neúplné údaje',
    message: 'Ve vašich daňových údajích chybí informace o příjmech ze zahraničí',
    date: '2024-03-10',
    actionLabel: 'Doplnit údaje'
  },
  {
    id: '3',
    type: 'info',
    title: 'Nová daňová úleva',
    message: 'Od letošního roku můžete uplatnit novou úlevu na dítě ve výši 15 000 Kč',
    date: '2024-03-05'
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'deadline':
      return <Calendar className="h-4 w-4" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4" />;
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getNotificationVariant = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'destructive';
    case 'warning':
      return 'secondary';
    case 'success':
      return 'default';
    default:
      return 'outline';
  }
};

const TaxNotifications = () => {
  const { t } = useTranslation('common');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('notifications') || 'Upozornění'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                  </div>
                  <Badge variant={getNotificationVariant(notification.type) as any} className="ml-2">
                    {notification.type === 'deadline' && (t('deadline') || 'Termín')}
                    {notification.type === 'warning' && (t('warning') || 'Varování')}
                    {notification.type === 'info' && (t('info') || 'Info')}
                    {notification.type === 'success' && (t('success') || 'Úspěch')}
                  </Badge>
                </div>
                {notification.actionLabel && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      {notification.actionLabel}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxNotifications;

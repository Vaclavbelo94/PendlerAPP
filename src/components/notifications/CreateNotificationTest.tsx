import React from 'react';
import { Button } from '@/components/ui/button';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { useTranslation } from 'react-i18next';

export const CreateNotificationTest: React.FC = () => {
  const { addNotification } = useSupabaseNotifications();
  const { t } = useTranslation('common');

  const createTestNotification = async (type: 'info' | 'success' | 'warning' | 'error') => {
    const messages = {
      info: {
        title: 'Informační oznámení',
        message: 'Toto je testovací informační oznámení pro ověření funkčnosti systému.'
      },
      success: {
        title: 'Úspěšná akce',
        message: 'Operace byla úspěšně dokončena. Vše proběhlo podle očekávání.'
      },
      warning: {
        title: 'Upozornění',
        message: 'Pozor! Toto je důležité upozornění, které byste si měli přečíst.'
      },
      error: {
        title: 'Chyba systému',
        message: 'Nastala chyba, kterou je nutné vyřešit. Kontaktujte podporu.'
      }
    };

    await addNotification({
      ...messages[type],
      type,
      related_to: {
        type: 'test',
        id: `test-${Date.now()}`
      }
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h3 className="font-medium mb-3">Test oznámení systému</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestNotification('info')}
        >
          Info
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestNotification('success')}
          className="text-green-600"
        >
          Success
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestNotification('warning')}
          className="text-yellow-600"
        >
          Warning
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestNotification('error')}
          className="text-red-600"
        >
          Error
        </Button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, TestTube, Clock, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';

export const CreateNotificationTest: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useSupabaseNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const createAdvancedNotification = async () => {
    if (!user) {
      toast.error('Musíte být přihlášeni pro vytvoření oznámení');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-notification', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Error creating advanced notification:', error);
        toast.error('Chyba při vytváření pokročilého oznámení');
        return;
      }

      if (data?.success) {
        toast.success(`Vytvořeno ${1 + (data.additional_notifications || 0)} pokročilých oznámení`);
      } else {
        toast.error('Neočekávaná odpověď ze serveru');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Neočekávaná chyba při vytváření oznámení');
    } finally {
      setIsLoading(false);
    }
  };

  const createSimpleNotification = async (type: 'info' | 'success' | 'warning' | 'error') => {
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
    
    toast.success(`Vytvořeno jednoduché ${type} oznámení`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-card/50">
      <div className="flex items-center gap-2 mb-3">
        <TestTube className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Test oznámení systému</h3>
      </div>
      
      {/* Advanced Notification */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Pokročilé oznámení (Edge Function)</h4>
        <Button
          onClick={createAdvancedNotification}
          disabled={isLoading || !user}
          variant="default"
          size="sm"
          className="w-full"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-2" />
              Vytvořit oznámení o změně směny
            </>
          )}
        </Button>
      </div>

      {/* Simple Notifications */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Jednoduchá oznámení</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => createSimpleNotification('info')}
            className="flex items-center gap-1"
          >
            {getIcon('info')}
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createSimpleNotification('success')}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            {getIcon('success')}
            Success
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createSimpleNotification('warning')}
            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
          >
            {getIcon('warning')}
            Warning
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createSimpleNotification('error')}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {getIcon('error')}
            Error
          </Button>
        </div>
      </div>

      {!user && (
        <p className="text-xs text-muted-foreground text-center">
          Přihlaste se pro použití pokročilých funkcí
        </p>
      )}
    </div>
  );
};
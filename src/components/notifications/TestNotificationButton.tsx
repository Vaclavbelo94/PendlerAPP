import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

export const TestNotificationButton: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createTestNotification = async () => {
    if (!user) {
      toast.error('Musíte být přihlášeni pro vytvoření testovacího oznámení');
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
        console.error('Error creating test notification:', error);
        toast.error('Chyba při vytváření testovacího oznámení');
        return;
      }

      if (data?.success) {
        toast.success(`Vytvořeno ${1 + (data.additional_notifications || 0)} testovacích oznámení`);
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

  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={createTestNotification}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      ) : (
        <TestTube className="h-4 w-4" />
      )}
      Vytvořit testovací oznámení
    </Button>
  );
};
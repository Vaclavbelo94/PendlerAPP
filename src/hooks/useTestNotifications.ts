import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTestNotifications = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createTestShiftNotification = async () => {
    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('daily-shift-notifications', {
        body: { 
          test: true,
          force: true // Force create notifications even if they already exist
        }
      });

      if (error) {
        console.error('Error creating test notifications:', error);
        toast.error('Chyba při vytváření testovacích oznámení');
        return;
      }

      console.log('Test notifications created:', data);
      toast.success(`Vytvořeno ${data.created || 0} testovacích oznámení`);
      
      return data;
    } catch (error) {
      console.error('Error calling daily-shift-notifications function:', error);
      toast.error('Chyba při volání funkce oznámení');
    } finally {
      setIsCreating(false);
    }
  };

  const createSampleShiftNotification = async (userId?: string) => {
    setIsCreating(true);
    
    try {
      const user = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!user) {
        toast.error('Uživatel není přihlášen');
        return;
      }

      // Create a sample shift notification
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user,
          title: 'Zítra začíná směna',
          message: 'Noční směna zítra od 22:00 do 06:00',
          type: 'shift_reminder',
          category: 'shift',
          priority: 'medium',
          language: 'cs',
          related_to: {
            type: 'shift',
            shift_id: 'test-shift-id',
            shift_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            shift_time: '22:00'
          },
          metadata: {
            shift_type: 'night',
            start_time: '22:00:00',
            end_time: '06:00:00',
            auto_generated: false,
            created_by: 'manual-test'
          }
        });

      if (error) {
        console.error('Error creating sample notification:', error);
        toast.error('Chyba při vytváření ukázkového oznámení');
        return;
      }

      toast.success('Ukázkové oznámení vytvořeno');
    } catch (error) {
      console.error('Error creating sample notification:', error);
      toast.error('Chyba při vytváření ukázkového oznámení');
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTestShiftNotification,
    createSampleShiftNotification,
    isCreating
  };
};
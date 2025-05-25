
import React, { useEffect } from 'react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NotificationManager: React.FC = () => {
  const { showNotification, requestPermission, permission } = useNotificationPermission();
  const { user } = useAuth();
  const { toast } = useToast();

  // Request permission on mount if not already granted
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Check for upcoming shifts and send notifications
  useEffect(() => {
    if (!user || permission !== 'granted') return;

    const checkUpcomingShifts = async () => {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDateString = tomorrow.toISOString().split('T')[0];

        const { data: shifts, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', tomorrowDateString);

        if (error) {
          console.error('Error fetching shifts:', error);
          return;
        }

        shifts?.forEach(shift => {
          const shiftTypeText = shift.type === 'morning' ? 'Ranní' : 
                              shift.type === 'afternoon' ? 'Odpolední' : 'Noční';
          const timeText = shift.type === 'morning' ? '6:00' : 
                         shift.type === 'afternoon' ? '14:00' : '22:00';

          showNotification('Zítřejší směna', {
            body: `${shiftTypeText} směna začíná zítra v ${timeText}${shift.notes ? ` - ${shift.notes}` : ''}`,
            tag: `shift-${shift.id}`,
            requireInteraction: false
          });
        });
      } catch (error) {
        console.error('Error checking upcoming shifts:', error);
      }
    };

    // Check immediately and then every hour
    checkUpcomingShifts();
    const intervalId = setInterval(checkUpcomingShifts, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [user, permission, showNotification]);

  // Listen for real-time shift changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('shift-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shifts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (permission === 'granted') {
            showNotification('Nová směna přidána', {
              body: 'Byla přidána nová směna do vašeho kalendáře',
              tag: 'shift-added'
            });
          }
          
          toast({
            title: "Nová směna",
            description: "Byla přidána nová směna do vašeho kalendáře"
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shifts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (permission === 'granted') {
            showNotification('Směna aktualizována', {
              body: 'Jedna z vašich směn byla upravena',
              tag: 'shift-updated'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, permission, showNotification, toast]);

  return null; // This component doesn't render anything visible
};

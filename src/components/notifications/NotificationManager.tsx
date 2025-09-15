
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useNotifications } from '@/hooks/useNotifications';
import { useRideshareNotifications } from '@/hooks/useRideshareNotifications';
import { supabase } from '@/integrations/supabase/client';

export const NotificationManager: React.FC = () => {
  const { user } = useAuth();
  const { addNotification, preferences } = useNotifications();
  
  // Initialize rideshare notifications
  useRideshareNotifications();

  // Check for upcoming shifts and send notifications
  useEffect(() => {
    if (!user || !preferences?.shift_reminders) return;

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

          addNotification({
            title: 'Zítřejší směna',
            message: `${shiftTypeText} směna začíná zítra v ${timeText}${shift.notes ? ` - ${shift.notes}` : ''}`,
            type: 'warning',
            related_to: {
              type: 'shift',
              id: shift.id
            }
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
  }, [user, preferences, addNotification]);

  // Listen for real-time shift changes to send notifications
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
          addNotification({
            title: 'Nová směna přidána',
            message: 'Byla přidána nová směna do vašeho kalendáře',
            type: 'success',
            related_to: {
              type: 'shift',
              id: payload.new.id
            }
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
          addNotification({
            title: 'Směna aktualizována',
            message: 'Jedna z vašich směn byla upravena',
            type: 'info',
            related_to: {
              type: 'shift',
              id: payload.new.id
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, addNotification]);

  return null; // This component doesn't render anything visible
};

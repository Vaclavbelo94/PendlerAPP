
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { useRideshareNotifications } from '@/hooks/useRideshareNotifications';
import { supabase } from '@/integrations/supabase/client';

export const NotificationManager: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useSupabaseNotifications();
  
  // Initialize rideshare notifications
  useRideshareNotifications();

  // Check for upcoming shifts and create notifications
  useEffect(() => {
    if (!user) return;

    const checkUpcomingShifts = async () => {
      try {
        console.log('🔔 NotificationManager: Checking upcoming shifts for user:', user.id);
        
        // Get preferences from database
        const { data: preferences, error: prefError } = await supabase
          .from('user_notification_preferences')
          .select('shift_reminders')
          .eq('user_id', user.id)
          .single();

        console.log('🔔 User preferences:', preferences, 'Error:', prefError);

        if (!preferences?.shift_reminders) {
          console.log('🔔 Shift reminders disabled or no preferences found');
          return;
        }

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Get all upcoming shifts (today to next week)
        const { data: shifts, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', today.toISOString().split('T')[0])
          .lte('date', nextWeek.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching shifts:', error);
          return;
        }

        // Get existing notifications to avoid duplicates
        const { data: existingNotifications } = await supabase
          .from('notifications')
          .select('related_to')
          .eq('user_id', user.id)
          .eq('category', 'shift');

        const existingShiftIds = new Set(
          existingNotifications
            ?.filter(n => n.related_to && typeof n.related_to === 'object' && 'id' in n.related_to)
            .map(n => (n.related_to as any).id) || []
        );

        // Create notifications for shifts that don't have one yet
        for (const shift of shifts || []) {
          if (existingShiftIds.has(shift.id)) continue;

          const shiftDate = new Date(shift.date);
          const isToday = shiftDate.toDateString() === today.toDateString();
          const isTomorrow = shiftDate.toDateString() === tomorrow.toDateString();
          
          let title = 'Nadcházející směna';
          let dateText = shiftDate.toLocaleDateString('cs-CZ');
          
          if (isToday) {
            title = 'Dnešní směna';
            dateText = 'dnes';
          } else if (isTomorrow) {
            title = 'Zítřejší směna';
            dateText = 'zítra';
          }

          const shiftTypeText = shift.type === 'morning' ? 'Ranní' : 
                              shift.type === 'afternoon' ? 'Odpolední' : 
                              shift.type === 'night' ? 'Noční' : 'Vlastní';

          await addNotification({
            title,
            message: `${shiftTypeText} směna ${dateText} v ${shift.start_time}${shift.notes ? ` - ${shift.notes}` : ''}`,
            type: isToday ? 'info' : 'warning',
            category: 'shift',
            related_to: {
              type: 'shift',
              id: shift.id
            }
          });
        }
      } catch (error) {
        console.error('Error checking upcoming shifts:', error);
      }
    };

    // Check immediately and then every hour
    checkUpcomingShifts();
    const intervalId = setInterval(checkUpcomingShifts, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [user, addNotification]);

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
        async (payload) => {
          const shift = payload.new;
          const shiftDate = new Date(shift.date);
          const today = new Date();
          
          const isToday = shiftDate.toDateString() === today.toDateString();
          const shiftTypeText = shift.type === 'morning' ? 'Ranní' : 
                              shift.type === 'afternoon' ? 'Odpolední' : 
                              shift.type === 'night' ? 'Noční' : 'Vlastní';
          
          await addNotification({
            title: isToday ? 'Nová směna dnes' : 'Nová směna přidána',
            message: `${shiftTypeText} směna ${shiftDate.toLocaleDateString('cs-CZ')} v ${shift.start_time}`,
            type: 'success',
            category: 'shift',
            related_to: {
              type: 'shift',
              id: shift.id
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
        async (payload) => {
          const shift = payload.new;
          await addNotification({
            title: 'Směna upravena',
            message: `Směna ${new Date(shift.date).toLocaleDateString('cs-CZ')} byla změněna`,
            type: 'info',
            category: 'shift',
            related_to: {
              type: 'shift',
              id: shift.id
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


import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Shift {
  id: string;
  date: string;
  type: string;
  notes?: string;
  user_id: string;
}

// This component handles the logic for automatically creating notifications based on shifts
export const ShiftNotifications = () => {
  const { addNotification, notifications } = useNotifications();
  const { user } = useAuth();
  
  useEffect(() => {
    // Function to check for upcoming shifts and create notifications
    const checkUpcomingShifts = async () => {
      if (!user) return;
      
      try {
        const now = new Date();
        
        // Calculate tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowDateString = tomorrow.toISOString().split('T')[0];
        
        // Fetch shifts for tomorrow from Supabase
        const { data: shifts, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', tomorrowDateString);
          
        if (error) {
          console.error('Error fetching shifts:', error);
          return;
        }
        
        // Check for shifts starting tomorrow
        shifts?.forEach(shift => {
          // Check if notification already exists
          const notificationExists = notifications.some(notif => 
            notif.related_to?.type === 'shift' && 
            notif.related_to.id === shift.id &&
            notif.title.includes('Zítra')
          );
          
          if (!notificationExists) {
            const shiftTypeText = shift.type === 'morning' ? 'Ranní' : 
                                shift.type === 'afternoon' ? 'Odpolední' : 'Noční';
            const timeText = shift.type === 'morning' ? '6:00' : 
                           shift.type === 'afternoon' ? '14:00' : '22:00';
            
            addNotification({
              title: 'Zítra začíná směna',
              message: `${shiftTypeText} směna začíná zítra v ${timeText}${shift.notes ? ` - ${shift.notes}` : ''}`,
              type: 'warning',
              related_to: {
                type: 'shift',
                id: shift.id
              }
            });
          }
        });
      } catch (error) {
        console.error('Error checking upcoming shifts:', error);
      }
    };
    
    // Check immediately and then set interval
    if (user) {
      checkUpcomingShifts();
      
      // Set interval to check once every hour
      const intervalId = setInterval(checkUpcomingShifts, 60 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [addNotification, notifications, user]);
  
  // This component doesn't render anything, it just adds logic
  return null;
};

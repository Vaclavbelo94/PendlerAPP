
import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

interface Shift {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
}

// This component handles the logic for automatically creating notifications based on shifts
export const ShiftNotifications = () => {
  const { addNotification, notifications } = useNotifications();
  
  useEffect(() => {
    // Function to check for upcoming shifts and create notifications
    const checkUpcomingShifts = () => {
      try {
        // Load shifts from localStorage
        const shifts: Shift[] = JSON.parse(localStorage.getItem('shifts') || '[]');
        const now = new Date();
        
        // Calculate tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        // Calculate day after tomorrow
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(now.getDate() + 2);
        dayAfterTomorrow.setHours(0, 0, 0, 0);
        
        // Check for shifts starting tomorrow
        shifts.forEach(shift => {
          const shiftStartDate = new Date(shift.start);
          
          // Create a notification for shifts starting tomorrow
          if (shiftStartDate >= tomorrow && shiftStartDate < dayAfterTomorrow) {
            // Check if notification already exists
            const notificationExists = notifications.some(notif => 
              notif.relatedTo?.type === 'shift' && 
              notif.relatedTo.id === shift.id &&
              notif.title.includes('Zítra')
            );
            
            if (!notificationExists) {
              addNotification({
                title: 'Zítra začíná směna',
                message: `Směna "${shift.title}" začíná zítra v ${shiftStartDate.getHours()}:${String(shiftStartDate.getMinutes()).padStart(2, '0')} v lokaci ${shift.location}`,
                type: 'warning',
                relatedTo: {
                  type: 'shift',
                  id: shift.id
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('Error checking upcoming shifts:', error);
      }
    };
    
    // Check immediately and then set interval
    checkUpcomingShifts();
    
    // Set interval to check once every hour
    const intervalId = setInterval(checkUpcomingShifts, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [addNotification, notifications]);
  
  // This component doesn't render anything, it just adds logic
  return null;
};

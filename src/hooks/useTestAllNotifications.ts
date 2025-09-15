import { useTestNotifications } from './useTestNotifications';
import { useRideshareNotifications } from './useRideshareNotifications';
import { useSystemNotifications } from './useSystemNotifications';
import { useAdminNotifications } from './useAdminNotifications';
import { supabase } from '@/integrations/supabase/client';

export const useTestAllNotifications = () => {
  const { createSampleShiftNotification, isCreating: isCreatingShift } = useTestNotifications();
  const { createTestRideshareNotification } = useRideshareNotifications();
  const { 
    createTestSystemNotification, 
    createTestUpdateNotification, 
    createTestAnnouncementNotification 
  } = useSystemNotifications();
  const { 
    createTestAdminNotification, 
    createTestAdminWarning, 
    createTestAdminAnnouncement 
  } = useAdminNotifications();

  const createTestRideshareContact = async () => {
    console.log('Creating test rideshare contact...');
    
    // Get current user ID from auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    console.log('Creating test rideshare contact notification for user:', user.id);
    
    // Create a mock rideshare contact notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Žádost o kontakt',
      message: 'Někdo se zajímá o vaši spolujízdu z Praha do Brno',
      type: 'rideshare_contact',
      category: 'rideshare',
      priority: 'medium',
      language: 'cs',
      metadata: {
        contact_id: 'test-contact-' + Date.now(),
        offer_id: 'test-offer-1',
        requester_email: 'test@example.com',
        origin_address: 'Praha, Česká republika',
        destination_address: 'Brno, Česká republika',
        departure_time: '14:00'
      },
      related_to: {
        type: 'rideshare_contact',
        id: 'test-contact-' + Date.now()
      }
    });

    // Also create a "request sent" notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Žádost odeslána',
      message: 'Vaše žádost o spolujízdu byla úspěšně odeslána řidiči',
      type: 'rideshare_request_sent',
      category: 'rideshare',
      priority: 'low',
      language: 'cs',
      metadata: {
        contact_id: 'test-contact-sent-' + Date.now(),
        offer_id: 'test-offer-1',
        origin_address: 'Praha, Česká republika',
        destination_address: 'Brno, Česká republika',
        departure_time: '14:00'
      },
      related_to: {
        type: 'rideshare_contact',
        id: 'test-contact-sent-' + Date.now()
      }
    });

    console.log('Test rideshare contact notifications created');
  };

  const createAllTestNotifications = async () => {
    try {
      // Create test notifications for all categories
      await Promise.all([
        createSampleShiftNotification(),
        createTestRideshareNotification(),
        createTestRideshareContact(),
        createTestSystemNotification(),
        createTestAdminNotification()
      ]);
    } catch (error) {
      console.error('Error creating test notifications:', error);
    }
  };

  const createTestNotificationByType = async (type: 'shift' | 'rideshare' | 'rideshare_contact' | 'system' | 'admin') => {
    try {
      switch (type) {
        case 'shift':
          await createSampleShiftNotification();
          break;
        case 'rideshare':
          await createTestRideshareNotification();
          break;
        case 'rideshare_contact':
          await createTestRideshareContact();
          break;
        case 'system':
          await createTestSystemNotification();
          break;
        case 'admin':
          await createTestAdminNotification();
          break;
      }
    } catch (error) {
      console.error(`Error creating ${type} test notification:`, error);
    }
  };

  return {
    createAllTestNotifications,
    createTestNotificationByType,
    isCreating: isCreatingShift,
    // Individual test functions
    createSampleShiftNotification,
    createTestRideshareNotification,
    createTestRideshareContact,
    createTestSystemNotification,
    createTestUpdateNotification,
    createTestAnnouncementNotification,
    createTestAdminNotification,
    createTestAdminWarning,
    createTestAdminAnnouncement
  };
};
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

    console.log('Creating test rideshare contact for user:', user.id);
    
    try {
      // First, get a real offer_id from the database
      const { data: offers, error: offersError } = await supabase
        .from('rideshare_offers')
        .select('id, user_id')
        .eq('is_active', true)
        .neq('user_id', user.id) // Exclude own offers
        .limit(1);

      if (offersError) {
        console.error('Error fetching offers:', offersError);
        return;
      }

      if (!offers || offers.length === 0) {
        console.log('No active offers found to test with');
        return;
      }

      const testOffer = offers[0];

      // Create a mock rideshare contact that will trigger the real-time listener
      const { data, error } = await supabase.from('rideshare_contacts').insert({
        offer_id: testOffer.id,
        requester_user_id: user.id,
        requester_email: user.email || 'test@example.com',
        message: 'Test žádost o kontakt - chci se zúčastnit vaší spolujízdy z Praha do Brno.',
        status: 'pending'
      }).select().single();

      if (error) {
        console.error('Error creating test rideshare contact:', error);
        return;
      }

      console.log('Test rideshare contact created successfully:', data);
    } catch (error) {
      console.error('Error in createTestRideshareContact:', error);
    }
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
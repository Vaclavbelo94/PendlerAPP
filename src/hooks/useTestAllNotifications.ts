import { useTestNotifications } from './useTestNotifications';
import { useRideshareNotifications } from './useRideshareNotifications';
import { useSystemNotifications } from './useSystemNotifications';
import { useAdminNotifications } from './useAdminNotifications';

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

  const createAllTestNotifications = async () => {
    try {
      // Create test notifications for all categories
      await Promise.all([
        createSampleShiftNotification(),
        createTestRideshareNotification(),
        createTestSystemNotification(),
        createTestAdminNotification()
      ]);
    } catch (error) {
      console.error('Error creating test notifications:', error);
    }
  };

  const createTestNotificationByType = async (type: 'shift' | 'rideshare' | 'system' | 'admin') => {
    try {
      switch (type) {
        case 'shift':
          await createSampleShiftNotification();
          break;
        case 'rideshare':
          await createTestRideshareNotification();
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
    createTestSystemNotification,
    createTestUpdateNotification,
    createTestAnnouncementNotification,
    createTestAdminNotification,
    createTestAdminWarning,
    createTestAdminAnnouncement
  };
};

import { useState, useEffect, useCallback } from 'react';
import { advancedNotificationService, AdvancedNotification, NotificationBatch, UserBehaviorPattern } from '@/services/AdvancedNotificationService';
import { useAuth } from '@/hooks/useAuth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useAdvancedNotifications = () => {
  const { user } = useAuth();
  const { success, error: showError, info } = useStandardizedToast();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState<AdvancedNotification[]>([]);
  const [behaviorPattern, setBehaviorPattern] = useState<UserBehaviorPattern | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Initialize the service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await advancedNotificationService.initialize();
        setIsInitialized(true);
        console.log('Advanced notification service initialized');
      } catch (error) {
        console.error('Error initializing advanced notification service:', error);
        showError('Chyba inicializace', 'Nepodařilo se inicializovat pokročilé notifikace');
      }
    };

    initializeService();

    return () => {
      advancedNotificationService.destroy();
    };
  }, []);

  // Request notification permission
  const requestPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setPermissionGranted(granted);
        
        if (granted) {
          success('Oprávnění uděleno', 'Notifikace jsou nyní povoleny');
        } else {
          info('Oprávnění odmítnuto', 'Notifikace nebudou zobrazovány');
        }
        
        return granted;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      showError('Chyba oprávnění', 'Nepodařilo se získat oprávnění pro notifikace');
      return false;
    }
  };

  // Add advanced notification
  const addAdvancedNotification = useCallback(async (
    notification: Omit<AdvancedNotification, 'id' | 'createdAt' | 'status' | 'retryCount'>
  ) => {
    if (!isInitialized) {
      console.warn('Advanced notification service not initialized');
      return null;
    }

    try {
      const notificationId = await advancedNotificationService.addNotification(notification);
      console.log('Added advanced notification:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error adding advanced notification:', error);
      showError('Chyba při přidávání notifikace', 'Nepodařilo se přidat notifikaci do fronty');
      return null;
    }
  }, [isInitialized, showError]);

  // Schedule intelligent notification
  const scheduleSmartNotification = useCallback(async (
    notification: AdvancedNotification
  ) => {
    if (!user || !isInitialized) return false;

    setIsScheduling(true);
    try {
      await advancedNotificationService.scheduleNotification(notification, user.id);
      success('Notifikace naplánována', 'Notifikace bude odeslána v optimální čas');
      return true;
    } catch (error) {
      console.error('Error scheduling smart notification:', error);
      showError('Chyba při plánování', 'Nepodařilo se naplánovat inteligentní notifikaci');
      return false;
    } finally {
      setIsScheduling(false);
    }
  }, [user, isInitialized, success, showError]);

  // Create notification batch
  const createNotificationBatch = useCallback(async (
    notifications: AdvancedNotification[],
    type: NotificationBatch['type']
  ) => {
    if (!isInitialized) return null;

    try {
      const batchId = await advancedNotificationService.createBatch(notifications, type);
      info('Dávka vytvořena', `Vytvořena dávka s ${notifications.length} notifikacemi`);
      return batchId;
    } catch (error) {
      console.error('Error creating notification batch:', error);
      showError('Chyba při vytváření dávky', 'Nepodařilo se vytvořit dávku notifikací');
      return null;
    }
  }, [isInitialized, info, showError]);

  // Analyze user behavior
  const analyzeUserBehavior = useCallback(async (interactions: any[]) => {
    if (!user || !isInitialized) return null;

    try {
      const pattern = await advancedNotificationService.analyzeUserBehavior(user.id, interactions);
      setBehaviorPattern(pattern);
      success('Analýza dokončena', 'Vzorce chování byly analyzovány pro lepší plánování notifikací');
      return pattern;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      showError('Chyba při analýze', 'Nepodařilo se analyzovat vzorce chování');
      return null;
    }
  }, [user, isInitialized, success, showError]);

  // Update user location
  const updateLocation = useCallback(async (location: { lat: number; lng: number }) => {
    if (!user || !isInitialized) return;

    try {
      await advancedNotificationService.updateLocation(user.id, location);
      console.log('Updated user location for context-aware notifications');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  }, [user, isInitialized]);

  // Sync notifications across devices
  const syncAcrossDevices = useCallback(async () => {
    if (!user || !isInitialized) return false;

    try {
      await advancedNotificationService.syncAcrossDevices(user.id);
      success('Synchronizace dokončena', 'Notifikace byly synchronizovány mezi zařízeními');
      return true;
    } catch (error) {
      console.error('Error syncing across devices:', error);
      showError('Chyba synchronizace', 'Nepodařilo se synchronizovat notifikace mezi zařízeními');
      return false;
    }
  }, [user, isInitialized, success, showError]);

  // Create context-aware notification helpers
  const createShiftReminder = useCallback((shiftData: any) => {
    return {
      title: 'Připomínka směny',
      message: `Vaše ${shiftData.type} směna začíná za hodinu`,
      type: 'reminder' as const,
      priority: 'high' as const,
      category: 'shift' as const,
      contexts: [
        {
          type: 'time' as const,
          conditions: { minHoursBefore: 1 },
          weight: 0.8
        }
      ],
      actions: [
        {
          id: 'view_shift',
          label: 'Zobrazit směnu',
          action: 'navigate',
          data: { route: '/shifts' }
        },
        {
          id: 'dismiss',
          label: 'Zavřít',
          action: 'dismiss'
        }
      ],
      metadata: { shiftId: shiftData.id, userId: user?.id },
      maxRetries: 2
    };
  }, [user]);

  const createLearningReminder = useCallback((lessonData: any) => {
    return {
      title: 'Čas na učení!',
      message: `Pokračujte v lekci: ${lessonData.title}`,
      type: 'reminder' as const,
      priority: 'medium' as const,
      category: 'learning' as const,
      contexts: [
        {
          type: 'time' as const,
          conditions: { preferredLearningHours: true },
          weight: 0.6
        }
      ],
      actions: [
        {
          id: 'continue_lesson',
          label: 'Pokračovat',
          action: 'navigate',
          data: { route: '/vocabulary' }
        }
      ],
      metadata: { lessonId: lessonData.id, userId: user?.id },
      maxRetries: 1
    };
  }, [user]);

  // Check permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  return {
    isInitialized,
    permissionGranted,
    behaviorPattern,
    isScheduling,
    pendingNotifications,
    requestPermission,
    addAdvancedNotification,
    scheduleSmartNotification,
    createNotificationBatch,
    analyzeUserBehavior,
    updateLocation,
    syncAcrossDevices,
    createShiftReminder,
    createLearningReminder
  };
};

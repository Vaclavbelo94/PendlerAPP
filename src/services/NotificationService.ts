import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export type NotificationCategory = 'shift' | 'rideshare' | 'system' | 'admin';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface EnhancedNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  action_url?: string;
  priority: NotificationPriority;
  read: boolean;
  expires_at?: string;
  metadata?: Record<string, any>;
  language: string;
  related_to?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  category: NotificationCategory;
  actionUrl?: string;
  priority?: NotificationPriority;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  language?: string;
  relatedTo?: Record<string, any>;
}

class UnifiedNotificationService {
  private static instance: UnifiedNotificationService;

  static getInstance(): UnifiedNotificationService {
    if (!UnifiedNotificationService.instance) {
      UnifiedNotificationService.instance = new UnifiedNotificationService();
    }
    return UnifiedNotificationService.instance;
  }

  // Create a new notification
  async createNotification(params: CreateNotificationParams): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('create_enhanced_notification', {
        p_user_id: params.userId,
        p_title: params.title,
        p_message: params.message,
        p_type: params.type || 'info',
        p_category: params.category,
        p_action_url: params.actionUrl || null,
        p_priority: params.priority || 'medium',
        p_expires_at: params.expiresAt?.toISOString() || null,
        p_metadata: params.metadata || {},
        p_language: params.language || 'cs',
        p_related_to: params.relatedTo || null
      });

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Shift notifications
  async createShiftNotification(
    userId: string,
    type: 'created' | 'updated' | 'deleted' | 'reminder' | 'overtime',
    shiftData: any,
    language: string = 'cs'
  ): Promise<string | null> {
    const notificationMap = {
      created: {
        title: 'notifications:shift.newShift',
        message: `notifications:shift.savedDescription`,
        type: 'success' as NotificationType,
        priority: 'medium' as NotificationPriority
      },
      updated: {
        title: 'notifications:shift.shiftChanged',
        message: 'notifications:shift.updatedDescription',
        type: 'info' as NotificationType,
        priority: 'medium' as NotificationPriority
      },
      deleted: {
        title: 'notifications:shift.deleted',
        message: 'notifications:shift.deletedDescription',
        type: 'info' as NotificationType,
        priority: 'low' as NotificationPriority
      },
      reminder: {
        title: 'notifications:shift.reminder',
        message: `Připomínka směny na ${shiftData.date} v ${shiftData.start_time}`,
        type: 'info' as NotificationType,
        priority: 'high' as NotificationPriority
      },
      overtime: {
        title: 'notifications:shift.overtime',
        message: `Přesčas zaznamenán pro směnu ${shiftData.date}`,
        type: 'warning' as NotificationType,
        priority: 'high' as NotificationPriority
      }
    };

    const config = notificationMap[type];
    
    return this.createNotification({
      userId,
      title: config.title,
      message: config.message,
      type: config.type,
      category: 'shift',
      actionUrl: `/shifts?date=${shiftData.date}`,
      priority: config.priority,
      metadata: { shiftId: shiftData.id, shiftDate: shiftData.date },
      language,
      relatedTo: { type: 'shift', id: shiftData.id }
    });
  }

  // Rideshare notifications  
  async createRideshareNotification(
    userId: string,
    type: 'request' | 'accepted' | 'rejected' | 'cancelled' | 'confirmed' | 'reminder',
    rideshareData: any,
    language: string = 'cs'
  ): Promise<string | null> {
    const notificationMap = {
      request: {
        title: 'notifications:rideshare.newRequest',
        message: `Nová žádost o spolujízdu ${rideshareData.origin} → ${rideshareData.destination}`,
        type: 'info' as NotificationType,
        priority: 'medium' as NotificationPriority
      },
      accepted: {
        title: 'notifications:rideshare.requestAccepted',
        message: `Vaše žádost o spolujízdu byla přijata`,
        type: 'success' as NotificationType,
        priority: 'high' as NotificationPriority
      },
      rejected: {
        title: 'notifications:rideshare.requestRejected', 
        message: `Vaše žádost o spolujízdu byla odmítnuta`,
        type: 'warning' as NotificationType,
        priority: 'medium' as NotificationPriority
      },
      cancelled: {
        title: 'notifications:rideshare.offerCancelled',
        message: `Spolujízda byla zrušena`,
        type: 'warning' as NotificationType,
        priority: 'high' as NotificationPriority
      },
      confirmed: {
        title: 'notifications:rideshare.rideConfirmed',
        message: `Spolujízda potvrzena`,
        type: 'success' as NotificationType,
        priority: 'high' as NotificationPriority
      },
      reminder: {
        title: 'notifications:rideshare.reminder',
        message: `Připomínka spolujízdy dnes v ${rideshareData.time}`,
        type: 'info' as NotificationType,
        priority: 'high' as NotificationPriority
      }
    };

    const config = notificationMap[type];
    
    return this.createNotification({
      userId,
      title: config.title,
      message: config.message,
      type: config.type,
      category: 'rideshare',
      actionUrl: `/rideshare`,
      priority: config.priority,
      metadata: { rideshareId: rideshareData.id },
      language,
      relatedTo: { type: 'rideshare', id: rideshareData.id }
    });
  }

  // System notifications
  async createSystemNotification(
    userId: string,
    type: 'maintenance' | 'update' | 'announcement' | 'welcome',
    content: { title: string; message: string },
    language: string = 'cs'
  ): Promise<string | null> {
    const priorityMap = {
      maintenance: 'high' as NotificationPriority,
      update: 'medium' as NotificationPriority,
      announcement: 'medium' as NotificationPriority,
      welcome: 'low' as NotificationPriority
    };

    return this.createNotification({
      userId,
      title: content.title,
      message: content.message,
      type: type === 'maintenance' ? 'warning' : 'info',
      category: 'system',
      priority: priorityMap[type],
      language,
      relatedTo: { type: 'system', subtype: type }
    });
  }

  // Admin notifications
  async createAdminNotification(
    userId: string,
    type: 'message' | 'announcement' | 'warning' | 'critical',
    content: { title: string; message: string },
    language: string = 'cs'
  ): Promise<string | null> {
    const config = {
      message: { type: 'info' as NotificationType, priority: 'medium' as NotificationPriority },
      announcement: { type: 'info' as NotificationType, priority: 'high' as NotificationPriority },
      warning: { type: 'warning' as NotificationType, priority: 'high' as NotificationPriority },
      critical: { type: 'error' as NotificationType, priority: 'critical' as NotificationPriority }
    };

    const notificationConfig = config[type];

    return this.createNotification({
      userId,
      title: content.title,
      message: content.message,
      type: notificationConfig.type,
      category: 'admin',
      priority: notificationConfig.priority,
      language,
      relatedTo: { type: 'admin', subtype: type }
    });
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      await supabase.rpc('cleanup_expired_notifications');
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
    }
  }
}

export const notificationService = UnifiedNotificationService.getInstance();

export interface NotificationContext {
  type: 'time' | 'location' | 'activity' | 'device' | 'app_usage';
  conditions: Record<string, any>;
  weight: number;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: 'navigate' | 'dismiss' | 'snooze' | 'external';
  data?: Record<string, any>;
}

export interface AdvancedNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'social' | 'system' | 'learning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  scheduledFor?: Date;
  contexts: NotificationContext[];
  actions: NotificationAction[];
  metadata: Record<string, any>;
  createdAt: Date;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  retryCount: number;
  maxRetries: number;
}

export interface NotificationBatch {
  id: string;
  notifications: AdvancedNotification[];
  type: 'scheduled' | 'triggered' | 'emergency';
  createdAt: Date;
  processedAt?: Date;
}

export interface UserBehaviorPattern {
  preferredTimes: Array<{ hour: number; score: number }>;
  responseRates: Array<{ type: string; rate: number }>;
  devicePreferences: string[];
  engagementScore: number;
  lastAnalyzed: Date;
}

export class AdvancedNotificationService {
  private static instance: AdvancedNotificationService;
  private notifications: Map<string, AdvancedNotification> = new Map();
  private batches: Map<string, NotificationBatch> = new Map();
  private behaviorPatterns: Map<string, UserBehaviorPattern> = new Map();
  private scheduledJobs: Map<string, number> = new Map();
  private isInitialized = false;

  static getInstance(): AdvancedNotificationService {
    if (!AdvancedNotificationService.instance) {
      AdvancedNotificationService.instance = new AdvancedNotificationService();
    }
    return AdvancedNotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load persisted notifications and patterns
    await this.loadPersistedData();
    
    // Start background processors
    this.startBackgroundProcessors();
    
    this.isInitialized = true;
    console.log('Advanced notification service initialized');
  }

  async addNotification(notification: Omit<AdvancedNotification, 'id' | 'createdAt' | 'status' | 'retryCount'>): Promise<string> {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullNotification: AdvancedNotification = {
      id,
      ...notification,
      createdAt: new Date(),
      status: 'pending',
      retryCount: 0
    };

    this.notifications.set(id, fullNotification);
    await this.persistNotification(fullNotification);
    
    console.log('Added advanced notification:', id);
    return id;
  }

  async scheduleNotification(notification: AdvancedNotification, userId: string): Promise<void> {
    const pattern = this.behaviorPatterns.get(userId);
    
    if (pattern) {
      const optimalTime = this.calculateOptimalTime(notification, pattern);
      notification.scheduledFor = optimalTime;
    }

    // Schedule the notification
    const delay = notification.scheduledFor ? 
      notification.scheduledFor.getTime() - Date.now() : 0;

    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        this.sendNotification(notification);
      }, delay);
      
      this.scheduledJobs.set(notification.id, timeoutId);
    } else {
      await this.sendNotification(notification);
    }
  }

  async createBatch(notifications: AdvancedNotification[], type: NotificationBatch['type']): Promise<string> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const batch: NotificationBatch = {
      id: batchId,
      notifications,
      type,
      createdAt: new Date()
    };

    this.batches.set(batchId, batch);
    
    // Process batch based on type
    if (type === 'emergency') {
      await this.processBatchImmediately(batch);
    } else {
      await this.scheduleBatch(batch);
    }

    return batchId;
  }

  async analyzeUserBehavior(userId: string, interactions: Array<{
    timestamp: Date;
    type: string;
    responded: boolean;
    device: string;
  }>): Promise<UserBehaviorPattern> {
    const hourlyEngagement = new Array(24).fill(0).map((_, hour) => ({ hour, count: 0, responses: 0 }));
    const typeEngagement = new Map<string, { sent: number; responded: number }>();
    const deviceUsage = new Map<string, number>();

    // Analyze interactions
    interactions.forEach(interaction => {
      const hour = interaction.timestamp.getHours();
      hourlyEngagement[hour].count++;
      if (interaction.responded) {
        hourlyEngagement[hour].responses++;
      }

      // Track by type
      const typeData = typeEngagement.get(interaction.type) || { sent: 0, responded: 0 };
      typeData.sent++;
      if (interaction.responded) typeData.responded++;
      typeEngagement.set(interaction.type, typeData);

      // Track device usage
      deviceUsage.set(interaction.device, (deviceUsage.get(interaction.device) || 0) + 1);
    });

    // Calculate preferred times
    const preferredTimes = hourlyEngagement.map(({ hour, count, responses }) => ({
      hour,
      score: count > 0 ? responses / count : 0
    }));

    // Calculate response rates by type
    const responseRates = Array.from(typeEngagement.entries()).map(([type, data]) => ({
      type,
      rate: data.sent > 0 ? data.responded / data.sent : 0
    }));

    // Calculate device preferences
    const devicePreferences = Array.from(deviceUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([device]) => device);

    // Calculate overall engagement score
    const totalResponses = interactions.filter(i => i.responded).length;
    const engagementScore = interactions.length > 0 ? totalResponses / interactions.length : 0;

    const pattern: UserBehaviorPattern = {
      preferredTimes,
      responseRates,
      devicePreferences,
      engagementScore,
      lastAnalyzed: new Date()
    };

    this.behaviorPatterns.set(userId, pattern);
    await this.persistBehaviorPattern(userId, pattern);

    return pattern;
  }

  async updateLocation(userId: string, location: { lat: number; lng: number }): Promise<void> {
    // Store location for context-aware notifications
    localStorage.setItem(`user_location_${userId}`, JSON.stringify({
      ...location,
      timestamp: new Date().toISOString()
    }));
  }

  async syncAcrossDevices(userId: string): Promise<void> {
    // Implementation for cross-device sync
    const notifications = Array.from(this.notifications.values())
      .filter(n => n.metadata.userId === userId);
    
    // Sync via localStorage for demo
    localStorage.setItem(`synced_notifications_${userId}`, JSON.stringify(notifications));
    
    console.log(`Synced ${notifications.length} notifications across devices for user ${userId}`);
  }

  private calculateOptimalTime(notification: AdvancedNotification, pattern: UserBehaviorPattern): Date {
    // Find best hour based on user pattern
    const currentHour = new Date().getHours();
    const bestHours = pattern.preferredTimes
      .filter(time => time.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    let targetHour = currentHour;
    if (bestHours.length > 0) {
      // Find next available preferred hour
      const nextBestHour = bestHours.find(h => h.hour > currentHour);
      targetHour = nextBestHour ? nextBestHour.hour : bestHours[0].hour;
    }

    const targetTime = new Date();
    targetTime.setHours(targetHour, 0, 0, 0);
    
    // If target time is in the past, move to next day
    if (targetTime.getTime() <= Date.now()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime;
  }

  private async sendNotification(notification: AdvancedNotification): Promise<void> {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const nativeNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: notification.id,
          data: notification.metadata
        });

        nativeNotification.onclick = () => {
          if (notification.actions.length > 0) {
            const primaryAction = notification.actions[0];
            this.handleNotificationAction(primaryAction);
          }
        };
      }

      notification.status = 'sent';
      await this.persistNotification(notification);
      
      console.log('Notification sent:', notification.id);
    } catch (error) {
      console.error('Error sending notification:', error);
      notification.status = 'failed';
      notification.retryCount++;
      
      if (notification.retryCount < notification.maxRetries) {
        // Retry after delay
        setTimeout(() => this.sendNotification(notification), 5000);
      }
    }
  }

  private handleNotificationAction(action: NotificationAction): void {
    switch (action.action) {
      case 'navigate':
        if (action.data?.route) {
          window.location.href = action.data.route;
        }
        break;
      case 'external':
        if (action.data?.url) {
          window.open(action.data.url, '_blank');
        }
        break;
      default:
        console.log('Notification action handled:', action.id);
    }
  }

  private async processBatchImmediately(batch: NotificationBatch): Promise<void> {
    for (const notification of batch.notifications) {
      await this.sendNotification(notification);
    }
    
    batch.processedAt = new Date();
    console.log('Emergency batch processed:', batch.id);
  }

  private async scheduleBatch(batch: NotificationBatch): Promise<void> {
    // Schedule batch for optimal delivery time
    const delay = 5000; // 5 second delay for demo
    
    setTimeout(async () => {
      await this.processBatchImmediately(batch);
    }, delay);
  }

  private startBackgroundProcessors(): void {
    // Clean up old notifications every hour
    setInterval(() => {
      this.cleanupOldNotifications();
    }, 3600000);

    // Process pending notifications every minute
    setInterval(() => {
      this.processPendingNotifications();
    }, 60000);
  }

  private cleanupOldNotifications(): void {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const [id, notification] of this.notifications.entries()) {
      if (now - notification.createdAt.getTime() > maxAge) {
        this.notifications.delete(id);
      }
    }
  }

  private async processPendingNotifications(): Promise<void> {
    const pendingNotifications = Array.from(this.notifications.values())
      .filter(n => n.status === 'pending' && 
                   (!n.scheduledFor || n.scheduledFor.getTime() <= Date.now()));

    for (const notification of pendingNotifications) {
      await this.sendNotification(notification);
    }
  }

  private async loadPersistedData(): Promise<void> {
    try {
      const storedNotifications = localStorage.getItem('advanced_notifications');
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        notifications.forEach((n: AdvancedNotification) => {
          this.notifications.set(n.id, {
            ...n,
            createdAt: new Date(n.createdAt),
            scheduledFor: n.scheduledFor ? new Date(n.scheduledFor) : undefined
          });
        });
      }
    } catch (error) {
      console.error('Error loading persisted notifications:', error);
    }
  }

  private async persistNotification(notification: AdvancedNotification): Promise<void> {
    try {
      const notifications = Array.from(this.notifications.values());
      localStorage.setItem('advanced_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error persisting notification:', error);
    }
  }

  private async persistBehaviorPattern(userId: string, pattern: UserBehaviorPattern): Promise<void> {
    try {
      localStorage.setItem(`behavior_pattern_${userId}`, JSON.stringify(pattern));
    } catch (error) {
      console.error('Error persisting behavior pattern:', error);
    }
  }

  destroy(): void {
    // Clear all scheduled jobs
    for (const timeoutId of this.scheduledJobs.values()) {
      clearTimeout(timeoutId);
    }
    this.scheduledJobs.clear();
    
    this.isInitialized = false;
    console.log('Advanced notification service destroyed');
  }
}

export const advancedNotificationService = AdvancedNotificationService.getInstance();

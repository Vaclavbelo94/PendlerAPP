
import { saveData, getAllData, deleteItemById } from '@/utils/offlineStorage';

export interface AdvancedNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'shift' | 'learning' | 'system' | 'social' | 'achievement';
  scheduledFor?: Date;
  contexts: NotificationContext[];
  actions?: NotificationAction[];
  metadata: any;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
}

export interface NotificationContext {
  type: 'location' | 'time' | 'activity' | 'device' | 'mood';
  conditions: any;
  weight: number;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  data?: any;
}

export interface NotificationBatch {
  id: string;
  notifications: AdvancedNotification[];
  type: 'digest' | 'related' | 'similar';
  scheduledFor: Date;
}

export interface UserBehaviorPattern {
  userId: string;
  preferredTimes: { hour: number; score: number }[];
  responseRates: { type: string; rate: number }[];
  quietHours: { start: number; end: number };
  devicePreferences: string[];
  engagementScore: number;
}

export class AdvancedNotificationService {
  private static instance: AdvancedNotificationService;
  private queue: AdvancedNotification[] = [];
  private behaviorPatterns: Map<string, UserBehaviorPattern> = new Map();
  private processingInterval?: number;

  static getInstance(): AdvancedNotificationService {
    if (!AdvancedNotificationService.instance) {
      AdvancedNotificationService.instance = new AdvancedNotificationService();
    }
    return AdvancedNotificationService.instance;
  }

  async initialize(): Promise<void> {
    await this.loadQueue();
    await this.loadBehaviorPatterns();
    this.startProcessing();
  }

  // Advanced Queue Management
  async addNotification(notification: Omit<AdvancedNotification, 'id' | 'createdAt' | 'status' | 'retryCount'>): Promise<string> {
    const fullNotification: AdvancedNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      status: 'pending',
      retryCount: 0,
      maxRetries: notification.maxRetries || 3
    };

    // Check for duplicates and merge if necessary
    const duplicate = this.findDuplicate(fullNotification);
    if (duplicate) {
      await this.mergeDuplicateNotifications(duplicate, fullNotification);
      return duplicate.id;
    }

    // Insert based on priority
    this.insertByPriority(fullNotification);
    await this.persistQueue();
    
    console.log('Added notification to queue:', fullNotification.id);
    return fullNotification.id;
  }

  async createBatch(notifications: AdvancedNotification[], type: NotificationBatch['type']): Promise<string> {
    const batch: NotificationBatch = {
      id: `batch_${Date.now()}`,
      notifications,
      type,
      scheduledFor: this.calculateOptimalBatchTime(notifications)
    };

    await saveData('notification_batches', batch);
    console.log('Created notification batch:', batch.id);
    return batch.id;
  }

  // Intelligent Scheduling
  async scheduleNotification(notification: AdvancedNotification, userId: string): Promise<void> {
    const behaviorPattern = this.behaviorPatterns.get(userId);
    if (!behaviorPattern) {
      // Schedule immediately if no pattern data
      notification.scheduledFor = new Date();
      await this.addNotification(notification);
      return;
    }

    const optimalTime = this.calculateOptimalTime(notification, behaviorPattern);
    notification.scheduledFor = optimalTime;
    
    // Apply context-aware adjustments
    const adjustedTime = await this.applyContextualAdjustments(notification, userId);
    notification.scheduledFor = adjustedTime;
    
    await this.addNotification(notification);
  }

  async analyzeUserBehavior(userId: string, interactions: any[]): Promise<UserBehaviorPattern> {
    const pattern: UserBehaviorPattern = {
      userId,
      preferredTimes: this.calculatePreferredTimes(interactions),
      responseRates: this.calculateResponseRates(interactions),
      quietHours: this.detectQuietHours(interactions),
      devicePreferences: this.detectDevicePreferences(interactions),
      engagementScore: this.calculateEngagementScore(interactions)
    };

    this.behaviorPatterns.set(userId, pattern);
    await saveData('user_behavior_patterns', pattern);
    
    return pattern;
  }

  // Context-Aware Features
  async checkContextConditions(notification: AdvancedNotification): Promise<boolean> {
    for (const context of notification.contexts) {
      const conditionMet = await this.evaluateContext(context);
      if (!conditionMet && context.weight > 0.5) {
        return false; // High-weight context not met
      }
    }
    return true;
  }

  async updateLocation(userId: string, location: { lat: number; lng: number }): Promise<void> {
    await saveData(`user_location_${userId}`, {
      id: userId,
      location,
      timestamp: new Date()
    });
    
    // Check for location-based notifications
    await this.processLocationBasedNotifications(userId, location);
  }

  // Enhanced Push Capabilities
  async sendRichNotification(notification: AdvancedNotification): Promise<boolean> {
    try {
      // Check if browser supports rich notifications
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        const notificationOptions: NotificationOptions = {
          body: notification.message,
          icon: this.getIconForType(notification.type),
          badge: '/badge-icon.png',
          tag: notification.category,
          requireInteraction: notification.priority === 'urgent',
          actions: notification.actions?.map(action => ({
            action: action.id,
            title: action.label
          })) || [],
          data: {
            notificationId: notification.id,
            metadata: notification.metadata
          }
        };

        await registration.showNotification(notification.title, notificationOptions);
        
        // Track successful send
        await this.trackNotificationEvent(notification.id, 'sent');
        return true;
      }
      
      // Fallback to basic notification
      return this.sendBasicNotification(notification);
    } catch (error) {
      console.error('Failed to send rich notification:', error);
      await this.trackNotificationEvent(notification.id, 'failed', error);
      return false;
    }
  }

  async syncAcrossDevices(userId: string): Promise<void> {
    const userNotifications = this.queue.filter(n => 
      n.metadata?.userId === userId && n.status === 'pending'
    );
    
    // In production, sync with server
    await saveData(`notifications_sync_${userId}`, {
      id: userId,
      notifications: userNotifications,
      lastSync: new Date()
    });
    
    console.log(`Synced ${userNotifications.length} notifications for user ${userId}`);
  }

  // Queue Processing
  private async processQueue(): Promise<void> {
    const now = new Date();
    const readyNotifications = this.queue.filter(n => 
      n.status === 'pending' && 
      (!n.scheduledFor || n.scheduledFor <= now)
    );

    for (const notification of readyNotifications) {
      try {
        const contextOk = await this.checkContextConditions(notification);
        if (!contextOk) {
          continue; // Skip this cycle
        }

        const success = await this.sendRichNotification(notification);
        if (success) {
          notification.status = 'sent';
          await this.removeFromQueue(notification.id);
        } else {
          await this.handleFailedNotification(notification);
        }
      } catch (error) {
        console.error('Error processing notification:', notification.id, error);
        await this.handleFailedNotification(notification);
      }
    }

    await this.persistQueue();
  }

  private async handleFailedNotification(notification: AdvancedNotification): Promise<void> {
    notification.retryCount++;
    
    if (notification.retryCount >= notification.maxRetries) {
      notification.status = 'failed';
      await this.removeFromQueue(notification.id);
      console.log('Notification failed permanently:', notification.id);
    } else {
      // Exponential backoff
      const delay = Math.pow(2, notification.retryCount) * 1000;
      notification.scheduledFor = new Date(Date.now() + delay);
      console.log(`Retrying notification ${notification.id} in ${delay}ms`);
    }
  }

  // Private helper methods
  private findDuplicate(notification: AdvancedNotification): AdvancedNotification | null {
    return this.queue.find(existing => 
      existing.category === notification.category &&
      existing.type === notification.type &&
      JSON.stringify(existing.metadata) === JSON.stringify(notification.metadata)
    ) || null;
  }

  private async mergeDuplicateNotifications(existing: AdvancedNotification, newNotification: AdvancedNotification): Promise<void> {
    // Merge logic - combine messages, update priority, etc.
    existing.message = `${existing.message}\n${newNotification.message}`;
    existing.priority = this.getHigherPriority(existing.priority, newNotification.priority);
    existing.actions = [...(existing.actions || []), ...(newNotification.actions || [])];
  }

  private insertByPriority(notification: AdvancedNotification): void {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const insertIndex = this.queue.findIndex(n => 
      priorityOrder[n.priority] > priorityOrder[notification.priority]
    );
    
    if (insertIndex === -1) {
      this.queue.push(notification);
    } else {
      this.queue.splice(insertIndex, 0, notification);
    }
  }

  private calculateOptimalTime(notification: AdvancedNotification, pattern: UserBehaviorPattern): Date {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if current time is in quiet hours
    if (currentHour >= pattern.quietHours.start || currentHour <= pattern.quietHours.end) {
      // Schedule for next preferred time
      const nextPreferredHour = pattern.preferredTimes
        .filter(pt => pt.hour > currentHour)
        .sort((a, b) => b.score - a.score)[0];
      
      if (nextPreferredHour) {
        const optimalTime = new Date(now);
        optimalTime.setHours(nextPreferredHour.hour, 0, 0, 0);
        return optimalTime;
      }
    }
    
    // If urgent or current time is good, send now
    if (notification.priority === 'urgent' || 
        pattern.preferredTimes.some(pt => pt.hour === currentHour && pt.score > 0.7)) {
      return now;
    }
    
    // Default to next high-score preferred time
    const bestTime = pattern.preferredTimes.sort((a, b) => b.score - a.score)[0];
    const optimalTime = new Date(now);
    optimalTime.setHours(bestTime.hour, 0, 0, 0);
    
    if (optimalTime <= now) {
      optimalTime.setDate(optimalTime.getDate() + 1);
    }
    
    return optimalTime;
  }

  private async applyContextualAdjustments(notification: AdvancedNotification, userId: string): Promise<Date> {
    let adjustedTime = notification.scheduledFor || new Date();
    
    // Check location context
    const userLocation = await getAllData(`user_location_${userId}`);
    if (userLocation && notification.contexts.some(c => c.type === 'location')) {
      // Adjust based on location-specific preferences
      // Implementation depends on specific requirements
    }
    
    // Check activity context
    if (notification.contexts.some(c => c.type === 'activity')) {
      // Delay if user is likely busy (heuristic-based)
      const busyHours = [9, 10, 11, 14, 15, 16]; // Work hours
      if (busyHours.includes(adjustedTime.getHours())) {
        adjustedTime.setHours(adjustedTime.getHours() + 2);
      }
    }
    
    return adjustedTime;
  }

  private calculatePreferredTimes(interactions: any[]): { hour: number; score: number }[] {
    const hourCounts = new Array(24).fill(0);
    
    interactions.forEach(interaction => {
      if (interaction.timestamp) {
        const hour = new Date(interaction.timestamp).getHours();
        hourCounts[hour]++;
      }
    });
    
    const maxCount = Math.max(...hourCounts);
    return hourCounts.map((count, hour) => ({
      hour,
      score: maxCount > 0 ? count / maxCount : 0
    }));
  }

  private calculateResponseRates(interactions: any[]): { type: string; rate: number }[] {
    const typeStats = new Map<string, { sent: number; responded: number }>();
    
    interactions.forEach(interaction => {
      const type = interaction.type || 'general';
      if (!typeStats.has(type)) {
        typeStats.set(type, { sent: 0, responded: 0 });
      }
      
      const stats = typeStats.get(type)!;
      stats.sent++;
      if (interaction.responded) {
        stats.responded++;
      }
    });
    
    return Array.from(typeStats.entries()).map(([type, stats]) => ({
      type,
      rate: stats.sent > 0 ? stats.responded / stats.sent : 0
    }));
  }

  private detectQuietHours(interactions: any[]): { start: number; end: number } {
    const hourActivity = new Array(24).fill(0);
    
    interactions.forEach(interaction => {
      if (interaction.timestamp) {
        const hour = new Date(interaction.timestamp).getHours();
        hourActivity[hour]++;
      }
    });
    
    // Find period with consistently low activity
    const avgActivity = hourActivity.reduce((sum, count) => sum + count, 0) / 24;
    const quietThreshold = avgActivity * 0.3;
    
    let quietStart = 22; // Default quiet hours
    let quietEnd = 7;
    
    for (let hour = 0; hour < 24; hour++) {
      if (hourActivity[hour] < quietThreshold) {
        if (hour > 20 || hour < 8) { // Likely night hours
          if (hour > 20) quietStart = Math.min(quietStart, hour);
          if (hour < 8) quietEnd = Math.max(quietEnd, hour);
        }
      }
    }
    
    return { start: quietStart, end: quietEnd };
  }

  private detectDevicePreferences(interactions: any[]): string[] {
    const deviceCounts = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const device = interaction.device || 'unknown';
      deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
    });
    
    return Array.from(deviceCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([device]) => device);
  }

  private calculateEngagementScore(interactions: any[]): number {
    if (interactions.length === 0) return 0;
    
    const responses = interactions.filter(i => i.responded).length;
    const opens = interactions.filter(i => i.opened).length;
    const total = interactions.length;
    
    return (responses * 1.0 + opens * 0.5) / total;
  }

  private async evaluateContext(context: NotificationContext): Promise<boolean> {
    switch (context.type) {
      case 'time':
        const now = new Date();
        return context.conditions.allowedHours?.includes(now.getHours()) ?? true;
      
      case 'location':
        // Implement location-based logic
        return true; // Simplified for demo
      
      case 'activity':
        // Implement activity-based logic
        return true; // Simplified for demo
      
      default:
        return true;
    }
  }

  private calculateOptimalBatchTime(notifications: AdvancedNotification[]): Date {
    // Find the median preferred time among all notifications
    const times = notifications
      .map(n => n.scheduledFor)
      .filter(time => time)
      .sort((a, b) => a!.getTime() - b!.getTime());
    
    if (times.length === 0) return new Date();
    
    const medianIndex = Math.floor(times.length / 2);
    return times[medianIndex]!;
  }

  private getHigherPriority(a: AdvancedNotification['priority'], b: AdvancedNotification['priority']): AdvancedNotification['priority'] {
    const order = { urgent: 3, high: 2, medium: 1, low: 0 };
    return order[a] >= order[b] ? a : b;
  }

  private async processLocationBasedNotifications(userId: string, location: { lat: number; lng: number }): Promise<void> {
    const locationNotifications = this.queue.filter(n => 
      n.metadata?.userId === userId &&
      n.contexts.some(c => c.type === 'location')
    );
    
    // Process location-based triggers
    for (const notification of locationNotifications) {
      // Implementation depends on specific location logic
      console.log('Processing location-based notification:', notification.id);
    }
  }

  private getIconForType(type: AdvancedNotification['type']): string {
    const icons = {
      info: '/icons/info.png',
      warning: '/icons/warning.png',
      error: '/icons/error.png',
      success: '/icons/success.png',
      reminder: '/icons/reminder.png'
    };
    return icons[type] || icons.info;
  }

  private async sendBasicNotification(notification: AdvancedNotification): Promise<boolean> {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: this.getIconForType(notification.type)
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to send basic notification:', error);
      return false;
    }
  }

  private async trackNotificationEvent(notificationId: string, event: string, data?: any): Promise<void> {
    await saveData('notification_events', {
      id: `${notificationId}_${event}_${Date.now()}`,
      notificationId,
      event,
      data,
      timestamp: new Date()
    });
  }

  private async removeFromQueue(notificationId: string): Promise<void> {
    this.queue = this.queue.filter(n => n.id !== notificationId);
  }

  private async loadQueue(): Promise<void> {
    const queueData = await getAllData<AdvancedNotification>('notification_queue');
    this.queue = queueData || [];
  }

  private async persistQueue(): Promise<void> {
    await saveData('notification_queue', { id: 'main', notifications: this.queue });
  }

  private async loadBehaviorPatterns(): Promise<void> {
    const patterns = await getAllData<UserBehaviorPattern>('user_behavior_patterns');
    patterns?.forEach(pattern => {
      this.behaviorPatterns.set(pattern.userId, pattern);
    });
  }

  private startProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    this.processingInterval = window.setInterval(() => {
      this.processQueue();
    }, 10000); // Process every 10 seconds
  }

  destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
  }
}

export const advancedNotificationService = AdvancedNotificationService.getInstance();

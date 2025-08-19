
import { multilingualNotificationService } from './MultilingualNotificationService';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
}

class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Optimized durations for better UX - faster dismissal
  private getOptimizedDuration(type: 'success' | 'error' | 'warning' | 'info' | 'default'): number {
    switch (type) {
      case 'success':
        return 1500; // Quick confirmation - faster
      case 'error':
        return 3500; // Longer for errors - slightly faster
      case 'warning':
        return 2500; // Medium for warnings - faster
      default:
        return 1800; // Shorter default - faster
    }
  }

  showShiftSaved(isUpdate: boolean = false) {
    multilingualNotificationService.showShiftSaved(isUpdate);
  }

  showShiftDeleted() {
    multilingualNotificationService.showShiftDeleted();
  }

  showShiftError(operation: 'save' | 'delete' | 'load') {
    multilingualNotificationService.showShiftError(operation);
  }

  showOfflineSaved() {
    multilingualNotificationService.showOfflineSaved();
  }

  showSyncComplete(count: number) {
    multilingualNotificationService.showSyncComplete(count);
  }

  showRemoteUpdate(message: string) {
    multilingualNotificationService.showRemoteUpdate(message);
  }

  showAuthRequired() {
    multilingualNotificationService.showAuthRequired();
  }

  showDataRestored() {
    multilingualNotificationService.showDataRestored();
  }

  showGenericError(message?: string) {
    multilingualNotificationService.showGenericError(message);
  }
}

export const notificationService = NotificationService.getInstance();

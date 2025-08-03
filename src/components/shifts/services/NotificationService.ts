
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

  // Optimized durations for better UX
  private getOptimizedDuration(type: 'success' | 'error' | 'warning' | 'info' | 'default'): number {
    switch (type) {
      case 'success':
        return 2000; // Quick confirmation
      case 'error':
        return 4000; // Longer for errors
      case 'warning':
        return 3000; // Medium for warnings
      default:
        return 2500; // Shorter default
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

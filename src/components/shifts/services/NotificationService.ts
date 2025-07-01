
import { unifiedToastService } from '@/services/UnifiedToastService';

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

  showShiftSaved(isUpdate: boolean = false) {
    unifiedToastService.showShiftSaved(isUpdate);
  }

  showShiftDeleted() {
    unifiedToastService.showShiftDeleted();
  }

  showShiftError(operation: 'save' | 'delete' | 'load') {
    unifiedToastService.showShiftError(operation);
  }

  showOfflineSaved() {
    unifiedToastService.showOfflineMode();
  }

  showSyncComplete(count: number) {
    unifiedToastService.showSyncComplete(count);
  }

  showRemoteUpdate(message: string) {
    unifiedToastService.showInfo("Synchronizace", message);
  }

  showAuthRequired() {
    unifiedToastService.showAuthRequired();
  }

  showDataRestored() {
    unifiedToastService.showInfo(
      "Data obnovena",
      "Směny byly načteny z místní zálohy."
    );
  }

  showGenericError(message?: string) {
    unifiedToastService.showGenericError(message);
  }
}

export const notificationService = NotificationService.getInstance();

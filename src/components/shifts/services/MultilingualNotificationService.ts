import { toast } from "@/hooks/use-toast";
import i18n from "@/i18n/config";

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  language?: string;
}

class MultilingualNotificationService {
  private static instance: MultilingualNotificationService;

  static getInstance(): MultilingualNotificationService {
    if (!MultilingualNotificationService.instance) {
      MultilingualNotificationService.instance = new MultilingualNotificationService();
    }
    return MultilingualNotificationService.instance;
  }

  private getOptimizedDuration(type: 'success' | 'error' | 'warning' | 'info' | 'default'): number {
    switch (type) {
      case 'success':
        return 2000;
      case 'error':
        return 4000;
      case 'warning':
        return 3000;
      default:
        return 2500;
    }
  }

  private getTranslation(key: string, options?: any, language?: string): string {
    const currentLang = language || i18n.language || 'cs';
    const translation = i18n.getFixedT(currentLang, 'notifications')(key, options);
    return typeof translation === 'string' ? translation : key;
  }

  showShiftSaved(isUpdate: boolean = false, language?: string) {
    const titleKey = isUpdate ? "shift.updated" : "shift.saved";
    const descriptionKey = isUpdate ? "shift.updatedDescription" : "shift.savedDescription";
    
    toast({
      title: this.getTranslation(titleKey, {}, language),
      description: this.getTranslation(descriptionKey, {}, language),
    });
  }

  showShiftDeleted(language?: string) {
    toast({
      title: this.getTranslation("shift.deleted", {}, language),
      description: this.getTranslation("shift.deletedDescription", {}, language),
      variant: "destructive"
    });
  }

  showShiftError(operation: 'save' | 'delete' | 'load', language?: string) {
    const titleKey = `errors.${operation}Title`;
    const messageKey = `errors.${operation}Message`;

    toast({
      title: this.getTranslation(titleKey, {}, language),
      description: this.getTranslation(messageKey, {}, language),
      variant: "destructive"
    });
  }

  showOfflineSaved(language?: string) {
    toast({
      title: this.getTranslation("offline.title", {}, language),
      description: this.getTranslation("offline.description", {}, language),
    });
  }

  showSyncComplete(count: number, language?: string) {
    toast({
      title: this.getTranslation("sync.completeTitle", {}, language),
      description: this.getTranslation("sync.completeDescription", { count }, language),
    });
  }

  showRemoteUpdate(message: string, language?: string) {
    toast({
      title: this.getTranslation("sync.remoteUpdateTitle", {}, language),
      description: this.getTranslation("sync.remoteUpdate", { message }, language),
    });
  }

  showAuthRequired(language?: string) {
    toast({
      title: this.getTranslation("auth.requiredTitle", {}, language),
      description: this.getTranslation("auth.requiredMessage", {}, language),
      variant: "destructive"
    });
  }

  showDataRestored(language?: string) {
    toast({
      title: this.getTranslation("dataRestored.title", {}, language),
      description: this.getTranslation("dataRestored.description", {}, language),
    });
  }

  showGenericError(message?: string, language?: string) {
    toast({
      title: this.getTranslation("generic.errorTitle", {}, language),
      description: message || this.getTranslation("generic.errorMessage", {}, language),
      variant: "destructive"
    });
  }

  // Custom admin notification method
  showCustomNotification(config: NotificationConfig) {
    toast({
      title: config.title,
      description: config.description,
      variant: config.type === 'error' ? 'destructive' : 'default',
      duration: config.duration || this.getOptimizedDuration(config.type || 'default')
    });
  }
}

export const multilingualNotificationService = MultilingualNotificationService.getInstance();
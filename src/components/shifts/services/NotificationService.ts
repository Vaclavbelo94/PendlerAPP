
import { toast } from "@/hooks/use-toast";

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
    toast({
      title: isUpdate ? "Směna aktualizována" : "Směna přidána",
      description: `Směna byla úspěšně ${isUpdate ? "upravena" : "přidána"}.`,
    });
  }

  showShiftDeleted() {
    toast({
      title: "Směna odstraněna",
      description: "Směna byla úspěšně odstraněna.",
      variant: "destructive"
    });
  }

  showShiftError(operation: 'save' | 'delete' | 'load') {
    const messages = {
      save: "Nepodařilo se uložit směnu. Zkuste to prosím znovu.",
      delete: "Nepodařilo se odstranit směnu. Zkuste to prosím znovu.", 
      load: "Nepodařilo se načíst směny. Zkusíme obnovit data z místní zálohy."
    };

    toast({
      title: "Chyba při " + (operation === 'save' ? 'ukládání' : operation === 'delete' ? 'mazání' : 'načítání'),
      description: messages[operation],
      variant: "destructive"
    });
  }

  showOfflineSaved() {
    toast({
      title: "Uloženo offline",
      description: "Směna byla uložena offline a bude synchronizována při obnovení připojení.",
    });
  }

  showSyncComplete(count: number) {
    toast({
      title: "Synchronizace dokončena",
      description: `Synchronizováno ${count} směn`,
    });
  }

  showRemoteUpdate(message: string) {
    toast({
      title: "Synchronizace",
      description: message,
    });
  }

  showAuthRequired() {
    toast({
      title: "Chyba",
      description: "Pro uložení směny musíte být přihlášeni a vybrat datum.",
      variant: "destructive"
    });
  }

  showDataRestored() {
    toast({
      title: "Data obnovena",
      description: "Směny byly načteny z místní zálohy.",
    });
  }

  showGenericError(message?: string) {
    toast({
      title: "Chyba",
      description: message || "Došlo k neočekávané chybě.",
      variant: "destructive"
    });
  }
}

export const notificationService = NotificationService.getInstance();

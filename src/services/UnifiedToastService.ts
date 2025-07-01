
import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

class UnifiedToastService {
  private static instance: UnifiedToastService;

  static getInstance(): UnifiedToastService {
    if (!UnifiedToastService.instance) {
      UnifiedToastService.instance = new UnifiedToastService();
    }
    return UnifiedToastService.instance;
  }

  private getOptimizedDuration(type: ToastType): number {
    switch (type) {
      case 'success':
        return 2000; // Quick confirmation
      case 'error':
        return 4000; // Longer for errors
      case 'warning':
        return 3000; // Medium for warnings
      case 'info':
        return 2500; // Standard info
      default:
        return 2500;
    }
  }

  private showToast(type: ToastType, options: ToastOptions) {
    const duration = options.duration || this.getOptimizedDuration(type);
    
    switch (type) {
      case 'success':
        toast.success(options.title, {
          description: options.description,
          duration,
        });
        break;
      case 'error':
        toast.error(options.title, {
          description: options.description,
          duration,
        });
        break;
      case 'warning':
        toast.warning(options.title, {
          description: options.description,
          duration,
        });
        break;
      case 'info':
        toast.info(options.title, {
          description: options.description,
          duration,
        });
        break;
    }
  }

  // Shift-specific notifications
  showShiftSaved(isUpdate: boolean = false) {
    this.showToast('success', {
      title: isUpdate ? "Směna aktualizována" : "Směna přidána",
      description: `Směna byla úspěšně ${isUpdate ? "upravena" : "přidána"}.`,
    });
  }

  showShiftDeleted() {
    this.showToast('success', {
      title: "Směna odstraněna",
      description: "Směna byla úspěšně odstraněna.",
    });
  }

  showShiftError(operation: 'save' | 'delete' | 'load', error?: string) {
    const messages = {
      save: "Nepodařilo se uložit směnu. Zkuste to prosím znovu.",
      delete: "Nepodařilo se odstranit směnu. Zkuste to prosím znovu.", 
      load: "Nepodařilo se načíst směny. Zkuste obnovit stránku."
    };

    this.showToast('error', {
      title: "Chyba při " + (operation === 'save' ? 'ukládání' : operation === 'delete' ? 'mazání' : 'načítání'),
      description: error || messages[operation],
    });
  }

  // DHL-specific notifications
  showDHLSetupSuccess() {
    this.showToast('success', {
      title: "DHL nastavení dokončeno",
      description: "Vaše DHL nastavení bylo úspěšně uloženo.",
    });
  }

  showDHLSetupError(error?: string) {
    this.showToast('error', {
      title: "Chyba DHL nastavení",
      description: error || "Nepodařilo se uložit DHL nastavení.",
    });
  }

  // General notifications
  showOfflineMode() {
    this.showToast('warning', {
      title: "Režim offline",
      description: "Aplikace funguje v offline režimu. Data budou synchronizována po obnovení připojení.",
    });
  }

  showSyncComplete(count: number) {
    this.showToast('success', {
      title: "Synchronizace dokončena",
      description: `Synchronizováno ${count} položek.`,
    });
  }

  showAuthRequired() {
    this.showToast('error', {
      title: "Přihlášení vyžadováno",
      description: "Pro tuto akci musíte být přihlášeni.",
    });
  }

  showGenericError(message?: string) {
    this.showToast('error', {
      title: "Chyba",
      description: message || "Došlo k neočekávané chybě.",
    });
  }

  showGenericSuccess(message: string) {
    this.showToast('success', {
      title: "Úspěch",
      description: message,
    });
  }

  showInfo(title: string, description?: string) {
    this.showToast('info', {
      title,
      description,
    });
  }

  showWarning(title: string, description?: string) {
    this.showToast('warning', {
      title,
      description,
    });
  }
}

export const unifiedToastService = UnifiedToastService.getInstance();

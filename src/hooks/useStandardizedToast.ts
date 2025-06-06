
import { toast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

/**
 * Standardized toast hook that uses sonner under the hood
 * Provides consistent toast notifications across the entire application
 * With optimized durations for better UX
 */
export const useStandardizedToast = () => {
  // Optimalized durations for different message types
  const getDefaultDuration = (variant: string): number => {
    switch (variant) {
      case 'success':
        return 2000; // Quick confirmation
      case 'info':
        return 2500; // Basic information
      case 'warning':
        return 3000; // Important warning
      case 'error':
        return 4000; // Error needs more reading time
      default:
        return 2500; // Default shorter duration
    }
  };

  const showToast = ({ title, description, variant = 'default', duration }: ToastOptions) => {
    const finalDuration = duration || getDefaultDuration(variant);
    
    switch (variant) {
      case 'success':
        toast.success(title, {
          description,
          duration: finalDuration,
        });
        break;
      case 'error':
        toast.error(title, {
          description,
          duration: finalDuration,
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          duration: finalDuration,
        });
        break;
      case 'info':
        toast.info(title, {
          description,
          duration: finalDuration,
        });
        break;
      default:
        toast(title, {
          description,
          duration: finalDuration,
        });
        break;
    }
  };

  return {
    toast: showToast,
    success: (title: string, description?: string, duration?: number) => 
      showToast({ title, description, variant: 'success', duration }),
    error: (title: string, description?: string, duration?: number) => 
      showToast({ title, description, variant: 'error', duration }),
    warning: (title: string, description?: string, duration?: number) => 
      showToast({ title, description, variant: 'warning', duration }),
    info: (title: string, description?: string, duration?: number) => 
      showToast({ title, description, variant: 'info', duration }),
  };
};

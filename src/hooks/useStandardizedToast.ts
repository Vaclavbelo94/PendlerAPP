
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
 */
export const useStandardizedToast = () => {
  const showToast = ({ title, description, variant = 'default', duration }: ToastOptions) => {
    const message = description ? `${title}\n${description}` : title || '';
    
    switch (variant) {
      case 'success':
        toast.success(title, {
          description,
          duration,
        });
        break;
      case 'error':
        toast.error(title, {
          description,
          duration,
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          duration,
        });
        break;
      case 'info':
        toast.info(title, {
          description,
          duration,
        });
        break;
      default:
        toast(title, {
          description,
          duration,
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

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployeeSync } from '@/utils/dhlAuthUtils';

export interface DHLThemeState {
  isDHLEmployee: boolean;
  isDHLThemeActive: boolean;
  canToggleDHLTheme: boolean;
}

/**
 * Hook pro správu DHL branding theme
 * Automaticky aktivuje DHL theme pro DHL zaměstnance
 */
export const useDHLTheme = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DHLThemeState>({
    isDHLEmployee: false,
    isDHLThemeActive: false,
    canToggleDHLTheme: false
  });

  useEffect(() => {
    if (!user) {
      setState({
        isDHLEmployee: false,
        isDHLThemeActive: false,
        canToggleDHLTheme: false
      });
      return;
    }

    const isDHL = isDHLEmployeeSync(user);
    
    // Pro DHL zaměstnance automaticky aktivujeme DHL theme
    setState({
      isDHLEmployee: isDHL,
      isDHLThemeActive: isDHL, // Auto-activate for DHL employees
      canToggleDHLTheme: isDHL // Only DHL employees can toggle
    });

    // Apply DHL theme to document root
    if (isDHL) {
      document.documentElement.setAttribute('data-dhl-theme', 'active');
    } else {
      document.documentElement.removeAttribute('data-dhl-theme');
    }

  }, [user]);

  const toggleDHLTheme = () => {
    if (!state.canToggleDHLTheme) return;

    const newActive = !state.isDHLThemeActive;
    setState(prev => ({
      ...prev,
      isDHLThemeActive: newActive
    }));

    // Apply theme to document
    if (newActive) {
      document.documentElement.setAttribute('data-dhl-theme', 'active');
    } else {
      document.documentElement.removeAttribute('data-dhl-theme');
    }
  };

  return {
    ...state,
    toggleDHLTheme
  };
};
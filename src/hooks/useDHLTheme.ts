import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee, isDHLEmployeeSync } from '@/utils/dhlAuthUtils';

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
    const checkDHLStatus = async () => {
      if (!user) {
        setState({
          isDHLEmployee: false,
          isDHLThemeActive: false,
          canToggleDHLTheme: false
        });
        document.documentElement.removeAttribute('data-dhl-theme');
        return;
      }

      // Rychlá sync kontrola nejdříve
      const isDHLSync = isDHLEmployeeSync(user);
      
      // Pokud sync detekce najde DHL, aktivuj okamžitě
      if (isDHLSync) {
        setState({
          isDHLEmployee: true,
          isDHLThemeActive: true,
          canToggleDHLTheme: false
        });
        document.documentElement.setAttribute('data-dhl-theme', 'active');
        console.log('DHL Theme: Immediately activated (sync) for user', user.email);
        return;
      }

      // Jinak použij async verzi pro kompletní kontrolu
      const isDHL = await isDHLEmployee(user);
      
      setState({
        isDHLEmployee: isDHL,
        isDHLThemeActive: isDHL,
        canToggleDHLTheme: false
      });

      if (isDHL) {
        document.documentElement.setAttribute('data-dhl-theme', 'active');
        console.log('DHL Theme: Activated (async) for user', user.email);
      } else {
        document.documentElement.removeAttribute('data-dhl-theme');
        console.log('DHL Theme: Deactivated for user', user.email);
      }
    };

    checkDHLStatus();
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
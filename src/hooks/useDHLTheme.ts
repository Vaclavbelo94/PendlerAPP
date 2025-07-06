import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useProfileData } from '@/hooks/useProfileData';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

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
  const { isDHLEmployee: profileDHLStatus, isLoading: isProfileLoading } = useProfileData(user);
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

      // Počkej na načtení profile dat
      if (isProfileLoading) {
        return;
      }

      // Admin override
      if (user.email === 'admin_dhl@pendlerapp.com') {
        setState({
          isDHLEmployee: true,
          isDHLThemeActive: true,
          canToggleDHLTheme: false
        });
        document.documentElement.setAttribute('data-dhl-theme', 'active');
        console.log('DHL Theme: Admin override activated');
        return;
      }

      // Použij profile data nebo fallback na async check
      let isDHL = profileDHLStatus;
      
      if (!isDHL) {
        // Fallback na kompletní async check
        isDHL = await isDHLEmployee(user);
      }

      setState({
        isDHLEmployee: isDHL,
        isDHLThemeActive: isDHL,
        canToggleDHLTheme: false
      });

      if (isDHL) {
        document.documentElement.setAttribute('data-dhl-theme', 'active');
        console.log('DHL Theme: Activated for user', user.email);
      } else {
        document.documentElement.removeAttribute('data-dhl-theme');
        console.log('DHL Theme: Deactivated for user', user.email);
      }
    };

    checkDHLStatus();
  }, [user, profileDHLStatus, isProfileLoading]);

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
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

      // Použij profile data z databáze jako primární zdroj
      let isDHL = profileDHLStatus;
      
      // Pokud profil ještě není načten, počkej
      if (isProfileLoading && !isDHL) {
        console.log('DHL Theme: Profile still loading, waiting...');
        return;
      }
      
      // Fallback na async check pouze pokud profile data nejsou dostupná
      if (!isDHL && !isProfileLoading) {
        console.log('DHL Theme: Profile loaded but no DHL flag, checking async...');
        isDHL = await isDHLEmployee(user);
      }

      console.log('DHL Theme: Final check result', {
        user: user.email,
        profileDHLStatus,
        isProfileLoading,
        finalResult: isDHL
      });

      setState({
        isDHLEmployee: isDHL,
        isDHLThemeActive: isDHL,
        canToggleDHLTheme: false
      });

      if (isDHL) {
        document.documentElement.setAttribute('data-dhl-theme', 'active');
        console.log('DHL Theme: ✅ ACTIVATED for user', user.email);
      } else {
        document.documentElement.removeAttribute('data-dhl-theme');
        console.log('DHL Theme: ❌ DEACTIVATED for user', user.email);
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
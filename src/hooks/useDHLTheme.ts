
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
 * GLOBÁLNĚ aktivuje žluté DHL téma pro celý web
 */
export const useDHLTheme = () => {
  const { user } = useAuth();
  const { isDHLEmployee: profileDHLStatus, isLoading: isProfileLoading } = useProfileData(user);
  const { setTheme } = useTheme();
  const [state, setState] = useState<DHLThemeState>({
    isDHLEmployee: false,
    isDHLThemeActive: false,
    canToggleDHLTheme: false
  });

  useEffect(() => {
    const activateGlobalDHLTheme = async () => {
      // GLOBÁLNÍ AKTIVACE DHL TÉMATU PRO VŠECHNY UŽIVATELE
      setState({
        isDHLEmployee: true, // Všichni mají přístup k DHL funkcím
        isDHLThemeActive: true, // DHL téma je vždy aktivní
        canToggleDHLTheme: true // Uživatelé si mohou téma vypnout
      });
      
      // Vynutit světlé téma pro správné zobrazení žlutého DHL tématu
      setTheme('light');
      
      // Aktivace žlutého DHL tématu na celém webu
      document.documentElement.setAttribute('data-dhl-theme', 'active');
      console.log('🟡 DHL Theme: GLOBÁLNĚ AKTIVOVÁNO pro všechny uživatele (forced light theme)');
      
      // Dodatečné informace pro přihlášené uživatele
      if (user) {
        // Admin má speciální privileges
        if (user.email === 'admin_dhl@pendlerapp.com') {
          console.log('🔑 DHL Theme: Admin uživatel detekován');
        }

        // Pro skutečné DHL zaměstnance zobraz dodatečné info
        if (profileDHLStatus && !isProfileLoading) {
          console.log('👨‍💼 DHL Theme: Skutečný DHL zaměstnanec -', user.email);
        } else if (!isProfileLoading) {
          // Fallback check pro DHL status
          const isDHL = await isDHLEmployee(user);
          if (isDHL) {
            console.log('👨‍💼 DHL Theme: DHL zaměstnanec ověřen -', user.email);
          }
        }
      } else {
        console.log('👤 DHL Theme: Aktivováno pro nepřihlášeného uživatele');
      }
    };

    activateGlobalDHLTheme();
  }, [user, profileDHLStatus, isProfileLoading, setTheme]);

  const toggleDHLTheme = () => {
    if (!state.canToggleDHLTheme) return;

    const newActive = !state.isDHLThemeActive;
    setState(prev => ({
      ...prev,
      isDHLThemeActive: newActive
    }));

    // Přepnutí DHL tématu
    if (newActive) {
      setTheme('light'); // Vynutit světlé téma při aktivaci
      document.documentElement.setAttribute('data-dhl-theme', 'active');
      console.log('🟡 DHL Theme: ZNOVU AKTIVOVÁNO uživatelem (forced light theme)');
    } else {
      document.documentElement.removeAttribute('data-dhl-theme');
      console.log('⚫ DHL Theme: DEAKTIVOVÁNO uživatelem');
      // Neměníme téma zpět, necháme uživatele si vybrat
    }
  };

  return {
    ...state,
    toggleDHLTheme
  };
};

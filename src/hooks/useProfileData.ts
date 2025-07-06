import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  is_dhl_employee?: boolean;
  is_premium?: boolean;
  is_admin?: boolean;
}

/**
 * Hook pro načítání profile dat pro současného uživatele
 * Poskytuje aktuální stav DHL, premium a admin statusu
 */
export const useProfileData = (user: User | null) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setProfileData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('is_dhl_employee, is_premium, is_admin')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile data:', profileError);
          setError(profileError);
        } else {
          setProfileData(data);
          console.log('Profile data loaded:', data);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Profile loading error:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  return {
    profileData,
    isLoading,
    error,
    isDHLEmployee: profileData?.is_dhl_employee || false,
    isPremium: profileData?.is_premium || false,
    isAdmin: profileData?.is_admin || false,
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

interface DHLSetupData {
  personalNumber: string;
  depot: string;
  route: string;
  shift: string;
}

interface DHLSetupState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isSetupComplete: boolean;
}

export const useDHLSetup = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DHLSetupState>({
    isLoading: true,
    isSubmitting: false,
    error: null,
    isSetupComplete: false,
  });

  // Check if user already has DHL setup
  useEffect(() => {
    const checkSetupStatus = async () => {
      if (!user || !isDHLEmployee(user)) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('dhl_user_assignments')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          isSetupComplete: !!data,
        }));
      } catch (error) {
        console.error('Error checking DHL setup status:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Chyba při načítání nastavení DHL',
        }));
      }
    };

    checkSetupStatus();
  }, [user]);

  const submitSetup = async (setupData: DHLSetupData) => {
    if (!user || !isDHLEmployee(user)) {
      setState(prev => ({ ...prev, error: 'Neautorizovaný přístup' }));
      return false;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const { error } = await supabase
        .from('dhl_user_assignments')
        .upsert({
          user_id: user.id,
          personal_number: setupData.personalNumber,
          depot: setupData.depot,
          route: setupData.route,
          shift: setupData.shift,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSetupComplete: true,
      }));

      return true;
    } catch (error: any) {
      console.error('Error submitting DHL setup:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.message || 'Chyba při ukládání nastavení',
      }));
      return false;
    }
  };

  return {
    ...state,
    submitSetup,
    canAccess: isDHLEmployee(user),
  };
};

import { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useWorkData } from './useWorkData';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for automatic DHL employee setup
 * Ensures DHL work address is properly set across all tables
 */
export const useDHLAutoSetup = () => {
  const { unifiedUser } = useAuth();
  const { saveWorkData } = useWorkData();

  useEffect(() => {
    const setupDHLEmployee = async () => {
      if (!unifiedUser?.isDHLEmployee || !unifiedUser.id) return;

      const dhlWorkAddress = "DHL-Ottendorf, Bergener Ring 2, 01458 Ottendorf-Okrilla, Německo";

      try {
        // Check if work data exists
        const { data: existingWorkData } = await supabase
          .from('user_work_data')
          .select('workplace_location')
          .eq('user_id', unifiedUser.id)
          .maybeSingle();

        // If no work data or wrong workplace, update it
        if (!existingWorkData || existingWorkData.workplace_location !== dhlWorkAddress) {
          await saveWorkData({
            workplace_location: dhlWorkAddress,
            hourly_wage: 0,
            phone_number: '',
            phone_country_code: '+49',
            home_address: ''
          });
        }

        // Ensure travel preferences also have DHL work address
        const { data: existingPrefs } = await supabase
          .from('user_travel_preferences')
          .select('work_address')
          .eq('user_id', unifiedUser.id)
          .maybeSingle();

        if (!existingPrefs || existingPrefs.work_address !== dhlWorkAddress) {
          await supabase
            .from('user_travel_preferences')
            .upsert({
              user_id: unifiedUser.id,
              work_address: dhlWorkAddress,
              updated_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.warn('DHL auto-setup warning:', error);
      }
    };

    setupDHLEmployee();
  }, [unifiedUser?.isDHLEmployee, unifiedUser?.id, saveWorkData]);
};
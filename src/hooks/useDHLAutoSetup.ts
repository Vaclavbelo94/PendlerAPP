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
        // Check existing data from all sources
        const [workDataResult, travelPrefsResult, extendedProfileResult] = await Promise.all([
          supabase.from('user_work_data')
            .select('workplace_location, home_address')
            .eq('user_id', unifiedUser.id)
            .maybeSingle(),
          supabase.from('user_travel_preferences')
            .select('work_address, home_address')
            .eq('user_id', unifiedUser.id)
            .maybeSingle(),
          supabase.from('user_extended_profiles')
            .select('location')
            .eq('user_id', unifiedUser.id)
            .maybeSingle()
        ]);

        const existingWorkData = workDataResult.data;
        const existingTravelPrefs = travelPrefsResult.data;
        const existingExtendedProfile = extendedProfileResult.data;

        // Determine best home address from available sources
        const homeAddress = existingWorkData?.home_address || 
                           existingTravelPrefs?.home_address || 
                           existingExtendedProfile?.location || 
                           '';

        // If no work data or wrong workplace, update it
        if (!existingWorkData || existingWorkData.workplace_location !== dhlWorkAddress) {
          await saveWorkData({
            workplace_location: dhlWorkAddress,
            hourly_wage: 0,
            phone_number: '',
            phone_country_code: '+49',
            home_address: homeAddress
          });
        }

        // Ensure travel preferences also have DHL work address and home address
        if (!existingTravelPrefs || existingTravelPrefs.work_address !== dhlWorkAddress) {
          await supabase
            .from('user_travel_preferences')
            .upsert({
              user_id: unifiedUser.id,
              work_address: dhlWorkAddress,
              home_address: homeAddress,
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
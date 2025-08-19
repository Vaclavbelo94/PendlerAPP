import { useState, useEffect } from 'react';
import { useWorkData } from './useWorkData';
import { useTravelPreferences } from './useTravelPreferences';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';

interface UserAddresses {
  homeAddress: string;
  workAddress: string;
  loading: boolean;
  error: string | null;
}

interface ExtendedProfile {
  location: string | null;
}

export const useUserAddresses = () => {
  const { workData, loading: workDataLoading } = useWorkData();
  const { preferences, isLoading: preferencesLoading } = useTravelPreferences();
  const { unifiedUser } = useAuth();
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfile>({ location: null });
  const [extendedLoading, setExtendedLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddresses>({
    homeAddress: '',
    workAddress: '',
    loading: true,
    error: null
  });

  // Load extended profile data
  useEffect(() => {
    const loadExtendedProfile = async () => {
      if (!unifiedUser?.id) {
        setExtendedLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_extended_profiles')
          .select('location')
          .eq('user_id', unifiedUser.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.warn('Error loading extended profile:', error);
        }

        setExtendedProfile({ location: data?.location || null });
      } catch (error) {
        console.warn('Error fetching extended profile:', error);
      } finally {
        setExtendedLoading(false);
      }
    };

    loadExtendedProfile();
  }, [unifiedUser?.id]);

  useEffect(() => {
    const loading = workDataLoading || preferencesLoading || extendedLoading;
    
    if (!loading) {
      // DHL work address constant
      const dhlWorkAddress = "DHL-Ottendorf, Bergener Ring 2, 01458 Ottendorf-Okrilla, Německo";
      
      // Priority order for home address: work_data > travel_preferences > extended_profile
      const homeAddress = workData.home_address || 
                         preferences.homeAddress || 
                         extendedProfile.location || 
                         '';
      
      // Debug logging for traffic monitoring
      console.log('🏠 useUserAddresses Debug:', {
        workDataHomeAddress: workData.home_address,
        preferencesHomeAddress: preferences.homeAddress,
        extendedProfileLocation: extendedProfile.location,
        finalHomeAddress: homeAddress,
        workDataWorkLocation: workData.workplace_location,
        preferencesWorkAddress: preferences.workAddress,
        isDHLEmployee: unifiedUser?.isDHLEmployee,
        dhlWorkAddress,
        unifiedUser
      });
      
      setAddresses({
        homeAddress,
        workAddress: unifiedUser?.isDHLEmployee ? dhlWorkAddress : (workData.workplace_location || preferences.workAddress || ''),
        loading: false,
        error: null
      });
    } else {
      setAddresses(prev => ({ ...prev, loading }));
    }
  }, [workData, preferences, extendedProfile, workDataLoading, preferencesLoading, extendedLoading, unifiedUser?.isDHLEmployee]);

  const refreshAddresses = async () => {
    if (!unifiedUser?.id) return;
    
    setExtendedLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_extended_profiles')
        .select('location')
        .eq('user_id', unifiedUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error refreshing extended profile:', error);
      }

      setExtendedProfile({ location: data?.location || null });
    } catch (error) {
      console.warn('Error refreshing extended profile:', error);
    } finally {
      setExtendedLoading(false);
    }
  };

  const getQuickRoutes = () => {
    const { homeAddress, workAddress } = addresses;
    
    return [
      {
        id: 'home-to-work',
        label: 'Domov → Práce',
        labelDE: 'Zuhause → Arbeit',
        labelPL: 'Dom → Praca',
        origin: homeAddress,
        destination: workAddress,
        available: !!(homeAddress && workAddress)
      },
      {
        id: 'work-to-home',
        label: 'Práce → Domov',
        labelDE: 'Arbeit → Zuhause',  
        labelPL: 'Praca → Dom',
        origin: workAddress,
        destination: homeAddress,
        available: !!(homeAddress && workAddress)
      }
    ].filter(route => route.available);
  };

  return {
    ...addresses,
    quickRoutes: getQuickRoutes(),
    hasAddresses: !!(addresses.homeAddress || addresses.workAddress),
    refreshAddresses
  };
};
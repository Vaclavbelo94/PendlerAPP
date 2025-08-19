import { useState, useEffect } from 'react';
import { useWorkData } from './useWorkData';
import { useTravelPreferences } from './useTravelPreferences';
import { useAuth } from '@/hooks/auth';

interface UserAddresses {
  homeAddress: string;
  workAddress: string;
  loading: boolean;
  error: string | null;
}

export const useUserAddresses = () => {
  const { workData, loading: workDataLoading } = useWorkData();
  const { preferences, isLoading: preferencesLoading } = useTravelPreferences();
  const { unifiedUser } = useAuth();
  const [addresses, setAddresses] = useState<UserAddresses>({
    homeAddress: '',
    workAddress: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    const loading = workDataLoading || preferencesLoading;
    
    if (!loading) {
      // DHL work address constant
      const dhlWorkAddress = "DHL-Ottendorf, Bergener Ring 2, 01458 Ottendorf-Okrilla, Německo";
      
      setAddresses({
        homeAddress: workData.home_address || preferences.homeAddress || '',
        workAddress: unifiedUser?.isDHLEmployee ? dhlWorkAddress : (workData.workplace_location || preferences.workAddress || ''),
        loading: false,
        error: null
      });
    } else {
      setAddresses(prev => ({ ...prev, loading }));
    }
  }, [workData, preferences, workDataLoading, preferencesLoading, unifiedUser?.isDHLEmployee]);

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
    hasAddresses: !!(addresses.homeAddress || addresses.workAddress)
  };
};
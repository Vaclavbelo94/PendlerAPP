import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';

interface WorkData {
  hourly_wage: number | null;
  phone_number: string;
  phone_country_code: string;
  workplace_location: string;
  home_address: string;
}

export const useWorkData = () => {
  const { user } = useAuth();
  const { t } = useTranslation('profile');
  const [loading, setLoading] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [workData, setWorkData] = useState<WorkData>({
    hourly_wage: null,
    phone_number: '',
    phone_country_code: 'CZ',
    workplace_location: '',
    home_address: ''
  });

  const fetchWorkData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_work_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching work data:', error);
        return;
      }

      if (data) {
        setWorkData({
          hourly_wage: data.hourly_wage,
          phone_number: data.phone_number || '',
          phone_country_code: data.phone_country_code || 'CZ',
          workplace_location: data.workplace_location || '',
          home_address: data.home_address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching work data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkData = async (data: WorkData) => {
    if (!user) return;

    setLoading(true);
    try {
    const { error } = await supabase
      .from('user_work_data')
      .upsert({
        user_id: user.id,
        hourly_wage: data.hourly_wage,
        phone_number: data.phone_number,
        phone_country_code: data.phone_country_code,
        workplace_location: data.workplace_location,
        home_address: data.home_address
      }, {
        onConflict: 'user_id'
      });

      if (error) {
        console.error('Error saving work data:', error);
        toast.error(t('workDataError'));
        return false;
      }

      setWorkData(data);
      
      // Synchronize with user_travel_preferences
      await syncWithTravelPreferences(data);
      
      // Debounce success toast to prevent multiple notifications
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        toast.success(t('workDataSaved'));
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error saving work data:', error);
      toast.error(t('workDataError'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const syncWithTravelPreferences = async (workData: WorkData) => {
    try {
      await supabase
        .from('user_travel_preferences')
        .upsert({
          user_id: user.id,
          home_address: workData.home_address,
          work_address: workData.workplace_location,
        }, {
          onConflict: 'user_id'
        });
    } catch (error) {
      console.error('Error syncing with travel preferences:', error);
    }
  };

  useEffect(() => {
    fetchWorkData();
  }, [user]);

  return {
    workData,
    loading,
    saveWorkData,
    setWorkData
  };
};

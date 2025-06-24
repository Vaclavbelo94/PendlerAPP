
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface WorkData {
  hourly_wage: number | null;
  phone_number: string;
  phone_country_code: string;
  workplace_location: string;
}

export const useWorkData = () => {
  const { user } = useAuth();
  const { t } = useTranslation('profile');
  const [loading, setLoading] = useState(false);
  const [workData, setWorkData] = useState<WorkData>({
    hourly_wage: null,
    phone_number: '',
    phone_country_code: 'CZ',
    workplace_location: ''
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
          workplace_location: data.workplace_location || ''
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
          workplace_location: data.workplace_location
        });

      if (error) {
        console.error('Error saving work data:', error);
        toast.error(t('workDataError'));
        return false;
      }

      setWorkData(data);
      toast.success(t('workDataSaved'));
      return true;
    } catch (error) {
      console.error('Error saving work data:', error);
      toast.error(t('workDataError'));
      return false;
    } finally {
      setLoading(false);
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

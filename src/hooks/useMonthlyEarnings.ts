import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface MonthlyEarnings {
  month: string;
  earnings: number;
}

export const useMonthlyEarnings = () => {
  const { user } = useAuth();
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarnings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyEarnings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('monthly_earnings')
          .select('*')
          .eq('user_id', user.id)
          .order('month', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setMonthlyEarnings(data || []);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchMonthlyEarnings();
  }, [user]);

  return {
    monthlyEarnings,
    isLoading,
    error,
  };
};

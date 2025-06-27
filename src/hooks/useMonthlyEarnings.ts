
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface MonthlyEarnings {
  month: string;
  earnings: number;
}

interface MonthlyEarningsWithStats {
  monthlyEarnings: MonthlyEarnings[];
  isLoading: boolean;
  error: string | null;
  amount: number;
  hoursWorked: number;
  shiftsCount: number;
  hasWageSet: boolean;
}

export const useMonthlyEarnings = (): MonthlyEarningsWithStats => {
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

  // Calculate stats from monthly earnings
  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentMonthData = monthlyEarnings.find(item => item.month === currentMonth);
  const amount = currentMonthData?.earnings || 0;
  const hoursWorked = Math.round(amount / 15); // Assuming 15 CZK per hour average
  const shiftsCount = Math.round(hoursWorked / 8); // Assuming 8 hours per shift

  return {
    monthlyEarnings,
    isLoading,
    error,
    amount,
    hoursWorked,
    shiftsCount,
    hasWageSet: amount > 0,
  };
};


import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkData } from '@/hooks/useWorkData';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth } from 'date-fns';

interface Shift {
  id: string;
  date: string;
  type: string;
}

export const useMonthlyEarnings = () => {
  const { user } = useAuth();
  const { workData } = useWorkData();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchShifts();
    }
  }, [user]);

  const fetchShifts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } else {
        setShifts(data || []);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setShifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyEarnings = useMemo(() => {
    if (!workData.hourly_wage || shifts.length === 0) {
      return {
        amount: 0,
        hoursWorked: 0,
        shiftsCount: 0,
        hasWageSet: !!workData.hourly_wage
      };
    }

    // Filtrovat směny za aktuální měsíc
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    
    const thisMonthShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= monthStart && shiftDate <= monthEnd;
    });

    const hoursWorked = thisMonthShifts.length * 8; // 8 hodin na směnu
    const grossEarnings = hoursWorked * workData.hourly_wage; // Výsledek už v EUR

    return {
      amount: grossEarnings,
      hoursWorked,
      shiftsCount: thisMonthShifts.length,
      hasWageSet: true
    };
  }, [workData.hourly_wage, shifts]);

  return {
    ...monthlyEarnings,
    isLoading,
    refetch: fetchShifts
  };
};

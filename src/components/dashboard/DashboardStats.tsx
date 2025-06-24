
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useMonthlyEarnings } from '@/hooks/useMonthlyEarnings';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface Shift {
  id: string;
  date: string;
  type: string;
}

const DashboardStats: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    amount: monthlyEarnings, 
    hoursWorked: monthlyHours,
    shiftsCount: monthlyShiftsCount,
    hasWageSet,
    isLoading: earningsLoading 
  } = useMonthlyEarnings();

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

  // Calculate statistics
  const thisWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  const thisMonthShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return shiftDate >= monthStart && shiftDate <= monthEnd;
  });

  const thisWeekHours = thisWeekShifts.length * 8;

  const stats = [
    {
      title: t('weeklyHours'),
      value: isLoading ? '...' : `${thisWeekHours}h`,
      icon: Clock,
      description: `${thisWeekShifts.length} ${t('shiftsThisWeek')}`,
    },
    {
      title: t('monthlyShifts'),
      value: isLoading ? '...' : thisMonthShifts.length.toString(),
      icon: CalendarDays,
      description: t('shiftsThisMonth'),
    },
    {
      title: t('monthlyEarningsTitle'),
      value: (isLoading || earningsLoading) ? '...' : 
        hasWageSet ? `${monthlyEarnings.toLocaleString('de-DE', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })}` : t('notSet'),
      icon: Euro,
      description: hasWageSet ? `${monthlyHours}h ${t('thisMonth')}` : t('setWageInProfile'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

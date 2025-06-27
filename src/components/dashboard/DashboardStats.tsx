
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useWorkData } from '@/hooks/useWorkData';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface Shift {
  id: string;
  date: string;
  type: string;
  notes?: string;
}

const DashboardStats: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const { workData, loading: workDataLoading } = useWorkData();
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
      console.log('🔄 Fetching shifts for dashboard stats...');
      
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error fetching shifts:', error);
        setShifts([]);
      } else {
        console.log('✅ Shifts loaded:', data?.length || 0);
        setShifts(data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching shifts:', error);
      setShifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics based on real data
  const calculateStats = () => {
    const now = new Date();
    
    // This week's shifts
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const thisWeekShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= weekStart && shiftDate <= weekEnd;
    });

    // This month's shifts
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const thisMonthShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= monthStart && shiftDate <= monthEnd;
    });

    // Calculate hours (assuming 8 hours per shift as standard)
    const hoursPerShift = 8;
    const weeklyHours = thisWeekShifts.length * hoursPerShift;
    const monthlyHours = thisMonthShifts.length * hoursPerShift;
    
    // Calculate earnings if hourly wage is set
    const monthlyEarnings = workData?.hourly_wage 
      ? monthlyHours * workData.hourly_wage 
      : 0;

    console.log('📊 Stats calculated:', {
      weeklyHours,
      monthlyShifts: thisMonthShifts.length,
      monthlyEarnings,
      hasWage: !!workData?.hourly_wage
    });

    return {
      weeklyHours,
      monthlyShifts: thisMonthShifts.length,
      monthlyHours,
      monthlyEarnings,
      hasWageSet: !!workData?.hourly_wage
    };
  };

  const stats = calculateStats();
  const isDataLoading = isLoading || workDataLoading;

  const statsData = [
    {
      title: t('weeklyHours'),
      value: isDataLoading ? '...' : `${stats.weeklyHours}h`,
      icon: Clock,
      description: t('shiftsThisWeek'),
    },
    {
      title: t('monthlyShifts'),
      value: isDataLoading ? '...' : stats.monthlyShifts.toString(),
      icon: CalendarDays,
      description: t('shiftsThisMonth'),
    },
    {
      title: t('monthlyEarningsTitle'),
      value: isDataLoading ? '...' : 
        stats.hasWageSet ? `${Math.round(stats.monthlyEarnings).toLocaleString('de-DE', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })}` : t('notSet'),
      icon: Euro,
      description: stats.hasWageSet ? `${stats.monthlyHours}h ${t('thisMonth')}` : t('setWageInProfile'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
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

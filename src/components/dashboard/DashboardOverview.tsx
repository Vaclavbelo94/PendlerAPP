
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { useWorkData } from '@/hooks/useWorkData';
import { startOfMonth, endOfMonth, isYesterday, isToday } from 'date-fns';

const DashboardOverview = () => {
  const { user } = useAuth();
  const { shifts, isLoading: shiftsLoading } = useShiftsData({ userId: user?.id });
  const { workData, loading: workDataLoading } = useWorkData();

  // Calculate real statistics
  const calculateStats = () => {
    if (!shifts.length) {
      return {
        totalShifts: 0,
        currentStreak: 0,
        monthlyHours: 0
      };
    }

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    // Total shifts count
    const totalShifts = shifts.length;
    
    // Calculate current streak (consecutive days with shifts)
    const sortedShifts = [...shifts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let checkDate = new Date();
    
    for (const shift of sortedShifts) {
      const shiftDate = new Date(shift.date);
      if (isToday(shiftDate) || isYesterday(shiftDate)) {
        currentStreak++;
        checkDate = new Date(shiftDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (shiftDate.toDateString() === checkDate.toDateString()) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    // Monthly hours (assuming 8 hours per shift)
    const monthlyShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= monthStart && shiftDate <= monthEnd;
    });
    const monthlyHours = monthlyShifts.length * 8;

    console.log('📊 Dashboard overview stats:', {
      totalShifts,
      currentStreak,
      monthlyHours,
      monthlyShifts: monthlyShifts.length
    });

    return {
      totalShifts,
      currentStreak,
      monthlyHours
    };
  };

  const stats = calculateStats();
  const isLoading = shiftsLoading || workDataLoading;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Směny celkem</CardTitle>
            <CardDescription>Počet všech vašich směn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalShifts}
            </div>
            <p className="text-sm text-muted-foreground">
              Za celou dobu používání
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hodiny tento měsíc</CardTitle>
            <CardDescription>Odpracované hodiny v aktuálním měsíci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${stats.monthlyHours}h`}
            </div>
            <p className="text-sm text-muted-foreground">
              Celkem odpracováno
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktuální série</CardTitle>
            <CardDescription>Po sobě jdoucí dny se směnami</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.currentStreak}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.currentStreak > 0 ? 'Pokračující série' : 'Žádná aktivní série'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
          <CardDescription>Nejčastěji používané funkce</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/shifts">
              <CalendarDays className="h-6 w-6 mb-2" />
              Správa směn
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/tax-advisor">
              <TrendingUp className="h-6 w-6 mb-2" />
              Daňový poradce
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/translator">
              <Activity className="h-6 w-6 mb-2" />
              Překladač
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;

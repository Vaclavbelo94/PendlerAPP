
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { useWorkData } from '@/hooks/useWorkData';
import { startOfMonth, endOfMonth, isYesterday, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';

const DashboardOverview = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { shifts, isLoading: shiftsLoading } = useShiftsData({ userId: user?.id });
  const { workData, loading: workDataLoading } = useWorkData();
  const { t } = useTranslation('common');

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
  const isLoading = shiftsLoading || workDataLoading || authLoading;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('totalShifts')}</CardTitle>
            <CardDescription>{t('shiftsCount')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalShifts}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('allTimeUsage')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('monthlyHours')}</CardTitle>
            <CardDescription>{t('workedHoursThisMonth')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${stats.monthlyHours}h`}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('totalWorked')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('currentStreak')}</CardTitle>
            <CardDescription>{t('consecutiveDaysWithShifts')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.currentStreak}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.currentStreak > 0 ? t('continuingStreak') : t('noActiveStreak')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
          <CardDescription>{t('mostUsedFeatures')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/shifts">
              <CalendarDays className="h-6 w-6 mb-2" />
              {t('shiftManagement')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/tax-advisor">
              <TrendingUp className="h-6 w-6 mb-2" />
              {t('taxAdvisor')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/translator">
              <Activity className="h-6 w-6 mb-2" />
              {t('translator')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;

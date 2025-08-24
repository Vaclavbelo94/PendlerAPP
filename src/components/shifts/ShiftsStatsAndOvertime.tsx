import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, TrendingUp, Euro, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useOvertimeData } from '@/hooks/useOvertimeData';
import { Shift } from '@/types/shifts';

interface ShiftsStatsAndOvertimeProps {
  shifts?: Shift[];
}

const ShiftsStatsAndOvertime: React.FC<ShiftsStatsAndOvertimeProps> = ({ shifts = [] }) => {
  const { t } = useTranslation('shifts');
  const { t: tOvertime } = useTranslation('overtime');
  const { user } = useAuth();
  
  // Get overtime data
  const { overtimeData, isLoading: overtimeLoading } = useOvertimeData({
    userId: user?.id || null
  });

  // Calculate basic analytics from shifts data
  const analytics = useMemo(() => {
    if (shifts.length === 0) {
      return {
        totalShifts: 0,
        totalHours: 0,
        totalEarnings: 0,
        averagePerShift: 0,
        weeklyData: [],
        shiftTypeData: [],
        monthlyTrend: []
      };
    }

    const totalShifts = shifts.length;
    const hoursPerShift = 8;
    const totalHours = totalShifts * hoursPerShift;
    const hourlyRate = 40;
    const totalEarnings = totalHours * hourlyRate;
    const averagePerShift = totalShifts > 0 ? totalEarnings / totalShifts : 0;

    // Count shift types
    const shiftTypeCounts = shifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const shiftTypeData = [
      { 
        name: t('morning'), 
        value: shiftTypeCounts.morning || 0, 
        color: 'hsl(var(--primary))'
      },
      { 
        name: t('afternoon'), 
        value: shiftTypeCounts.afternoon || 0, 
        color: 'hsl(var(--secondary))'
      },
      { 
        name: t('night'), 
        value: shiftTypeCounts.night || 0, 
        color: 'hsl(var(--accent))'
      }
    ].filter(item => item.value > 0);

    // Weekly data - group shifts by day of week
    const weekDays = [
      t('monday'), t('tuesday'), t('wednesday'), t('thursday'), 
      t('friday'), t('saturday'), t('sunday')
    ];

    const weeklyShifts = Array(7).fill(0);
    shifts.forEach(shift => {
      const date = new Date(shift.date);
      const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      weeklyShifts[dayOfWeek]++;
    });

    const weeklyData = weekDays.map((day, index) => ({
      name: day,
      [t('hours')]: weeklyShifts[index] * hoursPerShift,
      [t('earnings')]: weeklyShifts[index] * hoursPerShift * hourlyRate
    }));

    return {
      totalShifts,
      totalHours,
      totalEarnings,
      averagePerShift,
      weeklyData,
      shiftTypeData,
      monthlyTrend: []
    };
  }, [shifts, t]);

  if (shifts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('noShiftsForPeriod')}
          </h3>
          <p className="text-muted-foreground">
            {t('noShiftsYet')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalShifts')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.totalShifts}</div>
            <p className="text-xs text-muted-foreground">
              {t('shifts')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalHours')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              {t('hours')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tOvertime('totalThisMonth')}</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {overtimeData.total.toFixed(1)}{tOvertime('hours')}
            </div>
            <p className="text-xs text-muted-foreground">
              {tOvertime('overtime')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalEarnings')}</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{analytics.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('earnings')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('weeklyTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={t('hours')} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Shift Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('shiftTypeDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.shiftTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.shiftTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overtime Breakdown */}
      {(overtimeData.morning > 0 || overtimeData.afternoon > 0 || overtimeData.night > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{tOvertime('title')} - {t('detailedBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{overtimeData.morning.toFixed(1)}h</div>
                <p className="text-sm text-muted-foreground">{tOvertime('morningShift')}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{overtimeData.afternoon.toFixed(1)}h</div>
                <p className="text-sm text-muted-foreground">{tOvertime('afternoonShift')}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{overtimeData.night.toFixed(1)}h</div>
                <p className="text-sm text-muted-foreground">{tOvertime('nightShift')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Overtime Message */}
      {overtimeData.total === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Timer className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {tOvertime('noOvertimeRecorded')}
              </h3>
              <p className="text-muted-foreground">
                {tOvertime('dhlShiftNote')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShiftsStatsAndOvertime;
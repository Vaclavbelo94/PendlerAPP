
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, TrendingUp, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Shift } from '@/types/shifts';

interface ShiftsAnalyticsProps {
  shifts?: Shift[];
}

const ShiftsAnalytics: React.FC<ShiftsAnalyticsProps> = ({ shifts = [] }) => {
  const { t } = useTranslation('shifts');

  // Calculate analytics from real shifts data
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

    // Calculate total shifts and basic stats
    const totalShifts = shifts.length;
    
    // Assuming 8 hours per shift for calculation
    const hoursPerShift = 8;
    const totalHours = totalShifts * hoursPerShift;
    
    // Assuming €40 per hour for calculation
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
        color: '#3b82f6' 
      },
      { 
        name: t('afternoon'), 
        value: shiftTypeCounts.afternoon || 0, 
        color: '#f59e0b' 
      },
      { 
        name: t('night'), 
        value: shiftTypeCounts.night || 0, 
        color: '#6366f1' 
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

    // Monthly trend - group shifts by month
    const monthlyShifts = shifts.reduce((acc, shift) => {
      const date = new Date(shift.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const months = [
      t('january'), t('february'), t('march'), t('april'), 
      t('may'), t('june'), t('july'), t('august'),
      t('september'), t('october'), t('november'), t('december')
    ];

    const monthlyTrend = Object.entries(monthlyShifts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([monthKey, shiftsCount]) => {
        const [year, monthIndex] = monthKey.split('-');
        const monthName = months[parseInt(monthIndex)];
        const monthHours = shiftsCount * hoursPerShift;
        const monthEarnings = monthHours * hourlyRate;
        
        return {
          [t('months')]: monthName,
          [t('hours')]: monthHours,
          [t('earningsEuro')]: monthEarnings
        };
      });

    return {
      totalShifts,
      totalHours,
      totalEarnings,
      averagePerShift,
      weeklyData,
      shiftTypeData,
      monthlyTrend
    };
  }, [shifts, t]);

  if (shifts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('noShiftsForPeriod')}
          </h3>
          <p className="text-gray-500">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('averagePerShift')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{Math.round(analytics.averagePerShift)}</div>
            <p className="text-xs text-muted-foreground">
              {t('averagePerShift')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
                <Bar dataKey={t('hours')} fill="#3b82f6" />
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

      {/* Monthly Trend */}
      {analytics.monthlyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('monthlyTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={t('months')} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={t('hours')} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name={t('hours')}
                />
                <Line 
                  type="monotone" 
                  dataKey={t('earningsEuro')} 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name={t('earnings')}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShiftsAnalytics;

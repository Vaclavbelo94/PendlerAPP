
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Calendar, Award } from 'lucide-react';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface OptimizedShiftsAnalyticsProps {
  shifts: Shift[];
}

const OptimizedShiftsAnalytics: React.FC<OptimizedShiftsAnalyticsProps> = ({ shifts }) => {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const { t, i18n } = useTranslation('shifts');

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  const filteredShifts = useMemo(() => {
    const now = new Date();
    const start = period === 'week' ? startOfWeek(now, { weekStartsOn: 1 }) : startOfMonth(now);
    const end = period === 'week' ? endOfWeek(now, { weekStartsOn: 1 }) : endOfMonth(now);
    
    return shifts.filter(shift => 
      isWithinInterval(new Date(shift.date), { start, end })
    );
  }, [shifts, period]);

  const analytics = useMemo(() => {
    const totalShifts = filteredShifts.length;
    const totalHours = totalShifts * 8; // Assuming 8 hours per shift
    const totalEarnings = totalHours * 40; // Assuming 40€ per hour
    
    const shiftTypes = filteredShifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalShifts,
      totalHours,
      totalEarnings,
      morningShifts: shiftTypes.morning || 0,
      afternoonShifts: shiftTypes.afternoon || 0,
      nightShifts: shiftTypes.night || 0,
      averagePerShift: totalShifts > 0 ? Math.round(totalEarnings / totalShifts) : 0
    };
  }, [filteredShifts]);

  const chartData = useMemo(() => {
    return [
      { name: t('morningShifts'), value: analytics.morningShifts, color: '#3b82f6' },
      { name: t('afternoonShifts'), value: analytics.afternoonShifts, color: '#f59e0b' },
      { name: t('nightShifts'), value: analytics.nightShifts, color: '#6366f1' }
    ].filter(item => item.value > 0);
  }, [analytics, t]);

  const trendData = useMemo(() => {
    return [
      { name: t('morning'), hours: analytics.morningShifts * 8 },
      { name: t('afternoon'), hours: analytics.afternoonShifts * 8 },
      { name: t('night'), hours: analytics.nightShifts * 8 }
    ];
  }, [analytics, t]);

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('shiftsAnalytics')}</h2>
        <Select value={period} onValueChange={(value: 'week' | 'month') => setPeriod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t('thisWeek')}</SelectItem>
            <SelectItem value="month">{t('thisMonth')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalShifts')}</p>
                <p className="text-2xl font-bold">{analytics.totalShifts}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalHours')}</p>
                <p className="text-2xl font-bold">{analytics.totalHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalEarnings')}</p>
                <p className="text-2xl font-bold text-green-600">€{analytics.totalEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('averagePerShift')}</p>
                <p className="text-2xl font-bold text-purple-600">€{analytics.averagePerShift}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {filteredShifts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution Chart */}
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{t('distribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{t('trend')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">{t('noShiftsForPeriod')}</h3>
            <p className="text-muted-foreground">
              {period === 'week' ? t('thisWeek') : t('thisMonth')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      {filteredShifts.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('shiftTypeDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.morningShifts}</div>
                <div className="text-sm text-blue-600">{t('morningShifts')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analytics.morningShifts * 8}h {t('totalHours').toLowerCase()}
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{analytics.afternoonShifts}</div>
                <div className="text-sm text-amber-600">{t('afternoonShifts')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analytics.afternoonShifts * 8}h {t('totalHours').toLowerCase()}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analytics.nightShifts}</div>
                <div className="text-sm text-purple-600">{t('nightShifts')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analytics.nightShifts * 8}h {t('totalHours').toLowerCase()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedShiftsAnalytics;

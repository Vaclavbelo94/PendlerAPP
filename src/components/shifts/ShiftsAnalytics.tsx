
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Calendar, Award, Euro } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, getDay, startOfYear, endOfYear } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const ShiftsAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { t, i18n } = useTranslation('shifts');
  const { user } = useAuth();
  const { shifts, isLoading } = useOptimizedShiftsManagement(user?.id);

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
    if (!shifts.length) return [];
    
    const now = new Date();
    let start: Date, end: Date;
    
    switch (period) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'month':
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }
    
    return shifts.filter(shift => {
      try {
        const shiftDate = new Date(shift.date);
        return !isNaN(shiftDate.getTime()) && isWithinInterval(shiftDate, { start, end });
      } catch (error) {
        console.error("Error filtering shifts:", error);
        return false;
      }
    });
  }, [shifts, period]);

  const analytics = useMemo(() => {
    const totalShifts = filteredShifts.length;
    const totalHours = totalShifts * 8; // Assuming 8 hours per shift
    const hourlyRate = 40; // €40 per hour - could be made configurable
    const totalEarnings = totalHours * hourlyRate;
    
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
      averagePerShift: totalShifts > 0 ? Math.round(totalEarnings / totalShifts) : 0,
      hourlyRate
    };
  }, [filteredShifts]);

  const chartData = useMemo(() => {
    return [
      { name: t('morningShifts'), value: analytics.morningShifts, color: '#3b82f6' },
      { name: t('afternoonShifts'), value: analytics.afternoonShifts, color: '#f59e0b' },
      { name: t('nightShifts'), value: analytics.nightShifts, color: '#6366f1' }
    ].filter(item => item.value > 0);
  }, [analytics, t]);

  const weeklyTrendData = useMemo(() => {
    if (period !== 'week') return [];
    
    const weekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    const dayShifts = new Array(7).fill(0);
    
    filteredShifts.forEach(shift => {
      const shiftDate = new Date(shift.date);
      const dayIndex = (getDay(shiftDate) + 6) % 7; // Convert Sunday=0 to Monday=0
      dayShifts[dayIndex]++;
    });
    
    return weekDays.map((day, index) => ({
      name: day,
      shifts: dayShifts[index],
      hours: dayShifts[index] * 8,
      earnings: dayShifts[index] * 8 * analytics.hourlyRate
    }));
  }, [filteredShifts, period, analytics.hourlyRate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('shiftsAnalytics')}</h2>
        <Select value={period} onValueChange={(value: 'week' | 'month' | 'year') => setPeriod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t('thisWeek')}</SelectItem>
            <SelectItem value="month">{t('thisMonth')}</SelectItem>
            <SelectItem value="year">{t('thisYear')}</SelectItem>
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
              <Euro className="h-8 w-8 text-green-600" />
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
              <CardTitle>{t('shiftTypeDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <p>{t('noShiftsForPeriod')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Trend Chart (only for week period) */}
          {period === 'week' && (
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>{t('weeklyTrend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'shifts' ? t('shifts') : name === 'hours' ? t('hours') : '€']} />
                    <Bar dataKey="shifts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Summary Stats for other periods */}
          {period !== 'week' && (
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>{t('summary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">{t('hourlyRate')}</span>
                    <span className="font-bold text-green-600">€{analytics.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">{t('averageShiftsPerWeek')}</span>
                    <span className="font-bold">{period === 'month' ? Math.round(analytics.totalShifts / 4) : Math.round(analytics.totalShifts / 52)}</span>
                  </div>
                  {analytics.totalShifts > 0 && (
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">{t('mostCommonShift')}</span>
                      <span className="font-bold">
                        {analytics.morningShifts >= analytics.afternoonShifts && analytics.morningShifts >= analytics.nightShifts ? t('morning') :
                         analytics.afternoonShifts >= analytics.nightShifts ? t('afternoon') : t('night')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">{t('noShiftsForPeriod')}</h3>
            <p className="text-muted-foreground">
              {period === 'week' ? t('thisWeek') : period === 'year' ? t('thisYear') : t('thisMonth')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      {filteredShifts.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('detailedBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.morningShifts}</div>
                <div className="text-sm text-blue-600">{t('morningShifts')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analytics.morningShifts * 8}h • €{analytics.morningShifts * 8 * analytics.hourlyRate}
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{analytics.afternoonShifts}</div>
                <div className="text-sm text-amber-600">{t('afternoonShifts')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analytics.afternoonShifts * 8}h • €{analytics.afternoonShifts * 8 * analytics.hourlyRate}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analytics.nightShifts}</div>
                <div className="text-sm text-purple-600">{t('nightShifts')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analytics.nightShifts * 8}h • €{analytics.nightShifts * 8 * analytics.hourlyRate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShiftsAnalytics;

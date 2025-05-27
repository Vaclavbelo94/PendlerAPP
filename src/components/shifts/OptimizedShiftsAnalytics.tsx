
import React, { useMemo, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';

// Lazy load chart components
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const Pie = lazy(() => import('recharts').then(module => ({ default: module.Pie })));
const Cell = lazy(() => import('recharts').then(module => ({ default: module.Cell })));
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const Bar = lazy(() => import('recharts').then(module => ({ default: module.Bar })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));

interface OptimizedShiftsAnalyticsProps {
  shifts: Shift[];
}

const ChartSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const OptimizedShiftsAnalytics: React.FC<OptimizedShiftsAnalyticsProps> = React.memo(({ shifts }) => {
  // Memoize shift type data to prevent recalculation
  const shiftTypeData = useMemo(() => {
    const types = shifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Ranní', value: types.morning || 0, color: '#f59e0b' },
      { name: 'Odpolední', value: types.afternoon || 0, color: '#3b82f6' },
      { name: 'Noční', value: types.night || 0, color: '#8b5cf6' }
    ].filter(item => item.value > 0);
  }, [shifts]);

  // Memoize monthly data
  const monthlyData = useMemo(() => {
    const monthly = shifts.reduce((acc, shift) => {
      const month = new Date(shift.date).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthly).map(([month, count]) => ({
      month,
      count
    }));
  }, [shifts]);

  // Memoize stats
  const stats = useMemo(() => {
    const totalShifts = shifts.length;
    const maxType = shiftTypeData.reduce((max, current) => 
      current.value > max.value ? current : max, shiftTypeData[0]
    );
    const thisMonthShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const now = new Date();
      return shiftDate.getMonth() === now.getMonth() && 
             shiftDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalShifts,
      mostCommonType: maxType?.name || 'Žádná',
      thisMonthShifts
    };
  }, [shifts, shiftTypeData]);

  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Žádná data pro analýzu</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem směn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nejčastější typ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostCommonType}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tento měsíc</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthShifts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts with lazy loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rozdělení typů směn</CardTitle>
            <CardDescription>
              Poměr jednotlivých typů směn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shiftTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {shiftTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Směny podle měsíců</CardTitle>
            <CardDescription>
              Počet směn v jednotlivých měsících
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

OptimizedShiftsAnalytics.displayName = 'OptimizedShiftsAnalytics';

export default OptimizedShiftsAnalytics;

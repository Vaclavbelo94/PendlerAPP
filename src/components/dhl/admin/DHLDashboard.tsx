import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Activity,
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalEmployees: number;
  activeSchedules: number;
  todaysShifts: number;
  weeklyHours: number;
  pendingTasks: number;
  systemAlerts: number;
}

interface RecentActivity {
  id: string;
  type: 'schedule_import' | 'employee_added' | 'shift_modified';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const DHLDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeSchedules: 0,
    todaysShifts: 0,
    weeklyHours: 0,
    pendingTasks: 0,
    systemAlerts: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [shiftDistribution, setShiftDistribution] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load employee count
      const { count: employeeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_dhl_employee', true);

      // Load active schedules
      const { count: schedulesCount } = await supabase
        .from('dhl_shift_schedules')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Load today's shifts
      const today = new Date().toISOString().split('T')[0];
      const { count: todayShiftsCount } = await supabase
        .from('shifts')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('is_dhl_managed', true);

      // Load recent imports
      const { data: imports } = await supabase
        .from('dhl_schedule_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Load chart data - last 7 days shift counts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const chartPromises = last7Days.map(async (date) => {
        const { count } = await supabase
          .from('shifts')
          .select('*', { count: 'exact', head: true })
          .eq('date', date)
          .eq('is_dhl_managed', true);
        
        return {
          date: new Date(date).toLocaleDateString('cs-CZ', { weekday: 'short' }),
          shifts: count || 0
        };
      });

      const chartResults = await Promise.all(chartPromises);
      setChartData(chartResults);

      // Load shift type distribution
      const { data: shiftTypes } = await supabase
        .from('shifts')
        .select('type')
        .eq('is_dhl_managed', true)
        .gte('date', last7Days[0]);

      const typeCount = (shiftTypes || []).reduce((acc, shift) => {
        const type = shift.type || 'Ostatní';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];
      const distribution = Object.entries(typeCount).map(([type, count], index) => ({
        name: type,
        value: count,
        color: colors[index % colors.length]
      }));

      setShiftDistribution(distribution);

      setStats({
        totalEmployees: employeeCount || 0,
        activeSchedules: schedulesCount || 0,
        todaysShifts: todayShiftsCount || 0,
        weeklyHours: 320, // Mock data - would calculate from actual shifts
        pendingTasks: 3, // Mock data
        systemAlerts: 1 // Mock data
      });

      // Transform imports to recent activity
      const activities: RecentActivity[] = (imports || []).map(imp => ({
        id: imp.id,
        type: 'schedule_import',
        description: `Import směn z ${imp.file_name}`,
        timestamp: imp.created_at,
        status: imp.import_status === 'success' ? 'success' : 'error'
      }));

      setRecentActivity(activities);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Chyba při načítání dat dashboardu');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard aktualizován');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'schedule_import': return Calendar;
      case 'employee_added': return Users;
      case 'shift_modified': return Clock;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DHL Dashboard</h2>
          <p className="text-muted-foreground">Přehled systému a klíčových metrik</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Obnovit
          </Button>
          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            <Plus className="h-4 w-4 mr-2" />
            Rychlé akce
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Zaměstnanci</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktivní rozvrhy</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeSchedules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dnešní směny</p>
                <p className="text-2xl font-bold text-purple-600">{stats.todaysShifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Týdenní hodiny</p>
                <p className="text-2xl font-bold text-orange-600">{stats.weeklyHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Activity className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Čekající úkoly</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Systémová upozornění</p>
                <p className="text-2xl font-bold text-red-600">{stats.systemAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Nedávná aktivita
            </CardTitle>
            <CardDescription>
              Poslední změny a aktualizace v systému
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="p-2 bg-background rounded-lg">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('cs-CZ')}
                        </p>
                      </div>
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {activity.status === 'success' ? 'Úspěch' : 'Chyba'}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Žádná nedávná aktivita</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Rychlé akce</CardTitle>
              <CardDescription>
                Nejčastěji používané funkce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Přidat zaměstnance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Importovat rozvrh
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Zobrazit reporty
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Přehled směn
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Stav systému</CardTitle>
              <CardDescription>
                Celkové zdraví DHL systému
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Výkonnost databáze</span>
                  <span className="text-sm text-green-600">Výborná</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Synchronizace dat</span>
                  <span className="text-sm text-green-600">Aktivní</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dostupnost API</span>
                  <span className="text-sm text-green-600">99.9%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Všechny systémy fungují normálně</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Shifts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Směny za posledních 7 dní</CardTitle>
            <CardDescription>
              Denní počet naplánovaných směn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shifts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Shift Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuce typů směn</CardTitle>
            <CardDescription>
              Rozložení směn podle typu za posledních 7 dní
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={shiftDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {shiftDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {shiftDistribution.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {shiftDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DHLDashboard;
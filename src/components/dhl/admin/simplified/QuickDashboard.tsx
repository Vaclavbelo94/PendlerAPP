import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  totalEmployees: number;
  activeGroups: number;
  shiftsThisWeek: number;
  shiftsThisMonth: number;
  pendingChanges: number;
  systemHealth: 'good' | 'warning' | 'error';
}

interface RecentActivity {
  id: string;
  type: 'shift_created' | 'group_modified' | 'bulk_operation';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

const QuickDashboard = () => {
  const { t } = useTranslation(['dhl', 'common']);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeGroups: 0,
    shiftsThisWeek: 0,
    shiftsThisMonth: 0,
    pendingChanges: 0,
    systemHealth: 'good'
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalEmployees: 47,
        activeGroups: 4,
        shiftsThisWeek: 186,
        shiftsThisMonth: 742,
        pendingChanges: 3,
        systemHealth: 'good'
      });

      setRecentActivity([
        {
          id: '1',
          type: 'bulk_operation',
          description: t('admin.dashboard.activity.bulkShiftsCreated', { count: 50 }),
          timestamp: '2024-01-15T10:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          type: 'group_modified',
          description: t('admin.dashboard.activity.groupModified', { name: 'Ranní směna A' }),
          timestamp: '2024-01-15T09:15:00Z',
          status: 'success'
        },
        {
          id: '3',
          type: 'shift_created',
          description: t('admin.dashboard.activity.shiftsCreated', { count: 12 }),
          timestamp: '2024-01-15T08:45:00Z',
          status: 'pending'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bulk_operation': return <Calendar className="h-4 w-4" />;
      case 'group_modified': return <Users className="h-4 w-4" />;
      case 'shift_created': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.dashboard.title')}</h2>
          <p className="text-muted-foreground">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          {t('admin.dashboard.refresh')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.dashboard.stats.totalEmployees')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                <div className="text-xs text-muted-foreground">
                  {t('admin.dashboard.stats.across')} {stats.activeGroups} {t('admin.dashboard.stats.groups')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.dashboard.stats.shiftsThisWeek')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.shiftsThisWeek}</div>
                <div className="text-xs text-muted-foreground">
                  +12% {t('admin.dashboard.stats.fromLastWeek')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.dashboard.stats.shiftsThisMonth')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.shiftsThisMonth}</div>
                <div className="text-xs text-muted-foreground">
                  {t('admin.dashboard.stats.targetProgress')}
                </div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: '74%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.dashboard.stats.systemHealth')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getHealthColor(stats.systemHealth)}`}>
                {getHealthIcon(stats.systemHealth)}
              </div>
              <div>
                <Badge className={getHealthColor(stats.systemHealth)}>
                  {t(`admin.dashboard.health.${stats.systemHealth}`)}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.pendingChanges} {t('admin.dashboard.stats.pendingChanges')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboard.recentActivity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {activity.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString('cs-CZ')}
                  </div>
                </div>
                <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                  {t(`admin.dashboard.status.${activity.status}`)}
                </Badge>
              </div>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('admin.dashboard.recentActivity.empty')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboard.quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span className="text-sm">{t('admin.dashboard.quickActions.manageGroups')}</span>
            </Button>
            <Button className="h-auto p-4 flex-col gap-2" variant="outline">
              <Clock className="h-6 w-6" />
              <span className="text-sm">{t('admin.dashboard.quickActions.bulkShifts')}</span>
            </Button>
            <Button className="h-auto p-4 flex-col gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">{t('admin.dashboard.quickActions.viewReports')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickDashboard;
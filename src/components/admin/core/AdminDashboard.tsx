
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Crown, 
  Activity, 
  TrendingUp, 
  Database,
  Server,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAdminContext } from './AdminProvider';

export const AdminDashboard: React.FC = () => {
  const { stats, isLoading } = useAdminContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Celkem uživatelů',
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      description: '+12% oproti minulému měsíci',
      trend: 'up'
    },
    {
      title: 'Premium uživatelé',
      value: stats.premiumUsers,
      icon: <Crown className="h-6 w-6" />,
      description: `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% konverzní poměr`,
      trend: 'up'
    },
    {
      title: 'Aktivní uživatelé',
      value: stats.activeUsers,
      icon: <Activity className="h-6 w-6" />,
      description: 'Za posledních 30 dní',
      trend: 'stable'
    },
    {
      title: 'Systémová dostupnost',
      value: `${stats.systemHealth}%`,
      icon: <Server className="h-6 w-6" />,
      description: 'Aktuální uptime',
      trend: 'up'
    }
  ];

  const systemStatus = [
    { name: 'Database', status: 'healthy', latency: '23ms' },
    { name: 'API Server', status: 'healthy', latency: '45ms' },
    { name: 'Authentication', status: 'healthy', latency: '12ms' },
    { name: 'File Storage', status: 'warning', latency: '120ms' }
  ];

  const recentActivity = [
    { type: 'user_registration', message: 'Nový uživatel se zaregistroval', time: '2 minuty', user: 'jan.novak@email.cz' },
    { type: 'premium_upgrade', message: 'Upgrade na premium účet', time: '15 minut', user: 'anna.svoboda@email.cz' },
    { type: 'system_alert', message: 'Vysoké využití CPU', time: '1 hodina', user: 'system' },
    { type: 'data_export', message: 'Export uživatelských dat', time: '2 hodiny', user: 'admin@pendlerapp.com' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Přehled všech důležitých metrik a aktivit v aplikaci
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="text-muted-foreground">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Stav systému</CardTitle>
            <CardDescription>
              Real-time monitoring systémových komponent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {service.status === 'healthy' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={service.status === 'healthy' ? 'default' : 'secondary'}>
                      {service.latency}
                    </Badge>
                    <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                      {service.status === 'healthy' ? 'OK' : 'WARNING'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Nedávná aktivita</CardTitle>
            <CardDescription>
              Poslední události v systému
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

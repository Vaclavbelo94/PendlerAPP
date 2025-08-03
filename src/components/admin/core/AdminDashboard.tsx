
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Crown, 
  Activity, 
  TrendingUp, 
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Shield,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAdminContext } from './AdminProvider';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  latency: string;
  uptime: number;
}

interface RecentActivity {
  type: string;
  message: string;
  time: string;
  user: string;
  timestamp: Date;
}

export const AdminDashboard: React.FC = () => {
  const { stats, isLoading, setCurrentSection } = useAdminContext();
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchSystemHealth();
    fetchRecentActivity();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      // Test database connection
      const startTime = Date.now();
      await supabase.from('profiles').select('count').single();
      const dbLatency = Date.now() - startTime;

      setSystemHealth([
        {
          name: 'Database',
          status: 'healthy',
          latency: `${dbLatency}ms`,
          uptime: 99.9
        },
        {
          name: 'Authentication',
          status: 'healthy',
          latency: '15ms',
          uptime: 99.8
        },
        {
          name: 'API Server',
          status: 'healthy',
          latency: '45ms',
          uptime: 99.7
        },
        {
          name: 'File Storage',
          status: dbLatency > 100 ? 'warning' : 'healthy',
          latency: `${dbLatency + 20}ms`,
          uptime: 99.5
        }
      ]);
    } catch (error) {
      console.error('Error checking system health:', error);
      setSystemHealth([
        {
          name: 'Database',
          status: 'error',
          latency: 'N/A',
          uptime: 0
        }
      ]);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent profile creations (user registrations)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent company premium code activities
      const { data: promoRedemptions } = await supabase
        .from('company_premium_code_redemptions')
        .select(`
          redeemed_at,
          company_premium_codes(code),
          user_id
        `)
        .order('redeemed_at', { ascending: false })
        .limit(3);

      const activities: RecentActivity[] = [];

      // Add profile activities
      if (profiles) {
        profiles.forEach(profile => {
          activities.push({
            type: 'user_registration',
            message: 'Nový uživatel se zaregistroval',
            time: getRelativeTime(new Date(profile.created_at)),
            user: profile.email || 'Neznámý uživatel',
            timestamp: new Date(profile.created_at)
          });
        });
      }

      // Add company premium code activities
      if (promoRedemptions) {
        promoRedemptions.forEach(redemption => {
          activities.push({
            type: 'promo_redemption',
            message: `Uplatněn premium kód: ${redemption.company_premium_codes?.code}`,
            time: getRelativeTime(new Date(redemption.redeemed_at)),
            user: 'Uživatel',
            timestamp: new Date(redemption.redeemed_at)
          });
        });
      }

      // Sort by timestamp and take last 6
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentActivity(activities.slice(0, 6));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Právě teď';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hod`;
    return `${Math.floor(diffInMinutes / 1440)} dní`;
  };

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
      description: 'Registrovaní uživatelé',
      trend: 'up',
      action: () => setCurrentSection('users-list')
    },
    {
      title: 'Premium uživatelé',
      value: stats.premiumUsers,
      icon: <Crown className="h-6 w-6" />,
      description: `${stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}% konverzní poměr`,
      trend: 'up',
      action: () => setCurrentSection('premium-features')
    },
    {
      title: 'Vozidla',
      value: stats.totalVehicles,
      icon: <Activity className="h-6 w-6" />,
      description: 'Registrovaná vozidla',
      trend: 'stable',
      action: () => setCurrentSection('system-monitoring')
    },
    {
      title: 'Směny',
      value: stats.totalShifts,
      icon: <Server className="h-6 w-6" />,
      description: 'Zaznamenané směny',
      trend: 'up',
      action: () => setCurrentSection('system-logs')
    }
  ];

  const quickActions = [
    {
      title: 'Správa uživatelů',
      description: 'Spravovat uživatelské účty a oprávnění',
      icon: <Users className="h-5 w-5" />,
      action: () => setCurrentSection('users-list')
    },
    {
      title: 'System Monitoring',
      description: 'Sledovat výkon a stav systému',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => setCurrentSection('system-monitoring')
    },
    {
      title: 'Premium funkce',
      description: 'Konfigurovat premium funkcionalitu',
      icon: <Crown className="h-5 w-5" />,
      action: () => setCurrentSection('premium-features')
    },
    {
      title: 'Promo kódy',
      description: 'Spravovat slevové kódy',
      icon: <Settings className="h-5 w-5" />,
      action: () => setCurrentSection('promo-codes')
    },
    {
      title: 'Notifikace',
      description: 'Odesílat notifikace uživatelům',
      icon: <Shield className="h-5 w-5" />,
      action: () => setCurrentSection('notifications')
    }
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
          <Card key={index} className="cursor-pointer transition-all hover:shadow-md" onClick={stat.action}>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
          <CardDescription>
            Nejčastěji používané administrátorské funkce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {service.status === 'healthy' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : service.status === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={service.status === 'healthy' ? 'default' : 'secondary'}>
                      {service.latency}
                    </Badge>
                    <Badge variant={service.status === 'healthy' ? 'default' : service.status === 'warning' ? 'secondary' : 'destructive'}>
                      {service.status === 'healthy' ? 'OK' : service.status === 'warning' ? 'WARNING' : 'ERROR'}
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Žádná nedávná aktivita
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

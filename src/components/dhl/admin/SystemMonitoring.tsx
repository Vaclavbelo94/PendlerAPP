import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Server, 
  Users, 
  Clock,
  RefreshCw,
  Wifi,
  HardDrive
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  database: {
    status: 'healthy' | 'warning' | 'error';
    connectionCount: number;
    responseTime: number;
    lastBackup: string;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    dhlEmployees: number;
    onlineNow: number;
  };
  shifts: {
    totalShifts: number;
    todayShifts: number;
    upcomingShifts: number;
    conflictCount: number;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
    memoryUsage: number;
  };
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

const SystemMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      // Fetch various system metrics
      const [usersData, shiftsData, profilesData] = await Promise.all([
        supabase.from('profiles').select('id, created_at, is_dhl_employee').limit(1000),
        supabase.from('shifts').select('id, date, start_time, end_time').limit(1000),
        supabase.from('user_statistics').select('last_login').limit(100)
      ]);

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate metrics
      const totalUsers = usersData.data?.length || 0;
      const dhlEmployees = usersData.data?.filter(u => u.is_dhl_employee).length || 0;
      const activeUsers = profilesData.data?.filter(stat => 
        stat.last_login && new Date(stat.last_login) > thirtyDaysAgo
      ).length || 0;

      const totalShifts = shiftsData.data?.length || 0;
      const todayShifts = shiftsData.data?.filter(s => s.date === today).length || 0;
      const upcomingShifts = shiftsData.data?.filter(s => s.date > today).length || 0;

      // Mock some performance metrics (in real app these would come from actual monitoring)
      const performanceMetrics = {
        avgResponseTime: Math.random() * 200 + 50, // 50-250ms
        errorRate: Math.random() * 2, // 0-2%
        uptime: 99.5 + Math.random() * 0.5, // 99.5-100%
        memoryUsage: Math.random() * 40 + 30 // 30-70%
      };

      const systemMetrics: SystemMetrics = {
        database: {
          status: 'healthy',
          connectionCount: Math.floor(Math.random() * 20) + 5,
          responseTime: Math.floor(Math.random() * 50) + 10,
          lastBackup: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
        },
        users: {
          totalUsers,
          activeUsers,
          dhlEmployees,
          onlineNow: Math.floor(Math.random() * activeUsers) + 1
        },
        shifts: {
          totalShifts,
          todayShifts,
          upcomingShifts,
          conflictCount: Math.floor(Math.random() * 3) // Mock conflicts
        },
        performance: performanceMetrics
      };

      setMetrics(systemMetrics);
      
      // Generate sample alerts
      const sampleAlerts: SystemAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Vysoké vytížení databáze',
          description: 'Databáze má zvýšené vytížení během špičky',
          timestamp: new Date(now.getTime() - 15 * 60 * 1000),
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Plánovaná údržba',
          description: 'Systém bude v neděli od 2:00 do 4:00 nedostupný',
          timestamp: new Date(now.getTime() - 60 * 60 * 1000),
          resolved: false
        }
      ];

      if (Math.random() > 0.7) { // 30% chance of having alerts
        setAlerts(sampleAlerts);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst systémové metriky",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Nepodařilo se načíst systémové metriky
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoring systému
              </CardTitle>
              <CardDescription>
                Přehled stavu systému a výkonnostních metrik
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Poslední aktualizace: {lastUpdate.toLocaleTimeString('cs-CZ')}
              </span>
              <Button variant="outline" size="sm" onClick={fetchSystemMetrics}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Databáze</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(metrics.database.status)}
                  <span className={`text-sm font-medium ${getStatusColor(metrics.database.status)}`}>
                    {metrics.database.status === 'healthy' ? 'V pořádku' : 'Problémy'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.database.responseTime}ms odezva
                </p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uživatelé</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold">{metrics.users.onlineNow}</span>
                  <span className="text-sm text-muted-foreground">online</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  z {metrics.users.totalUsers} celkem
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Směny dnes</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold">{metrics.shifts.todayShifts}</span>
                  {metrics.shifts.conflictCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {metrics.shifts.conflictCount} konflikty
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.shifts.upcomingShifts} nadcházejících
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-green-600">
                    {formatUptime(metrics.performance.uptime)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.performance.avgResponseTime.toFixed(0)}ms avg odezva
                </p>
              </div>
              <Server className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Výkonnostní metriky</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Využití paměti</span>
                <span>{metrics.performance.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.performance.memoryUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Chybovost</span>
                <span>{metrics.performance.errorRate.toFixed(2)}%</span>
              </div>
              <Progress 
                value={metrics.performance.errorRate} 
                className="h-2" 
                max={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{metrics.database.connectionCount}</p>
                <p className="text-sm text-muted-foreground">DB připojení</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{metrics.performance.avgResponseTime.toFixed(0)}ms</p>
                <p className="text-sm text-muted-foreground">Avg. odezva</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uživatelská aktivita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Celkem uživatelů</span>
                <Badge variant="outline">{metrics.users.totalUsers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">DHL zaměstnanci</span>
                <Badge variant="secondary">{metrics.users.dhlEmployees}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Aktivní (30 dní)</span>
                <Badge variant="default">{metrics.users.activeUsers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Online teď</span>
                <Badge variant="default" className="bg-green-500">
                  <Wifi className="h-3 w-3 mr-1" />
                  {metrics.users.onlineNow}
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Aktivita uživatelů</span>
                <span>{((metrics.users.activeUsers / metrics.users.totalUsers) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(metrics.users.activeUsers / metrics.users.totalUsers) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Systémová upozornění</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.type === 'error' ? 'border-red-200' :
                alert.type === 'warning' ? 'border-yellow-200' :
                'border-blue-200'
              }>
                <AlertTriangle className="h-4 w-4" />
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <AlertDescription className="mt-1">
                      {alert.description}
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {alert.timestamp.toLocaleString('cs-CZ')}
                    </p>
                  </div>
                  <Badge variant={
                    alert.type === 'error' ? 'destructive' :
                    alert.type === 'warning' ? 'secondary' :
                    'default'
                  }>
                    {alert.type === 'error' ? 'Chyba' :
                     alert.type === 'warning' ? 'Varování' :
                     'Info'}
                  </Badge>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rychlé akce</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={fetchSystemMetrics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualizovat metriky
            </Button>
            <Button variant="outline">
              <HardDrive className="h-4 w-4 mr-2" />
              Vyčistit cache
            </Button>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Optimalizovat DB
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Exportovat logy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
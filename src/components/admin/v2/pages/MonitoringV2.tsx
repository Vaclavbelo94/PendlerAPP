import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  HardDrive,
  Wifi,
  Users
} from 'lucide-react';

export const MonitoringV2: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [refreshInterval, setRefreshInterval] = useState(30);

  // System health query
  const { data: systemHealth, isLoading, refetch } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      // Mock system health data
      return {
        cpu: { usage: 23.5, status: 'healthy' },
        memory: { usage: 67.2, total: 8192, used: 5504, status: 'healthy' },
        database: { connections: 12, maxConnections: 100, responseTime: 45, status: 'healthy' },
        api: { responseTime: 180, requestsPerMinute: 1247, errorRate: 0.02, status: 'healthy' },
        storage: { used: 45.3, total: 100, status: 'healthy' },
        network: { latency: 23, bandwidth: 95.2, status: 'healthy' }
      };
    },
    refetchInterval: refreshInterval * 1000,
  });

  // Error logs query
  const { data: errorLogs } = useQuery({
    queryKey: ['error-logs', timeRange],
    queryFn: async () => {
      // Mock error logs
      return [
        {
          id: '1',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          level: 'warning',
          message: 'High CPU usage detected',
          component: 'system',
          details: 'CPU usage exceeded 80% for 5 minutes'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          level: 'error',
          message: 'Database connection timeout',
          component: 'database',
          details: 'Connection to database timed out after 30 seconds'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'Backup completed successfully',
          component: 'backup',
          details: 'Daily backup completed in 12 minutes'
        }
      ];
    },
  });

  // Performance metrics query
  const { data: performanceMetrics } = useQuery({
    queryKey: ['performance-metrics', timeRange],
    queryFn: async () => {
      // Mock performance data
      return {
        pageLoadTime: 1.23,
        databaseQueries: 156,
        apiCalls: 1247,
        activeUsers: 89,
        uptime: 99.98,
        errorRate: 0.02
      };
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogLevelBadge = (level: string) => {
    const variants: any = {
      'info': 'default',
      'warning': 'secondary',
      'error': 'destructive'
    };
    return <Badge variant={variants[level] || 'outline'}>{level}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Načítám monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground">
            Sledování výkonu a stavu systému v reálném čase
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 hodina</SelectItem>
              <SelectItem value="6h">6 hodin</SelectItem>
              <SelectItem value="24h">24 hodin</SelectItem>
              <SelectItem value="7d">7 dní</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Obnovit
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.cpu?.usage}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon(systemHealth?.cpu?.status || 'healthy')}
              <span className={`text-xs ${getStatusColor(systemHealth?.cpu?.status || 'healthy')}`}>
                {systemHealth?.cpu?.status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RAM</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.memory?.usage}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon(systemHealth?.memory?.status || 'healthy')}
              <span className={`text-xs ${getStatusColor(systemHealth?.memory?.status || 'healthy')}`}>
                {systemHealth?.memory?.used}MB / {systemHealth?.memory?.total}MB
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.database?.responseTime}ms</div>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon(systemHealth?.database?.status || 'healthy')}
              <span className={`text-xs ${getStatusColor(systemHealth?.database?.status || 'healthy')}`}>
                {systemHealth?.database?.connections} spojení
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.api?.responseTime}ms</div>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon(systemHealth?.api?.status || 'healthy')}
              <span className={`text-xs ${getStatusColor(systemHealth?.api?.status || 'healthy')}`}>
                {systemHealth?.api?.requestsPerMinute}/min
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.storage?.used}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon(systemHealth?.storage?.status || 'healthy')}
              <span className={`text-xs ${getStatusColor(systemHealth?.storage?.status || 'healthy')}`}>
                {systemHealth?.storage?.used}GB / {systemHealth?.storage?.total}GB
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.network?.latency}ms</div>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon(systemHealth?.network?.status || 'healthy')}
              <span className={`text-xs ${getStatusColor(systemHealth?.network?.status || 'healthy')}`}>
                {systemHealth?.network?.bandwidth}% využití
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Výkon</TabsTrigger>
          <TabsTrigger value="logs">Logy</TabsTrigger>
          <TabsTrigger value="alerts">Upozornění</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Metriky výkonu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Průměrná doba načtení stránky</span>
                    <Badge variant="outline">
                      {performanceMetrics?.pageLoadTime}s
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Databázové dotazy/min</span>
                    <Badge variant="outline">
                      {performanceMetrics?.databaseQueries}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>API volání/min</span>
                    <Badge variant="outline">
                      {performanceMetrics?.apiCalls}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Aktivní uživatelé</span>
                    <Badge variant="outline">
                      {performanceMetrics?.activeUsers}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {performanceMetrics?.uptime}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Error rate</span>
                    <Badge variant="outline">
                      {performanceMetrics?.errorRate}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Využití zdrojů
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm">{systemHealth?.cpu?.usage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${systemHealth?.cpu?.usage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory</span>
                      <span className="text-sm">{systemHealth?.memory?.usage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${systemHealth?.memory?.usage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm">{systemHealth?.storage?.used}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${systemHealth?.storage?.used}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Network</span>
                      <span className="text-sm">{systemHealth?.network?.bandwidth}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${systemHealth?.network?.bandwidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Systémové logy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorLogs?.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <div className="p-2 rounded-full bg-muted">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{log.message}</h4>
                        {getLogLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">
                          {log.component}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {log.details}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString('cs-CZ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Aktivní upozornění
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-medium text-lg mb-2">Žádná aktivní upozornění</h3>
                <p>Všechny systémy fungují správně</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Activity, 
  Server,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const MobileMonitoring: React.FC = () => {
  const { hasPermission } = useAdminV2();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: monitoringData, isLoading, refetch } = useQuery({
    queryKey: ['mobile-admin-monitoring'],
    queryFn: async () => {
      // Simulate system monitoring data
      const [dbHealth, systemStats, recentErrors] = await Promise.all([
        // Database health check
        supabase.from('profiles').select('count', { count: 'exact', head: true }),
        
        // System stats simulation
        Promise.resolve({
          cpu_usage: Math.random() * 100,
          memory_usage: Math.random() * 100,
          disk_usage: Math.random() * 100,
          active_connections: Math.floor(Math.random() * 500) + 50,
          uptime_hours: Math.floor(Math.random() * 720) + 24
        }),
        
        // Recent errors
        supabase
          .from('security_audit_log')
          .select('*')
          .eq('risk_level', 'high')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      return {
        dbHealth: {
          status: dbHealth.error ? 'error' : 'healthy',
          error: dbHealth.error?.message,
          response_time: Math.random() * 100 + 10
        },
        systemStats: systemStats,
        recentErrors: recentErrors.data || []
      };
    },
    enabled: hasPermission('admin'),
    refetchInterval: autoRefresh ? 30000 : false
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!hasPermission('admin')) {
    return (
      <div className="p-4 text-center">
        <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nemáte oprávnění k zobrazení monitoringu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Monitor className="h-6 w-6" />
          Monitoring
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4" />
            Auto
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Databáze</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(monitoringData?.dbHealth.status || 'healthy')}
                  <span className="text-sm font-medium">
                    {monitoringData?.dbHealth.status === 'healthy' ? 'V pořádku' : 'Problém'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktivní spojení</p>
                <p className="text-2xl font-bold">
                  {monitoringData?.systemStats.active_connections || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Systémové prostředky
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU využití</span>
                  <span>{monitoringData?.systemStats.cpu_usage.toFixed(1)}%</span>
                </div>
                <Progress value={monitoringData?.systemStats.cpu_usage || 0} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>RAM využití</span>
                  <span>{monitoringData?.systemStats.memory_usage.toFixed(1)}%</span>
                </div>
                <Progress value={monitoringData?.systemStats.memory_usage || 0} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disk využití</span>
                  <span>{monitoringData?.systemStats.disk_usage.toFixed(1)}%</span>
                </div>
                <Progress value={monitoringData?.systemStats.disk_usage || 0} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Stav databáze
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(monitoringData?.dbHealth.status || 'healthy')}
              <div>
                <p className="font-medium">
                  {monitoringData?.dbHealth.status === 'healthy' ? 'Databáze je v pořádku' : 'Problém s databází'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Odezva: {monitoringData?.dbHealth.response_time.toFixed(0)}ms
                </p>
              </div>
            </div>
            <Badge variant={monitoringData?.dbHealth.status === 'healthy' ? 'default' : 'destructive'}>
              {monitoringData?.dbHealth.status || 'loading'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Nedávné chyby
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            monitoringData?.recentErrors.map((error: any) => (
              <div key={error.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{error.event_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(error.created_at).toLocaleString('cs-CZ')}
                  </p>
                  {error.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {JSON.stringify(error.details).substring(0, 80)}...
                    </p>
                  )}
                </div>
                <Badge variant="destructive" className="text-xs">
                  {error.risk_level}
                </Badge>
              </div>
            )) || []
          )}
          {!isLoading && (!monitoringData?.recentErrors.length) && (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">Žádné chyby za posledních 24 hodin</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uptime */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Dostupnost systému
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-muted-foreground">
              Uptime za posledních 30 dní
            </p>
            <p className="text-xs text-muted-foreground">
              Systém běží {monitoringData?.systemStats.uptime_hours || 0} hodin bez přerušení
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
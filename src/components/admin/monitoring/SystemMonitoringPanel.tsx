
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    inbound: number;
    outbound: number;
    latency: number;
  };
  database: {
    connections: number;
    maxConnections: number;
    queryTime: number;
    slowQueries: number;
  };
  api: {
    requestsPerSecond: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  responseTime: number;
}

const SystemMonitoringPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([]);
  const [alerts, setAlerts] = useState<Array<{ id: string; type: 'warning' | 'error'; message: string; timestamp: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Aktualizace každých 30 sekund
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Simulovaná data - v reálné aplikaci by se načítala z monitoring serveru
      const currentTime = new Date().toISOString();
      
      const newMetrics: SystemMetrics = {
        cpu: {
          usage: Math.random() * 100,
          cores: 4,
          temperature: 45 + Math.random() * 20
        },
        memory: {
          used: 6.2 + Math.random() * 2,
          total: 16,
          percentage: 0
        },
        disk: {
          used: 120 + Math.random() * 20,
          total: 500,
          percentage: 0
        },
        network: {
          inbound: Math.random() * 100,
          outbound: Math.random() * 50,
          latency: 10 + Math.random() * 20
        },
        database: {
          connections: Math.floor(Math.random() * 50) + 10,
          maxConnections: 100,
          queryTime: 50 + Math.random() * 100,
          slowQueries: Math.floor(Math.random() * 5)
        },
        api: {
          requestsPerSecond: Math.random() * 200,
          averageResponseTime: 100 + Math.random() * 200,
          errorRate: Math.random() * 5,
          uptime: 99.5 + Math.random() * 0.5
        }
      };

      newMetrics.memory.percentage = (newMetrics.memory.used / newMetrics.memory.total) * 100;
      newMetrics.disk.percentage = (newMetrics.disk.used / newMetrics.disk.total) * 100;

      setMetrics(newMetrics);

      // Přidání do performance historie
      const newPerformanceData: PerformanceData = {
        timestamp: new Date().toLocaleTimeString('cs-CZ'),
        cpu: newMetrics.cpu.usage,
        memory: newMetrics.memory.percentage,
        network: newMetrics.network.inbound + newMetrics.network.outbound,
        responseTime: newMetrics.api.averageResponseTime
      };

      setPerformanceHistory(prev => {
        const updated = [...prev, newPerformanceData];
        return updated.length > 20 ? updated.slice(-20) : updated; // Udržet pouze posledních 20 záznamů
      });

      // Kontrola alertů
      const newAlerts: Array<{ id: string; type: 'warning' | 'error'; message: string; timestamp: string }> = [];
      
      if (newMetrics.cpu.usage > 80) {
        newAlerts.push({
          id: `cpu-${Date.now()}`,
          type: 'warning',
          message: `Vysoké využití CPU: ${newMetrics.cpu.usage.toFixed(1)}%`,
          timestamp: currentTime
        });
      }

      if (newMetrics.memory.percentage > 85) {
        newAlerts.push({
          id: `memory-${Date.now()}`,
          type: 'error',
          message: `Kritické využití paměti: ${newMetrics.memory.percentage.toFixed(1)}%`,
          timestamp: currentTime
        });
      }

      if (newMetrics.api.errorRate > 3) {
        newAlerts.push({
          id: `api-${Date.now()}`,
          type: 'warning',
          message: `Vysoká chybovost API: ${newMetrics.api.errorRate.toFixed(1)}%`,
          timestamp: currentTime
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Udržet pouze posledních 10 alertů
      }

    } catch (error) {
      console.error('Chyba při načítání metrik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <Badge variant="destructive">Kritické</Badge>;
    if (value >= thresholds.warning) return <Badge variant="secondary">Upozornění</Badge>;
    return <Badge variant="default">OK</Badge>;
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-center text-muted-foreground">Nepodařilo se načíst systémové metriky</div>;
  }

  return (
    <div className="space-y-6">
      {/* Aktuální alerty */}
      {alerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString('cs-CZ')}
                  </span>
                </div>
              ))}
              {alerts.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  ... a {alerts.length - 3} dalších alertů
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="performance">Výkon</TabsTrigger>
          <TabsTrigger value="database">Databáze</TabsTrigger>
          <TabsTrigger value="network">Síť</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="h-5 w-5 text-muted-foreground" />
                  {getStatusBadge(metrics.cpu.usage, { warning: 70, critical: 90 })}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU</span>
                    <span className={`text-sm font-mono ${getStatusColor(metrics.cpu.usage)}`}>
                      {metrics.cpu.usage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.cpu.usage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {metrics.cpu.cores} jader, {metrics.cpu.temperature.toFixed(1)}°C
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <MemoryStick className="h-5 w-5 text-muted-foreground" />
                  {getStatusBadge(metrics.memory.percentage, { warning: 70, critical: 85 })}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">RAM</span>
                    <span className={`text-sm font-mono ${getStatusColor(metrics.memory.percentage)}`}>
                      {metrics.memory.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.memory.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {metrics.memory.used.toFixed(1)} / {metrics.memory.total} GB
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disk */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <HardDrive className="h-5 w-5 text-muted-foreground" />
                  {getStatusBadge(metrics.disk.percentage, { warning: 80, critical: 95 })}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Disk</span>
                    <span className={`text-sm font-mono ${getStatusColor(metrics.disk.percentage)}`}>
                      {metrics.disk.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.disk.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {metrics.disk.used} / {metrics.disk.total} GB
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Uptime */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-mono text-green-500">
                      {metrics.api.uptime.toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={metrics.api.uptime} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {metrics.api.requestsPerSecond.toFixed(0)} req/s, {metrics.api.averageResponseTime.toFixed(0)}ms
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Výkonnostní metriky v čase</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
                  <Line type="monotone" dataKey="responseTime" stroke="#ffc658" name="Response Time (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Databázové spojení
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Aktivní spojení:</span>
                  <span className="font-mono">{metrics.database.connections}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum spojení:</span>
                  <span className="font-mono">{metrics.database.maxConnections}</span>
                </div>
                <Progress 
                  value={(metrics.database.connections / metrics.database.maxConnections) * 100} 
                  className="h-2" 
                />
                <div className="text-xs text-muted-foreground">
                  Využití: {((metrics.database.connections / metrics.database.maxConnections) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Výkon dotazů</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Průměrný čas dotazu:</span>
                  <span className="font-mono">{metrics.database.queryTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Pomalé dotazy:</span>
                  <span className="font-mono">{metrics.database.slowQueries}</span>
                </div>
                {metrics.database.slowQueries > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Detekováno {metrics.database.slowQueries} pomalých dotazů
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Síťový provoz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Inbound:</span>
                  <span className="font-mono">{metrics.network.inbound.toFixed(1)} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Outbound:</span>
                  <span className="font-mono">{metrics.network.outbound.toFixed(1)} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Latence:</span>
                  <span className="font-mono">{metrics.network.latency.toFixed(1)}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API metriky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Requests/sec:</span>
                  <span className="font-mono">{metrics.api.requestsPerSecond.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg response:</span>
                  <span className="font-mono">{metrics.api.averageResponseTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Error rate:</span>
                  <span className={`font-mono ${metrics.api.errorRate > 3 ? 'text-red-500' : 'text-green-500'}`}>
                    {metrics.api.errorRate.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={loadMetrics} variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Aktualizovat metriky
        </Button>
      </div>
    </div>
  );
};

export default SystemMonitoringPanel;

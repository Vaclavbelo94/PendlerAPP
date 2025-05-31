
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetric {
  pageLoadTime: number;
  firstContentfulPaint: number;
  memoryUsage?: number;
  timestamp: number;
  url: string;
}

interface ErrorReport {
  message: string;
  timestamp: number;
  url: string;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    
    // Load performance metrics
    const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
    setMetrics(storedMetrics.slice(-20)); // Last 20 metrics
    
    // Load error reports
    const storedErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
    setErrors(storedErrors.slice(0, 10)); // Last 10 errors
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const averageMetrics = React.useMemo(() => {
    if (metrics.length === 0) return null;
    
    return {
      avgPageLoad: Math.round(metrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / metrics.length),
      avgFCP: Math.round(metrics.reduce((sum, m) => sum + m.firstContentfulPaint, 0) / metrics.length),
      avgMemory: metrics.filter(m => m.memoryUsage).length > 0 
        ? Math.round(metrics.reduce((sum, m) => sum + (m.memoryUsage || 0), 0) / metrics.filter(m => m.memoryUsage).length)
        : 0
    };
  }, [metrics]);

  const chartData = React.useMemo(() => {
    return metrics.map(metric => ({
      time: new Date(metric.timestamp).toLocaleTimeString('cs-CZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      pageLoad: Math.round(metric.pageLoadTime),
      fcp: Math.round(metric.firstContentfulPaint),
      memory: metric.memoryUsage || 0
    }));
  }, [metrics]);

  const getPerformanceStatus = (value: number, thresholds: { good: number; fair: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'text-green-600' };
    if (value <= thresholds.fair) return { status: 'fair', color: 'text-yellow-600' };
    return { status: 'poor', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitorování výkonu aplikace
          </p>
        </div>
        
        <Button variant="outline" onClick={loadData} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Obnovit
        </Button>
      </div>

      {/* Key Metrics Cards */}
      {averageMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Průměrný čas načtení
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMetrics.avgPageLoad}ms</div>
              <div className={`text-sm flex items-center gap-1 mt-1 ${
                getPerformanceStatus(averageMetrics.avgPageLoad, { good: 1000, fair: 3000 }).color
              }`}>
                {averageMetrics.avgPageLoad <= 1000 ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {getPerformanceStatus(averageMetrics.avgPageLoad, { good: 1000, fair: 3000 }).status === 'good' 
                  ? 'Výborný' : 'Potřebuje zlepšení'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                First Contentful Paint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMetrics.avgFCP}ms</div>
              <div className={`text-sm flex items-center gap-1 mt-1 ${
                getPerformanceStatus(averageMetrics.avgFCP, { good: 1800, fair: 3000 }).color
              }`}>
                {averageMetrics.avgFCP <= 1800 ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {getPerformanceStatus(averageMetrics.avgFCP, { good: 1800, fair: 3000 }).status === 'good' 
                  ? 'Výborný' : 'Potřebuje zlepšení'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Využití paměti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMetrics.avgMemory}MB</div>
              <div className={`text-sm flex items-center gap-1 mt-1 ${
                getPerformanceStatus(averageMetrics.avgMemory, { good: 50, fair: 100 }).color
              }`}>
                {averageMetrics.avgMemory <= 50 ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {getPerformanceStatus(averageMetrics.avgMemory, { good: 50, fair: 100 }).status === 'good' 
                  ? 'Optimální' : 'Vysoké'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Časy načítání stránek</CardTitle>
            <CardDescription>Posledních 20 měření</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pageLoad" stroke="#8884d8" name="Načtení (ms)" />
                <Line type="monotone" dataKey="fcp" stroke="#82ca9d" name="FCP (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Využití paměti</CardTitle>
            <CardDescription>RAM v megabytech</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="memory" stroke="#ff7300" fill="#ff7300" name="Paměť (MB)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Error Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Nejnovější chyby
          </CardTitle>
          <CardDescription>
            Posledních {errors.length} zaznamenaných chyb
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Žádné chyby nebyly zaznamenány 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {errors.map((error, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{error.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{new Date(error.timestamp).toLocaleString('cs-CZ')}</span>
                      <span>•</span>
                      <span className="truncate">{error.url}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Wifi, 
  HardDrive, 
  Zap,
  AlertTriangle 
} from 'lucide-react';

interface HealthMetrics {
  database: 'healthy' | 'warning' | 'error';
  network: 'online' | 'offline' | 'slow';
  storage: number; // percentage used
  memory: number; // MB used
  performance: number; // score 0-100
}

export const HealthMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    database: 'healthy',
    network: 'online',
    storage: 0,
    memory: 0,
    performance: 100
  });

  useEffect(() => {
    const checkHealth = () => {
      // Network status
      const networkStatus = navigator.onLine ? 'online' : 'offline';
      
      // Storage usage
      let storageUsed = 0;
      try {
        const used = JSON.stringify(localStorage).length;
        const quota = 5 * 1024 * 1024; // 5MB typical quota
        storageUsed = (used / quota) * 100;
      } catch (error) {
        console.warn('Could not calculate storage usage:', error);
      }
      
      // Memory usage (if available)
      let memoryUsed = 0;
      if ('memory' in performance) {
        memoryUsed = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
      }
      
      // Performance score (simplified)
      const performanceScore = Math.max(0, 100 - (memoryUsed / 10) - (storageUsed / 2));
      
      setMetrics({
        database: 'healthy', // Would check actual DB connection in real app
        network: networkStatus,
        storage: storageUsed,
        memory: memoryUsed,
        performance: Math.round(performanceScore)
      });
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'bg-green-500';
      case 'warning':
      case 'slow':
        return 'bg-yellow-500';
      case 'error':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Stav systému
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Database */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm">Databáze</span>
          </div>
          <Badge className={getStatusColor(metrics.database)}>
            {metrics.database === 'healthy' ? 'Zdravá' : 'Problém'}
          </Badge>
        </div>

        {/* Network */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="text-sm">Síť</span>
          </div>
          <Badge className={getStatusColor(metrics.network)}>
            {metrics.network === 'online' ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {/* Storage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span className="text-sm">Úložiště</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {metrics.storage.toFixed(1)}%
            </span>
          </div>
          <Progress value={metrics.storage} className="h-2" />
        </div>

        {/* Memory */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Paměť</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {metrics.memory.toFixed(1)} MB
          </span>
        </div>

        {/* Performance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Výkon</span>
            <span className="text-sm text-muted-foreground">
              {metrics.performance}/100
            </span>
          </div>
          <Progress 
            value={metrics.performance} 
            className={`h-2 ${getPerformanceColor(metrics.performance)}`}
          />
        </div>

        {/* Warnings */}
        {(metrics.storage > 80 || metrics.memory > 100 || metrics.performance < 60) && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Upozornění na výkon</p>
              {metrics.storage > 80 && <p>• Úložiště je téměř plné</p>}
              {metrics.memory > 100 && <p>• Vysoké využití paměti</p>}
              {metrics.performance < 60 && <p>• Snížený výkon aplikace</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMonitor;

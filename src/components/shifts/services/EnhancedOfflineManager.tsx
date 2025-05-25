import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  WifiOff, 
  Wifi, 
  sync, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { AdvancedOfflineService } from './AdvancedOfflineService';
import { toast } from '@/hooks/use-toast';

interface QueueStats {
  total: number;
  pending: number;
  failed: number;
  lastSync: Date | null;
}

export const EnhancedOfflineManager: React.FC = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const [queueStats, setQueueStats] = useState<QueueStats>({
    total: 0,
    pending: 0,
    failed: 0,
    lastSync: null
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncResult, setLastSyncResult] = useState<{
    synced: number;
    conflicts: number;
    errors: number;
  } | null>(null);

  const offlineService = AdvancedOfflineService.getInstance();

  // Load queue statistics
  const loadQueueStats = useCallback(() => {
    try {
      const queue = offlineService['getOfflineQueue']();
      const pending = queue.filter(item => item.retries < 3).length;
      const failed = queue.filter(item => item.retries >= 3).length;
      
      const lastSyncStr = localStorage.getItem('last_sync_time');
      const lastSync = lastSyncStr ? new Date(lastSyncStr) : null;

      setQueueStats({
        total: queue.length,
        pending,
        failed,
        lastSync
      });
    } catch (error) {
      console.error('Error loading queue stats:', error);
    }
  }, [offlineService]);

  // Manual sync with progress tracking
  const handleManualSync = useCallback(async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await offlineService.syncWithConflictResolution(user.id);
      
      clearInterval(progressInterval);
      setSyncProgress(100);
      
      setLastSyncResult(result);
      localStorage.setItem('last_sync_time', new Date().toISOString());
      
      toast({
        title: "Synchronizace dokončena",
        description: `Synchronizováno: ${result.synced}, Konflikty: ${result.conflicts}, Chyby: ${result.errors}`,
      });

      // Refresh stats after sync
      setTimeout(() => {
        loadQueueStats();
        setSyncProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Chyba synchronizace",
        description: "Nepodařilo se synchronizovat data. Zkuste to později.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, isSyncing, offlineService, loadQueueStats]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && queueStats.pending > 0 && !isSyncing) {
      handleManualSync();
    }
  }, [isOffline, queueStats.pending, isSyncing, handleManualSync]);

  // Load stats on mount and periodically
  useEffect(() => {
    loadQueueStats();
    const interval = setInterval(loadQueueStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [loadQueueStats]);

  // Clear failed items
  const clearFailedItems = useCallback(() => {
    try {
      const queue = offlineService['getOfflineQueue']();
      const filteredQueue = queue.filter(item => item.retries < 3);
      localStorage.setItem('offline_shifts_queue', JSON.stringify(filteredQueue));
      loadQueueStats();
      
      toast({
        title: "Neúspěšné položky vymazány",
        description: "Všechny neúspěšné synchronizace byly odstraněny.",
      });
    } catch (error) {
      console.error('Error clearing failed items:', error);
    }
  }, [offlineService, loadQueueStats]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOffline ? (
            <WifiOff className="h-5 w-5 text-red-500" />
          ) : (
            <Wifi className="h-5 w-5 text-green-500" />
          )}
          Offline režim
          <Badge variant={isOffline ? "destructive" : "default"}>
            {isOffline ? "Offline" : "Online"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isOffline 
              ? "Jste offline. Změny budou synchronizovány při obnovení připojení."
              : "Připojení k internetu je aktivní. Data se synchronizují automaticky."
            }
          </AlertDescription>
        </Alert>

        {/* Queue Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{queueStats.total}</div>
            <div className="text-sm text-muted-foreground">Celkem ve frontě</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{queueStats.pending}</div>
            <div className="text-sm text-muted-foreground">Čekající</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-red-600">{queueStats.failed}</div>
            <div className="text-sm text-muted-foreground">Neúspěšné</div>
          </div>
        </div>

        {/* Sync Progress */}
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <sync className="h-4 w-4 animate-spin" />
              <span className="text-sm">Synchronizace probíhá...</span>
            </div>
            <Progress value={syncProgress} className="w-full" />
          </div>
        )}

        {/* Last Sync Result */}
        {lastSyncResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Poslední synchronizace: {lastSyncResult.synced} úspěšných, 
              {lastSyncResult.conflicts} konfliktů, {lastSyncResult.errors} chyb
            </AlertDescription>
          </Alert>
        )}

        {/* Last Sync Time */}
        {queueStats.lastSync && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Poslední synchronizace: {queueStats.lastSync.toLocaleString('cs-CZ')}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleManualSync}
            disabled={isSyncing || isOffline}
            className="flex items-center gap-2"
          >
            <sync className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizuji...' : 'Synchronizovat nyní'}
          </Button>

          {queueStats.failed > 0 && (
            <Button
              variant="outline"
              onClick={clearFailedItems}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Vymazat neúspěšné ({queueStats.failed})
            </Button>
          )}
        </div>

        {/* Offline Instructions */}
        {isOffline && (
          <Alert>
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              <strong>Offline režim je aktivní:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Všechny změny se ukládají lokálně</li>
                <li>• Data budou synchronizována při obnovení připojení</li>
                <li>• Můžete pokračovat v práci normálně</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedOfflineManager;

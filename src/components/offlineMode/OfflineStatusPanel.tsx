
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useOfflineMaster } from '@/hooks/useOfflineMaster';
import { 
  CloudOff, 
  Wifi, 
  RefreshCw, 
  Database,
  Car,
  Calendar,
  Calculator,
  Clock
} from 'lucide-react';
import { SyncStatusIndicator } from './SyncStatusIndicator';

const OfflineStatusPanel: React.FC = () => {
  const {
    isOffline,
    totalPendingItems,
    isSyncing,
    syncAllPendingData,
    shifts,
    vehicles,
    calculations,
    syncQueue
  } = useOfflineMaster();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {isOffline ? (
            <CloudOff className="h-5 w-5 text-orange-500" />
          ) : (
            <Wifi className="h-5 w-5 text-green-500" />
          )}
          Offline Status
        </CardTitle>
        <CardDescription>
          {isOffline 
            ? "Pracujete v offline režimu" 
            : "Připojeno k internetu"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sync status indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Stav synchronizace:</span>
          <SyncStatusIndicator showDetails={false} />
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Stav připojení:</span>
          <Badge variant={isOffline ? "destructive" : "default"}>
            {isOffline ? "Offline" : "Online"}
          </Badge>
        </div>

        {/* Pending items summary */}
        {totalPendingItems > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nesynchronizováno:</span>
              <Badge variant="outline">{totalPendingItems} položek</Badge>
            </div>
            
            {/* Breakdown by category */}
            <div className="space-y-1 text-xs">
              {shifts.hasPendingShifts && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Směny</span>
                  </div>
                  <span>{shifts.offlineShifts.filter(s => !s.synced).length}</span>
                </div>
              )}
              
              {vehicles.hasPendingVehicles && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    <span>Vozidla</span>
                  </div>
                  <span>{vehicles.offlineVehicles.filter(v => !v.synced).length}</span>
                </div>
              )}
              
              {calculations.hasPendingCalculations && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Calculator className="h-3 w-3" />
                    <span>Výpočty</span>
                  </div>
                  <span>{calculations.offlineCalculations.filter(c => !c.synced).length}</span>
                </div>
              )}

              {syncQueue.queueCount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Ve frontě</span>
                  </div>
                  <span>{syncQueue.queueCount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sync progress */}
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Synchronizace...</span>
              <RefreshCw className="h-4 w-4 animate-spin" />
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )}

        {/* Offline storage stats */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Offline úložiště aktivní</span>
          </div>
        </div>

        {/* Sync button */}
        {!isOffline && totalPendingItems > 0 && (
          <Button 
            onClick={syncAllPendingData}
            disabled={isSyncing}
            className="w-full"
            size="sm"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Synchronizuji...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Synchronizovat vše ({totalPendingItems})
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineStatusPanel;

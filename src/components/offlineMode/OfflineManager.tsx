
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOfflineMaster } from '@/hooks/useOfflineMaster';
import { useSyncErrorHandler } from '@/hooks/useSyncErrorHandler';
import { SyncFeedback } from './SyncFeedback';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { OfflineNotifications } from './OfflineNotifications';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { 
  Settings, 
  Database,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

const OfflineManager: React.FC = () => {
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

  const {
    activeErrors,
    retryError,
    dismissError,
    clearAllErrors
  } = useSyncErrorHandler();

  const { settings } = useSyncSettings();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);

  const handleSyncAll = async () => {
    setSyncProgress(0);
    try {
      await syncAllPendingData();
      setLastSyncTime(new Date());
      setSyncProgress(100);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleRetryAll = async () => {
    clearAllErrors();
    await handleSyncAll();
  };

  // Calculate sync progress based on pending items
  React.useEffect(() => {
    if (isSyncing && totalPendingItems > 0) {
      // Simulate progress - in real implementation this would come from actual sync progress
      const interval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      return () => clearInterval(interval);
    } else if (!isSyncing) {
      setSyncProgress(totalPendingItems === 0 ? 100 : 0);
    }
  }, [isSyncing, totalPendingItems]);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <OfflineNotifications />

      {/* Main status card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Offline správa dat
              </CardTitle>
              <CardDescription>
                Správa offline funkcionalita a synchronizace dat
              </CardDescription>
            </div>
            <SyncStatusIndicator showDetails />
          </div>
        </CardHeader>
        <CardContent>
          <SyncFeedback
            isOffline={isOffline}
            isSyncing={isSyncing}
            syncProgress={syncProgress}
            queueCount={totalPendingItems}
            errors={activeErrors}
            lastSyncTime={lastSyncTime}
            onRetryError={retryError}
            onDismissError={dismissError}
            onRetryAll={handleRetryAll}
          />
        </CardContent>
      </Card>

      {/* Detailed management tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="queue">Fronta</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="settings">Nastavení</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stav synchronizace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{shifts.offlineShifts.length}</div>
                  <div className="text-sm text-muted-foreground">Směny</div>
                  <div className="text-xs text-muted-foreground">
                    {shifts.hasPendingShifts ? `${shifts.offlineShifts.filter(s => !s.synced).length} nesync` : 'Vše sync'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{vehicles.offlineVehicles.length}</div>
                  <div className="text-sm text-muted-foreground">Vozidla</div>
                  <div className="text-xs text-muted-foreground">
                    {vehicles.hasPendingVehicles ? `${vehicles.offlineVehicles.filter(v => !v.synced).length} nesync` : 'Vše sync'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{calculations.offlineCalculations.length}</div>
                  <div className="text-sm text-muted-foreground">Výpočty</div>
                  <div className="text-xs text-muted-foreground">
                    {calculations.hasPendingCalculations ? `${calculations.offlineCalculations.filter(c => !c.synced).length} nesync` : 'Vše sync'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{syncQueue.queueCount}</div>
                  <div className="text-sm text-muted-foreground">Ve frontě</div>
                  <div className="text-xs text-muted-foreground">
                    {syncQueue.queueCount > 0 ? 'Čeká' : 'Prázdná'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rychlé akce</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleSyncAll}
                  disabled={isSyncing || isOffline || totalPendingItems === 0}
                  className="flex-1 min-w-fit"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
                  {isSyncing ? 'Synchronizuji...' : 'Synchronizovat vše'}
                </Button>

                <Button
                  variant="outline"
                  onClick={shifts.syncPendingShifts}
                  disabled={isSyncing || isOffline || !shifts.hasPendingShifts}
                  className="flex-1 min-w-fit"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Sync směny
                </Button>

                <Button
                  variant="outline"
                  onClick={vehicles.syncPendingVehicles}
                  disabled={isSyncing || isOffline || !vehicles.hasPendingVehicles}
                  className="flex-1 min-w-fit"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Sync vozidla
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fronta synchronizace</CardTitle>
              <CardDescription>
                Přehled položek čekajících na synchronizaci
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncQueue.queueCount === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fronta synchronizace je prázdná</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Položky ve frontě:</span>
                    <span className="text-sm text-muted-foreground">{syncQueue.queueCount}</span>
                  </div>
                  <Button
                    onClick={syncQueue.processQueue}
                    disabled={isSyncing || isOffline}
                    className="w-full"
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
                    Zpracovat frontu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offline data</CardTitle>
              <CardDescription>
                Správa lokálně uložených dat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Směny</h4>
                    <p className="text-2xl font-bold">{shifts.offlineShifts.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {shifts.hasPendingShifts ? 'Má nesynchronizované' : 'Vše synchronizováno'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Vozidla</h4>
                    <p className="text-2xl font-bold">{vehicles.offlineVehicles.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicles.hasPendingVehicles ? 'Má nesynchronizované' : 'Vše synchronizováno'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Výpočty</h4>
                    <p className="text-2xl font-bold">{calculations.offlineCalculations.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {calculations.hasPendingCalculations ? 'Má nesynchronizované' : 'Vše synchronizováno'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení synchronizace</CardTitle>
              <CardDescription>
                Konfigurace offline funkcionalita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatická synchronizace</h4>
                    <p className="text-sm text-muted-foreground">
                      {settings.enableBackgroundSync ? 'Zapnuto' : 'Vypnuto'}
                    </p>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifikace synchronizace</h4>
                    <p className="text-sm text-muted-foreground">
                      {settings.showSyncNotifications ? 'Zapnuty' : 'Vypnuty'}
                    </p>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Interval synchronizace</h4>
                    <p className="text-sm text-muted-foreground">
                      {settings.syncInterval ? `${settings.syncInterval / 1000}s` : '30s'}
                    </p>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfflineManager;

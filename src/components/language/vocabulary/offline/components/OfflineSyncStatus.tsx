
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, Clock, Database } from 'lucide-react';

interface OfflineSyncStatusProps {
  isOffline: boolean;
  lastSynced: Date | null;
  isSyncing: boolean;
  syncProgress: number;
  offlineItemsCount: number;
}

export const OfflineSyncStatus: React.FC<OfflineSyncStatusProps> = ({
  isOffline,
  lastSynced,
  isSyncing,
  syncProgress,
  offlineItemsCount
}) => {
  const formatLastSynced = (date: Date | null) => {
    if (!date) return 'Nikdy';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Právě teď';
    if (diffMins < 60) return `Před ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Před ${diffHours} h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Před ${diffDays} dny`;
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isOffline ? (
            <WifiOff className="h-4 w-4 text-red-500" />
          ) : (
            <Wifi className="h-4 w-4 text-green-500" />
          )}
          <span className="text-sm font-medium">
            Stav připojení
          </span>
        </div>
        <Badge variant={isOffline ? 'destructive' : 'default'}>
          {isOffline ? 'Offline' : 'Online'}
        </Badge>
      </div>

      {/* Last Synced */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Poslední synchronizace</span>
        </div>
        <span className="text-sm text-gray-600">
          {formatLastSynced(lastSynced)}
        </span>
      </div>

      {/* Offline Items Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Offline slovíčka</span>
        </div>
        <Badge variant="outline">
          {offlineItemsCount} položek
        </Badge>
      </div>

      {/* Sync Progress */}
      {isSyncing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Synchronizace...</span>
            <span className="text-sm text-gray-600">{syncProgress}%</span>
          </div>
          <Progress value={syncProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};

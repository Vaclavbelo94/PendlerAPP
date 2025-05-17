
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudOff, Cloud, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
  return (
    <div className="space-y-4">
      {isOffline && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pracujete v offline režimu. Všechny změny budou uloženy lokálně.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Database className="mr-2 h-4 w-4" />
            Offline uložená slovíčka:
          </div>
          <span className="font-semibold">{offlineItemsCount}</span>
        </div>
        
        {lastSynced && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Poslední synchronizace: {lastSynced.toLocaleString()}
          </div>
        )}
      </div>
      
      {isSyncing && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Synchronizace</span>
            <span>{syncProgress}%</span>
          </div>
          <Progress value={syncProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};

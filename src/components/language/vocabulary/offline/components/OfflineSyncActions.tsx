
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Loader2 } from 'lucide-react';

interface OfflineSyncActionsProps {
  isSyncing: boolean;
  itemsCount: number;
  offlineItemsCount: number;
  onSaveForOffline: () => void;
  onLoadFromOffline: () => void;
  onClearOfflineData: () => void;
}

export const OfflineSyncActions: React.FC<OfflineSyncActionsProps> = ({
  isSyncing,
  itemsCount,
  offlineItemsCount,
  onSaveForOffline,
  onLoadFromOffline,
  onClearOfflineData
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Save for Offline */}
        <Button 
          onClick={onSaveForOffline}
          disabled={isSyncing || itemsCount === 0}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {isSyncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Uložit offline ({itemsCount})
        </Button>

        {/* Load from Offline */}
        <Button 
          onClick={onLoadFromOffline}
          disabled={isSyncing || offlineItemsCount === 0}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {isSyncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Načíst offline ({offlineItemsCount})
        </Button>
      </div>

      {/* Clear Offline Data */}
      {offlineItemsCount > 0 && (
        <Button 
          onClick={onClearOfflineData}
          disabled={isSyncing}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Smazat offline data
        </Button>
      )}
    </div>
  );
};


import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Cloud } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        onClick={onSaveForOffline} 
        disabled={isSyncing || itemsCount === 0}
        className="w-full sm:w-auto"
      >
        {isSyncing ? 
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : 
          <Cloud className="mr-2 h-4 w-4" />}
        Uložit data pro offline použití
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onLoadFromOffline} 
        disabled={isSyncing || offlineItemsCount === 0}
        className="w-full sm:w-auto"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        Načíst offline data
      </Button>
      
      {offlineItemsCount > 0 && (
        <Button 
          variant="outline"
          onClick={onClearOfflineData}
          disabled={isSyncing}
          className="w-full sm:w-auto text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Smazat offline data
        </Button>
      )}
    </div>
  );
};


import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Cloud, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSaveForOffline = () => {
    toast({
      title: "Ukládání dat",
      description: "Vaše data se ukládají pro offline použití...",
      duration: 3000
    });
    onSaveForOffline();
  };

  const handleLoadFromOffline = () => {
    toast({
      title: "Načítání dat",
      description: "Načítání offline dat...",
      duration: 3000
    });
    onLoadFromOffline();
  };

  const handleClearOfflineData = () => {
    const confirmClear = window.confirm("Opravdu chcete smazat všechna offline data?");
    if (confirmClear) {
      toast({
        title: "Mazání dat",
        description: "Vaše offline data byla smazána",
        duration: 3000
      });
      onClearOfflineData();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        onClick={handleSaveForOffline} 
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
        onClick={handleLoadFromOffline} 
        disabled={isSyncing || offlineItemsCount === 0}
        className="w-full sm:w-auto"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        Načíst offline data
      </Button>
      
      {offlineItemsCount > 0 && (
        <Button 
          variant="outline"
          onClick={handleClearOfflineData}
          disabled={isSyncing}
          className="w-full sm:w-auto text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <Trash className="mr-2 h-4 w-4" />
          Smazat offline data
        </Button>
      )}
    </div>
  );
};

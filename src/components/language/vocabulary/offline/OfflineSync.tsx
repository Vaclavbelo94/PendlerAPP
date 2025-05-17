
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudOff, Cloud } from 'lucide-react';
import { useVocabularyContext } from '../VocabularyProvider';
import { useOfflineSync } from './hooks/useOfflineSync';
import { OfflineSyncStatus } from './components/OfflineSyncStatus';
import { OfflineSyncActions } from './components/OfflineSyncActions';

const OfflineSync: React.FC = () => {
  const { items } = useVocabularyContext();
  const {
    isOffline,
    lastSynced,
    isSyncing,
    syncProgress,
    offlineItemsCount,
    handleSaveForOffline,
    handleLoadFromOffline,
    handleClearOfflineData
  } = useOfflineSync();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isOffline ? <CloudOff className="mr-2 h-5 w-5" /> : <Cloud className="mr-2 h-5 w-5" />}
          Offline synchronizace
        </CardTitle>
        <CardDescription>
          {isOffline 
            ? "Jste v offline režimu. Data budou uložena lokálně." 
            : "Spravujte svá data pro offline použití"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OfflineSyncStatus
          isOffline={isOffline}
          lastSynced={lastSynced}
          isSyncing={isSyncing}
          syncProgress={syncProgress}
          offlineItemsCount={offlineItemsCount}
        />
      </CardContent>
      <CardFooter>
        <OfflineSyncActions
          isSyncing={isSyncing}
          itemsCount={items.length}
          offlineItemsCount={offlineItemsCount}
          onSaveForOffline={handleSaveForOffline}
          onLoadFromOffline={handleLoadFromOffline}
          onClearOfflineData={handleClearOfflineData}
        />
      </CardFooter>
    </Card>
  );
};

export default OfflineSync;

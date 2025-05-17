
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, CloudOff, Cloud, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { useVocabularyContext } from './VocabularyProvider';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { clearStore, getAllData } from '@/utils/offlineStorage';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from "@/components/ui/progress";

const OfflineSync: React.FC = () => {
  const { items } = useVocabularyContext();
  const { isOffline, lastOnlineAt } = useOfflineStatus();
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [offlineItemsCount, setOfflineItemsCount] = useState(0);
  const { toast } = useToast();

  // Check for last synced time and offline items count
  useEffect(() => {
    const storedLastSynced = localStorage.getItem('vocabulary_last_synced');
    if (storedLastSynced) {
      setLastSynced(new Date(storedLastSynced));
    }
    
    // Check if there are items in IndexedDB
    const checkOfflineItems = async () => {
      try {
        if ('indexedDB' in window) {
          const offlineItems = await getAllData('vocabulary');
          setOfflineItemsCount(offlineItems?.length || 0);
        }
      } catch (error) {
        console.error('Error checking offline items:', error);
      }
    };
    
    checkOfflineItems();
    
    // Set up periodic check for offline items (every 30 seconds)
    const intervalId = setInterval(checkOfflineItems, 30000);
    
    return () => clearInterval(intervalId);
  }, [isOffline]);

  // Save current vocabulary items for offline use
  const handleSaveForOffline = async () => {
    if (items.length === 0) {
      toast({
        title: "Žádná slovíčka",
        description: "Nemáte žádná slovíčka k uložení pro offline použití.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setSyncProgress(10);
    
    try {
      // Use the globally exposed sync function from VocabularyManager
      if (window && window.manualVocabSync) {
        // @ts-ignore - Call the manual sync function
        await window.manualVocabSync();
        
        // Update last synced time
        const now = new Date();
        localStorage.setItem('vocabulary_last_synced', now.toISOString());
        setLastSynced(now);
        
        setSyncProgress(100);
        
        // Check offline items count after sync
        const offlineItems = await getAllData('vocabulary');
        setOfflineItemsCount(offlineItems?.length || 0);
      } else {
        throw new Error("Synchronizační funkce není dostupná");
      }
    } catch (error) {
      console.error('Error saving for offline:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit slovíčka pro offline použití.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress(0);
      }, 500);
    }
  };

  // Load vocabulary from offline storage
  const handleLoadFromOffline = async () => {
    setIsSyncing(true);
    setSyncProgress(10);
    
    try {
      // Use the globally exposed sync function from VocabularyManager
      if (window && window.manualVocabSync) {
        // @ts-ignore - Call the manual sync function
        await window.manualVocabSync();
        setSyncProgress(100);
        
        // Check offline items count after sync
        const offlineItems = await getAllData('vocabulary');
        setOfflineItemsCount(offlineItems?.length || 0);
      } else {
        throw new Error("Synchronizační funkce není dostupná");
      }
    } catch (error) {
      console.error('Error loading from offline:', error);
      toast({
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst slovíčka z offline úložiště.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress(0);
      }, 500);
    }
  };

  // Clear all offline data
  const handleClearOfflineData = async () => {
    if (!window.confirm('Opravdu chcete smazat všechna offline uložená data?')) {
      return;
    }
    
    setIsSyncing(true);
    
    try {
      await clearStore('vocabulary');
      localStorage.removeItem('vocabulary_offline_data');
      localStorage.removeItem('vocabulary_last_synced');
      
      setOfflineItemsCount(0);
      setLastSynced(null);
      
      toast({
        title: "Offline data smazána",
        description: "Všechna offline uložená slovíčka byla smazána.",
      });
    } catch (error) {
      console.error('Error clearing offline data:', error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat offline uložená data.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
      <CardContent className="space-y-4">
        {isOffline && (
          <Alert variant="warning">
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
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleSaveForOffline} 
          disabled={isSyncing || items.length === 0}
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
            className="w-full sm:w-auto text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            Smazat offline data
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OfflineSync;

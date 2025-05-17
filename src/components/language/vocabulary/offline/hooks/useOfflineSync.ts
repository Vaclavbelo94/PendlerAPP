
import { useState, useEffect } from 'react';
import { useVocabularyContext } from '../../VocabularyProvider';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { clearStore, getAllData } from '@/utils/offlineStorage';
import { useToast } from '@/components/ui/use-toast';

export function useOfflineSync() {
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

  return {
    isOffline,
    lastSynced,
    isSyncing,
    syncProgress,
    offlineItemsCount,
    handleSaveForOffline,
    handleLoadFromOffline,
    handleClearOfflineData
  };
}

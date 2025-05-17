
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, CloudOff, Cloud, CheckCircle, AlertCircle } from 'lucide-react';
import { useVocabularyContext } from './VocabularyProvider';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveVocabularyToOfflineStorage, loadVocabularyFromOfflineStorage } from '@/utils/offlineStorage';
import { useToast } from '@/hooks/use-toast';

const OfflineSync: React.FC = () => {
  const { items, bulkAddVocabularyItems } = useVocabularyContext();
  const { isOffline } = useOfflineStatus();
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Check for last synced time
  useEffect(() => {
    const storedLastSynced = localStorage.getItem('vocabulary_last_synced');
    if (storedLastSynced) {
      setLastSynced(new Date(storedLastSynced));
    }
  }, []);

  // Automatically save items for offline use when going offline
  useEffect(() => {
    if (isOffline && items.length > 0) {
      handleSaveForOffline();
    }
  }, [isOffline, items]);

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
    
    try {
      await saveVocabularyToOfflineStorage(items);
      
      // Update last synced time
      const now = new Date();
      localStorage.setItem('vocabulary_last_synced', now.toISOString());
      setLastSynced(now);
      
      toast({
        title: "Data uložena pro offline použití",
        description: `${items.length} slovíček bylo uloženo pro použití bez připojení k internetu.`,
      });
    } catch (error) {
      console.error('Error saving for offline:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit slovíčka pro offline použití.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Load vocabulary from offline storage
  const handleLoadFromOffline = async () => {
    setIsSyncing(true);
    
    try {
      const offlineItems = await loadVocabularyFromOfflineStorage();
      
      if (offlineItems.length === 0) {
        toast({
          title: "Žádná offline data",
          description: "Nebyla nalezena žádná offline uložená slovíčka.",
          variant: "destructive"
        });
        return;
      }
      
      // Confirm if we should overwrite or merge
      if (items.length > 0) {
        if (window.confirm(`Nalezeno ${offlineItems.length} offline slovíček. Chcete je načíst a sloučit s aktuálními daty?`)) {
          // Merge strategy: Create a map of IDs to avoid duplicates
          const existingIds = new Map(items.map(item => [item.id, true]));
          const newItems = offlineItems.filter(item => !existingIds.has(item.id));
          
          if (newItems.length > 0) {
            bulkAddVocabularyItems(newItems);
            
            toast({
              title: "Data sloučena",
              description: `${newItems.length} nových slovíček bylo přidáno z offline úložiště.`,
            });
          } else {
            toast({
              title: "Žádná nová data",
              description: "Všechna offline slovíčka již máte načtena.",
            });
          }
        }
      } else {
        // No existing items, just load everything
        bulkAddVocabularyItems(offlineItems);
        
        toast({
          title: "Data načtena",
          description: `${offlineItems.length} slovíček bylo načteno z offline úložiště.`,
        });
      }
    } catch (error) {
      console.error('Error loading from offline:', error);
      toast({
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst slovíčka z offline úložiště.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card>
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
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Pracujete v offline režimu. Všechny změny budou uloženy lokálně.
            </AlertDescription>
          </Alert>
        )}
        
        {!isOffline && lastSynced && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Poslední synchronizace: {lastSynced.toLocaleString()}
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
          disabled={isSyncing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          Načíst offline data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfflineSync;

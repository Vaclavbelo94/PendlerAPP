
import * as React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { WifiOff, CloudOff, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SyncSettingsDialog from './SyncSettingsDialog';
import { useSyncSettings } from '@/hooks/useSyncSettings';

interface OfflineIndicatorProps {
  className?: string;
  showControls?: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  className,
  showControls = false 
}) => {
  const { isOffline, lastOnlineAt } = useOfflineStatus();
  const [offlineReady, setOfflineReady] = React.useState<boolean>(false);
  const [cachedItemsCount, setCachedItemsCount] = React.useState<number>(0);
  const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false);
  const { settings } = useSyncSettings();

  // Optimalizovaná kontrola stavu offline cache při načtení komponenty a jen v případě, že jsou ovládací prvky viditelné
  React.useEffect(() => {
    if (!showControls) return;
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Odložíme kontrolu pro zlepšení výkonu načítání
      const timeoutId = setTimeout(() => {
        checkOfflineStatus();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [showControls]);

  // Kontrola stavu offline cache - optimalizováno
  const checkOfflineStatus = React.useCallback(() => {
    if (!navigator.serviceWorker.controller) return;

    // Vytvoření MessageChannel pro komunikaci se service workerem
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      setOfflineReady(event.data.offlineReady);
      setCachedItemsCount(event.data.cachedItems);
    };

    // Odeslání požadavku na service worker
    navigator.serviceWorker.controller.postMessage({
      type: 'CHECK_OFFLINE_READY'
    }, [messageChannel.port2]);
  }, []);

  // Funkce pro vyvolání manuální synchronizace
  const triggerManualSync = React.useCallback(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          return registration.sync.register('sync-language-data');
        })
        .then(() => {
          if (settings.showSyncNotifications) {
            toast({
              title: "Synchronizace spuštěna",
              description: "Offline data se aktualizují na pozadí."
            });
          }
          
          // Po krátké prodlevě zkontrolujeme stav cache
          setTimeout(checkOfflineStatus, 2000);
        })
        .catch((err) => {
          console.error('Chyba při synchronizaci:', err);
          if (settings.showSyncNotifications) {
            toast({
              title: "Synchronizace selhala",
              description: "Zkontrolujte připojení k internetu.",
              variant: "destructive"
            });
          }
        });
    } else {
      if (settings.showSyncNotifications) {
        toast({
          title: "Není k dispozici",
          description: "Váš prohlížeč nepodporuje synchronizaci na pozadí.",
          variant: "destructive"
        });
      }
    }
  }, [checkOfflineStatus, settings.showSyncNotifications]);

  // Použijeme memo pro optimalizaci renderování
  const renderOfflineBadge = React.useMemo(() => {
    if (!isOffline) return null;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-background px-3 py-1 flex items-center gap-1.5 border-amber-500">
            <WifiOff className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-amber-500 font-medium">Offline</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="left">
          <div className="text-sm">
            <div className="font-medium mb-1">Offline režim</div>
            <div className="text-xs text-muted-foreground">
              Pracujete v offline režimu.
              {lastOnlineAt && (
                <div>Naposledy online: {format(lastOnlineAt, 'HH:mm, dd.MM.yyyy')}</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }, [isOffline, lastOnlineAt]);

  const renderControls = React.useMemo(() => {
    if (!showControls) return null;
    
    return (
      <div className="bg-card border rounded-lg shadow-sm p-3 w-64">
        <div className="text-sm font-medium mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudOff className="h-4 w-4" />
            Offline obsah
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Nastavení synchronizace
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stav:</span>
            <span className={offlineReady ? "text-green-500" : "text-amber-500"}>
              {offlineReady ? "Připraveno k použití offline" : "Není připraveno"}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Počet položek v cache:</span>
            <span>{cachedItemsCount}</span>
          </div>
        </div>
        
        <Button 
          onClick={triggerManualSync} 
          variant="outline" 
          className="w-full text-xs h-8"
          disabled={isOffline}
        >
          {isOffline ? "Nepřipojeno k internetu" : "Aktualizovat offline data"}
        </Button>
      </div>
    );
  }, [showControls, offlineReady, cachedItemsCount, isOffline, triggerManualSync]);

  // Když nejsme offline a nechceme zobrazovat ovládací prvky, nic nerenderujeme
  if (!isOffline && !showControls) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end", className)}>
      {renderOfflineBadge}
      {renderControls}

      {/* Dialog nastavení synchronizace */}
      <SyncSettingsDialog 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
};

export default React.memo(OfflineIndicator);

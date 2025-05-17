
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface SyncSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SYNC_SETTINGS_KEY = 'syncSettings';

type SyncSettings = {
  showSyncNotifications: boolean;
  enableBackgroundSync: boolean;
};

// Výchozí nastavení
const defaultSettings: SyncSettings = {
  showSyncNotifications: true,
  enableBackgroundSync: true
};

export const SyncSettingsDialog: React.FC<SyncSettingsDialogProps> = ({ open, onOpenChange }) => {
  // Načtení uložených nastavení nebo použití výchozích hodnot
  const [settings, setSettings] = React.useState<SyncSettings>(() => {
    const savedSettings = localStorage.getItem(SYNC_SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const handleSaveSettings = () => {
    // Uložení nastavení do localStorage
    localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(settings));
    
    // Aktualizace session storage pro okamžité uplatnění nastavení
    if (!settings.showSyncNotifications) {
      sessionStorage.setItem('syncNotificationShown', 'true');
    } else {
      sessionStorage.removeItem('syncNotificationShown');
    }
    
    toast({
      title: "Nastavení uloženo",
      description: "Vaše preference synchronizace byly aktualizovány."
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nastavení synchronizace</DialogTitle>
          <DialogDescription>
            Upravte si, jak má aplikace pracovat s daty offline a online.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-notifications" className="font-medium">Zobrazovat notifikace</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat upozornění o stavu synchronizace
              </p>
            </div>
            <Switch
              id="show-notifications"
              checked={settings.showSyncNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showSyncNotifications: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="background-sync" className="font-medium">Synchronizace na pozadí</Label>
              <p className="text-sm text-muted-foreground">
                Povolit automatickou synchronizaci dat na pozadí
              </p>
            </div>
            <Switch
              id="background-sync"
              checked={settings.enableBackgroundSync}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, enableBackgroundSync: checked }))
              }
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Zrušit
          </Button>
          <Button onClick={handleSaveSettings}>
            Uložit nastavení
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncSettingsDialog;

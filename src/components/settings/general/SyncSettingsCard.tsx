
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Battery } from 'lucide-react';
import { SyncSettings } from '@/hooks/useSyncSettings';

interface SyncSettingsCardProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
  syncLoading: boolean;
  formatLastSyncTime: (lastSyncTime?: string) => string;
}

const SyncSettingsCard = ({
  syncSettings,
  updateSyncSettings,
  syncLoading,
  formatLastSyncTime
}: SyncSettingsCardProps) => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Battery className="h-4 w-4" />
        <span className="font-medium">Synchronizace</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Nastavení synchronizace dat mezi zařízeními
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableBackgroundSync">Synchronizace na pozadí</Label>
            <p className="text-xs text-muted-foreground">
              Automaticky synchronizuje data na pozadí
            </p>
          </div>
          <Switch
            id="enableBackgroundSync"
            checked={syncSettings.enableBackgroundSync}
            onCheckedChange={(checked) => 
              updateSyncSettings({ enableBackgroundSync: checked })
            }
            disabled={syncLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showSyncNotifications">Oznámení synchronizace</Label>
            <p className="text-xs text-muted-foreground">
              Zobrazuje oznámení o stavu synchronizace
            </p>
          </div>
          <Switch
            id="showSyncNotifications"
            checked={syncSettings.showSyncNotifications}
            onCheckedChange={(checked) => 
              updateSyncSettings({ showSyncNotifications: checked })
            }
            disabled={syncLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Poslední synchronizace</span>
          <span className="text-sm text-muted-foreground">
            {formatLastSyncTime(syncSettings.lastSyncTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SyncSettingsCard;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Cloud } from 'lucide-react';
import { SyncSettings } from '@/hooks/useSyncSettings';

interface SyncSettingsCardProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
  syncLoading: boolean;
  formatLastSyncTime: (time?: string) => string;
}

const SyncSettingsCard: React.FC<SyncSettingsCardProps> = ({
  syncSettings,
  updateSyncSettings,
  syncLoading,
  formatLastSyncTime
}) => {
  const handleManualSync = () => {
    // Trigger manual sync
    console.log('Manual sync triggered');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Synchronizace dat
        </CardTitle>
        <CardDescription>
          Nastavení synchronizace mezi zařízeními
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="backgroundSync">Synchronizace na pozadí</Label>
            <p className="text-sm text-muted-foreground">
              Automaticky synchronizovat data i když aplikace není aktivní
            </p>
          </div>
          <Switch
            id="backgroundSync"
            checked={syncSettings.enableBackgroundSync}
            onCheckedChange={(checked) => updateSyncSettings({ enableBackgroundSync: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="syncNotifications">Oznámení o synchronizaci</Label>
            <p className="text-sm text-muted-foreground">
              Zobrazovat oznámení o stavu synchronizace
            </p>
          </div>
          <Switch
            id="syncNotifications"
            checked={syncSettings.showSyncNotifications}
            onCheckedChange={(checked) => updateSyncSettings({ showSyncNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Poslední synchronizace</p>
            <p className="text-sm text-muted-foreground">
              {formatLastSyncTime(syncSettings.lastSyncTime)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {syncSettings.enableBackgroundSync ? 'Aktivní' : 'Neaktivní'}
              </Badge>
            </div>
          </div>
          <Button 
            onClick={handleManualSync} 
            disabled={syncLoading}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
            {syncLoading ? 'Synchronizuji...' : 'Synchronizovat'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncSettingsCard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi, RefreshCw, CheckCircle } from "lucide-react";

interface OfflineSyncProps {
  isOnline: boolean;
  lastSync?: Date;
  onSync: () => void;
  isSyncing: boolean;
}

const OfflineSync: React.FC<OfflineSyncProps> = ({ 
  isOnline, 
  lastSync, 
  onSync, 
  isSyncing 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Offline synchronizace
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Stav připojení:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          
          {lastSync && (
            <div className="flex items-center justify-between">
              <span>Poslední synchronizace:</span>
              <span className="text-sm text-muted-foreground">
                {lastSync.toLocaleString()}
              </span>
            </div>
          )}
          
          <Button 
            onClick={onSync} 
            disabled={isSyncing || !isOnline}
            className="w-full"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Synchronizuji...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Synchronizovat
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfflineSync;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Wifi, 
  WifiOff, 
  Sync,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useCrossDeviceSync } from '@/hooks/useCrossDeviceSync';

const DeviceManagerWidget: React.FC = () => {
  const { 
    activeDevices, 
    isSyncing, 
    lastSyncTime, 
    getCurrentDevice 
  } = useCrossDeviceSync();
  
  const [isOnline] = useState(navigator.onLine);
  const currentDevice = getCurrentDevice();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Právě teď';
    if (minutes < 60) return `Před ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Před ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Před ${days} dny`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          Správa zařízení
        </CardTitle>
        <CardDescription>
          {activeDevices.length} aktivních zařízení
          {lastSyncTime && (
            <span className="block text-xs mt-1">
              Poslední sync: {formatLastSeen(lastSyncTime)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current device */}
        <div className="border rounded-lg p-3 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getDeviceIcon(currentDevice.type)}
              <div>
                <p className="text-sm font-medium">{currentDevice.name}</p>
                <p className="text-xs text-gray-600">
                  {currentDevice.os} • {currentDevice.browser}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Aktuální
            </Badge>
          </div>
        </div>

        {/* Other active devices */}
        {activeDevices
          .filter(device => device.id !== currentDevice.id)
          .map(device => (
            <div key={device.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(device.type)}
                  <div>
                    <p className="text-sm font-medium">{device.name}</p>
                    <p className="text-xs text-gray-600">
                      {device.os} • {device.browser}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.isActive && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatLastSeen(device.lastSeen)}
                  </span>
                </div>
              </div>
            </div>
          ))}

        {/* Sync status */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <>
                  <Sync className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm">Synchronizace...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Synchronizováno</span>
                </>
              )}
            </div>
            {lastSyncTime && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatLastSeen(lastSyncTime)}
              </div>
            )}
          </div>
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs">Stav připojení:</span>
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className="text-xs"
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceManagerWidget;

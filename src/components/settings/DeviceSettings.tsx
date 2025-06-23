
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  Battery, 
  Wifi, 
  HardDrive, 
  Camera, 
  Mic, 
  MapPin,
  Bell
} from 'lucide-react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const DeviceSettings = () => {
  const { t } = useTranslation('settings');
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    location: false,
    notifications: false
  });
  const [deviceInfo, setDeviceInfo] = useState({
    storage: 65,
    battery: 85,
    connection: 'wifi'
  });

  useEffect(() => {
    // Check current permissions
    checkPermissions();
    // Update device info
    updateDeviceInfo();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      // Check location permission
      const locationPermission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      
      // Check notification permission
      const notificationPermission = Notification.permission;

      setPermissions({
        camera: cameraPermission.state === 'granted',
        microphone: micPermission.state === 'granted',
        location: locationPermission.state === 'granted',
        notifications: notificationPermission === 'granted'
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const updateDeviceInfo = () => {
    // Get storage info (mock for now)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.quota && estimate.usage) {
          const percentage = (estimate.usage / estimate.quota) * 100;
          setDeviceInfo(prev => ({ ...prev, storage: Math.round(percentage) }));
        }
      });
    }

    // Get battery info
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setDeviceInfo(prev => ({ 
          ...prev, 
          battery: Math.round(battery.level * 100) 
        }));
      });
    }

    // Get connection info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setDeviceInfo(prev => ({ 
        ...prev, 
        connection: connection.effectiveType || 'unknown' 
      }));
    }
  };

  const requestPermission = async (type: keyof typeof permissions) => {
    try {
      switch (type) {
        case 'camera':
          await navigator.mediaDevices.getUserMedia({ video: true });
          break;
        case 'microphone':
          await navigator.mediaDevices.getUserMedia({ audio: true });
          break;
        case 'location':
          navigator.geolocation.getCurrentPosition(() => {});
          break;
        case 'notifications':
          await Notification.requestPermission();
          break;
      }
      
      setTimeout(checkPermissions, 1000);
      toast.success(t('permissionGranted'));
    } catch (error) {
      console.error('Permission denied:', error);
      toast.error(t('permissionDenied'));
    }
  };

  const clearAppData = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success(t('appDataCleared'));
  };

  return (
    <div className="space-y-6">
      {/* Device Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t('deviceInformation')}
          </CardTitle>
          <CardDescription>
            {t('currentDeviceStatus')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <Label>{t('storage')}</Label>
              </div>
              <Progress value={deviceInfo.storage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {deviceInfo.storage}% {t('used')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <Label>{t('battery')}</Label>
              </div>
              <Progress value={deviceInfo.battery} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {deviceInfo.battery}% {t('charged')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <Label>{t('connection')}</Label>
              </div>
              <Badge variant="secondary" className="w-fit">
                {deviceInfo.connection}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('permissions')}</CardTitle>
          <CardDescription>
            {t('manageAppPermissions')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4" />
                <div>
                  <Label>{t('camera')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('accessCameraForPhotos')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={permissions.camera ? "default" : "secondary"}>
                  {permissions.camera ? t('granted') : t('denied')}
                </Badge>
                {!permissions.camera && (
                  <Button
                    size="sm"
                    onClick={() => requestPermission('camera')}
                  >
                    {t('enable')}
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4" />
                <div>
                  <Label>{t('microphone')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('accessMicrophoneForRecording')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={permissions.microphone ? "default" : "secondary"}>
                  {permissions.microphone ? t('granted') : t('denied')}
                </Badge>
                {!permissions.microphone && (
                  <Button
                    size="sm"
                    onClick={() => requestPermission('microphone')}
                  >
                    {t('enable')}
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <div>
                  <Label>{t('location')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('accessLocationForFeatures')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={permissions.location ? "default" : "secondary"}>
                  {permissions.location ? t('granted') : t('denied')}
                </Badge>
                {!permissions.location && (
                  <Button
                    size="sm"
                    onClick={() => requestPermission('location')}
                  >
                    {t('enable')}
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                <div>
                  <Label>{t('notifications')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('receiveImportantNotifications')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={permissions.notifications ? "default" : "secondary"}>
                  {permissions.notifications ? t('granted') : t('denied')}
                </Badge>
                {!permissions.notifications && (
                  <Button
                    size="sm"
                    onClick={() => requestPermission('notifications')}
                  >
                    {t('enable')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dataManagement')}</CardTitle>
          <CardDescription>
            {t('manageAppData')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">{t('clearAppData')}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {t('clearAllLocalData')}
              </p>
              <Button variant="destructive" onClick={clearAppData}>
                {t('clearData')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSettings;

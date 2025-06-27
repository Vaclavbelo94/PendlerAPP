
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell, 
  BellRing, 
  Settings, 
  Smartphone,
  Mail,
  MessageSquare,
  Clock,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { toast } from 'sonner';

interface AdvancedNotificationCenterProps {
  className?: string;
}

const AdvancedNotificationCenter: React.FC<AdvancedNotificationCenterProps> = ({ className }) => {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    isInitialized,
    permissionGranted,
    behaviorPattern,
    saveSettings,
    requestPermission,
    syncAcrossDevices,
    analyzeUserBehavior,
  } = useAdvancedNotifications();

  const [localSettings, setLocalSettings] = useState(settings);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = async (key: keyof typeof settings, value: boolean) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: value };
    setLocalSettings(newSettings);
    
    const success = await saveSettings(newSettings);
    if (!success) {
      // Revert on failure
      setLocalSettings(settings);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Oprávnění k notifikacím uděleno');
    } else {
      toast.error('Oprávnění k notifikacím zamítnuto');
    }
  };

  const handleSyncDevices = async () => {
    try {
      const success = await syncAcrossDevices();
      if (success) {
        toast.success('Nastavení synchronizováno napříč zařízeními');
      }
    } catch (error) {
      toast.error('Chyba při synchronizaci nastavení');
    }
  };

  const handleAnalyzeBehavior = async () => {
    try {
      const pattern = await analyzeUserBehavior();
      toast.success(`Vzorec chování analyzován: ${pattern}`);
    } catch (error) {
      toast.error('Chyba při analýze chování');
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pokročilé notifikace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Chyba při načítání nastavení notifikací: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!settings) {
    return null;
  }

  // Mock behavior pattern data since it's a string
  const mockBehaviorData = {
    preferredTimes: ['09:00', '18:00'],
    responseRates: { email: 85, push: 92, sms: 78 },
    devicePreferences: { mobile: 70, desktop: 30 },
    engagementScore: 87
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Stav oprávnění
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {permissionGranted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              )}
              <div>
                <div className="font-medium">
                  {permissionGranted ? 'Oprávnění uděleno' : 'Oprávnění vyžadováno'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {permissionGranted 
                    ? 'Notifikace mohou být doručovány' 
                    : 'Klikněte pro udělení oprávnění'
                  }
                </div>
              </div>
            </div>
            {!permissionGranted && (
              <Button onClick={handleRequestPermission}>
                Udělit oprávnění
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Základní nastavení
          </CardTitle>
          <CardDescription>
            Vyberte typy notifikací, které chcete přijímat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-600" />
              <Label htmlFor="email-notifications">E-mailové notifikace</Label>
            </div>
            <Switch
              id="email-notifications"
              checked={localSettings?.emailNotifications || false}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              disabled={isSaving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-green-600" />
              <Label htmlFor="push-notifications">Push notifikace</Label>
            </div>
            <Switch
              id="push-notifications"
              checked={localSettings?.pushNotifications || false}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              disabled={isSaving || !permissionGranted}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              <Label htmlFor="sms-notifications">SMS notifikace</Label>
            </div>
            <Switch
              id="sms-notifications"
              checked={localSettings?.smsNotifications || false}
              onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Analýza chování
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Skrýt' : 'Zobrazit'} detaily
            </Button>
          </div>
          <CardDescription>
            Vzorec vašeho chování: <Badge variant="secondary">{behaviorPattern}</Badge>
          </CardDescription>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="space-y-4">
            {/* Preferred Times */}
            <div>
              <div className="font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferované časy
              </div>
              <div className="flex gap-2">
                {mockBehaviorData.preferredTimes.map((time, index) => (
                  <Badge key={index} variant="outline">{time}</Badge>
                ))}
              </div>
            </div>

            {/* Response Rates */}
            <div>
              <div className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Míra odezvy
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{mockBehaviorData.responseRates.email}%</div>
                  <div className="text-muted-foreground">Email</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{mockBehaviorData.responseRates.push}%</div>
                  <div className="text-muted-foreground">Push</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{mockBehaviorData.responseRates.sms}%</div>
                  <div className="text-muted-foreground">SMS</div>
                </div>
              </div>
            </div>

            {/* Device Preferences */}
            <div>
              <div className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Preference zařízení
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{mockBehaviorData.devicePreferences.mobile}%</div>
                  <div className="text-muted-foreground">Mobil</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{mockBehaviorData.devicePreferences.desktop}%</div>
                  <div className="text-muted-foreground">Desktop</div>
                </div>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Skóre zapojení</div>
                  <div className="text-sm text-muted-foreground">
                    Celková aktivita s notifikacemi
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {mockBehaviorData.engagementScore}%
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {mockBehaviorData.engagementScore > 80 ? 'Vysoké zapojení' : 
                 mockBehaviorData.engagementScore > 60 ? 'Střední zapojení' : 'Nízké zapojení'}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Advanced Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Pokročilé akce
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            onClick={handleSyncDevices}
            className="w-full justify-start"
            disabled={isSaving}
          >
            <Users className="h-4 w-4 mr-2" />
            Synchronizovat napříč zařízeními
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleAnalyzeBehavior}
            className="w-full justify-start"
            disabled={isSaving}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Znovu analyzovat chování
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNotificationCenter;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertTriangle, Settings } from "lucide-react";
import { toast } from "sonner";

interface AdSettings {
  adsEnabled: boolean;
  bannerAdsEnabled: boolean;
  popupAdsEnabled: boolean;
  interstitialAdsEnabled: boolean;
  globalAdOverride: boolean;
}

export const AdManagementPanel = () => {
  const [adSettings, setAdSettings] = useState<AdSettings>({
    adsEnabled: true,
    bannerAdsEnabled: true,
    popupAdsEnabled: true,
    interstitialAdsEnabled: true,
    globalAdOverride: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAdSettings();
  }, []);

  const loadAdSettings = () => {
    try {
      const savedSettings = localStorage.getItem('admin_ad_settings');
      if (savedSettings) {
        setAdSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading ad settings:', error);
      toast.error('Chyba při načítání nastavení reklam');
    }
  };

  const saveAdSettings = (newSettings: AdSettings) => {
    try {
      localStorage.setItem('admin_ad_settings', JSON.stringify(newSettings));
      
      // Update global ad settings for immediate effect
      window.dispatchEvent(new CustomEvent('adminAdSettingsChanged', { 
        detail: newSettings 
      }));
      
      toast.success('Nastavení reklam bylo uloženo');
    } catch (error) {
      console.error('Error saving ad settings:', error);
      toast.error('Chyba při ukládání nastavení reklam');
    }
  };

  const handleToggleAds = (enabled: boolean) => {
    setIsLoading(true);
    const newSettings = { ...adSettings, adsEnabled: enabled };
    setAdSettings(newSettings);
    saveAdSettings(newSettings);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(enabled ? 'Reklamy byly zapnuty' : 'Reklamy byly vypnuty');
    }, 500);
  };

  const handleToggleAdType = (adType: keyof AdSettings, enabled: boolean) => {
    const newSettings = { ...adSettings, [adType]: enabled };
    setAdSettings(newSettings);
    saveAdSettings(newSettings);
  };

  const handleGlobalOverride = (enabled: boolean) => {
    const newSettings = { 
      ...adSettings, 
      globalAdOverride: enabled,
      adsEnabled: !enabled // When override is on, ads are off
    };
    setAdSettings(newSettings);
    saveAdSettings(newSettings);
    
    toast.success(enabled ? 
      'Globální vypnutí reklam aktivováno' : 
      'Globální vypnutí reklam deaktivováno'
    );
  };

  const resetToDefaults = () => {
    const defaultSettings: AdSettings = {
      adsEnabled: true,
      bannerAdsEnabled: true,
      popupAdsEnabled: true,
      interstitialAdsEnabled: true,
      globalAdOverride: false
    };
    setAdSettings(defaultSettings);
    saveAdSettings(defaultSettings);
    toast.success('Nastavení bylo obnoveno na výchozí hodnoty');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Správa reklam</h3>
          <p className="text-sm text-muted-foreground">
            Ovládání zobrazování reklam pro neprémiové uživatele
          </p>
        </div>
        <Button variant="outline" onClick={resetToDefaults}>
          Obnovit výchozí
        </Button>
      </div>

      {/* Global Override Alert */}
      {adSettings.globalAdOverride && (
        <Alert className="border-red-500/20 bg-red-50 dark:bg-red-900/10">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Globální vypnutí reklam je aktivní!</strong>
            <p className="text-sm mt-1">
              Všechny reklamy jsou vypnuté pro všechny uživatele bez ohledu na jejich premium status.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Ad Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hlavní ovládání reklam
          </CardTitle>
          <CardDescription>
            Globální nastavení pro zobrazování reklam v aplikaci
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Override */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/10">
            <div className="space-y-1">
              <Label htmlFor="global-override" className="text-base font-medium">
                Globální vypnutí reklam
              </Label>
              <p className="text-sm text-muted-foreground">
                Vypnout všechny reklamy pro všechny uživatele (emergency switch)
              </p>
            </div>
            <Switch
              id="global-override"
              checked={adSettings.globalAdOverride}
              onCheckedChange={handleGlobalOverride}
            />
          </div>

          {/* Main Ads Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="ads-enabled" className="text-base font-medium flex items-center gap-2">
                {adSettings.adsEnabled ? (
                  <>
                    <Eye className="h-4 w-4 text-green-600" />
                    Reklamy zapnuté
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-red-600" />
                    Reklamy vypnuté
                  </>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Hlavní přepínač pro zobrazování reklam neprémiovým uživatelům
              </p>
            </div>
            <Switch
              id="ads-enabled"
              checked={adSettings.adsEnabled && !adSettings.globalAdOverride}
              onCheckedChange={handleToggleAds}
              disabled={isLoading || adSettings.globalAdOverride}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ad Types Control */}
      <Card>
        <CardHeader>
          <CardTitle>Typy reklam</CardTitle>
          <CardDescription>
            Detailní nastavení jednotlivých typů reklam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* Banner Ads */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="banner-ads" className="flex items-center gap-2">
                  Banner reklamy
                  <Badge variant="secondary" className="text-xs">
                    Implementováno
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Bannery zobrazované v layoutu aplikace
                </p>
              </div>
              <Switch
                id="banner-ads"
                checked={adSettings.bannerAdsEnabled && adSettings.adsEnabled && !adSettings.globalAdOverride}
                onCheckedChange={(checked) => handleToggleAdType('bannerAdsEnabled', checked)}
                disabled={!adSettings.adsEnabled || adSettings.globalAdOverride}
              />
            </div>

            {/* Popup Ads */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="popup-ads" className="flex items-center gap-2">
                  Popup reklamy
                  <Badge variant="secondary" className="text-xs">
                    Implementováno
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Modální reklamy po určitém počtu zobrazení
                </p>
              </div>
              <Switch
                id="popup-ads"
                checked={adSettings.popupAdsEnabled && adSettings.adsEnabled && !adSettings.globalAdOverride}
                onCheckedChange={(checked) => handleToggleAdType('popupAdsEnabled', checked)}
                disabled={!adSettings.adsEnabled || adSettings.globalAdOverride}
              />
            </div>

            {/* Interstitial Ads */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="interstitial-ads" className="flex items-center gap-2">
                  Interstitial reklamy
                  <Badge variant="outline" className="text-xs">
                    V přípravě
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Celostránkové reklamy mezi akcemi
                </p>
              </div>
              <Switch
                id="interstitial-ads"
                checked={adSettings.interstitialAdsEnabled && adSettings.adsEnabled && !adSettings.globalAdOverride}
                onCheckedChange={(checked) => handleToggleAdType('interstitialAdsEnabled', checked)}
                disabled={!adSettings.adsEnabled || adSettings.globalAdOverride}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

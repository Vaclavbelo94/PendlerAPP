
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertTriangle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface AdSettings {
  adsEnabled: boolean;
  bannerAdsEnabled: boolean;
  popupAdsEnabled: boolean;
  interstitialAdsEnabled: boolean;
  globalAdOverride: boolean;
}

export const AdManagementPanel = () => {
  const { t } = useTranslation('admin-ads');
  const { toast } = useToast();
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
      toast({ title: t('toast.loadError'), variant: "destructive" });
    }
  };

  const saveAdSettings = (newSettings: AdSettings) => {
    try {
      localStorage.setItem('admin_ad_settings', JSON.stringify(newSettings));
      
      // Update global ad settings for immediate effect
      window.dispatchEvent(new CustomEvent('adminAdSettingsChanged', { 
        detail: newSettings 
      }));
      
      toast({ title: t('toast.settingsSaved') });
    } catch (error) {
      console.error('Error saving ad settings:', error);
      toast({ title: t('toast.saveError'), variant: "destructive" });
    }
  };

  const handleToggleAds = (enabled: boolean) => {
    setIsLoading(true);
    const newSettings = { ...adSettings, adsEnabled: enabled };
    setAdSettings(newSettings);
    saveAdSettings(newSettings);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: enabled ? t('toast.adsEnabled') : t('toast.adsDisabled') });
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
    
    toast({ 
      title: enabled ? t('toast.overrideEnabled') : t('toast.overrideDisabled')
    });
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
    toast({ title: t('toast.defaultsRestored') });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <Button variant="outline" onClick={resetToDefaults}>
          {t('resetDefaults')}
        </Button>
      </div>

      {adSettings.globalAdOverride && (
        <Alert className="border-red-500/20 bg-red-50 dark:bg-red-900/10">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>{t('alert.title')}</strong>
            <p className="text-sm mt-1">
              {t('alert.description')}
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('mainControl.title')}
          </CardTitle>
          <CardDescription>
            {t('mainControl.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Override */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/10">
            <div className="space-y-1">
              <Label htmlFor="global-override" className="text-base font-medium">
                {t('globalOverride.label')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('globalOverride.description')}
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
                    {t('mainToggle.enabled')}
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-red-600" />
                    {t('mainToggle.disabled')}
                  </>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('mainToggle.description')}
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
          <CardTitle>{t('adTypes.title')}</CardTitle>
          <CardDescription>
            {t('adTypes.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* Banner Ads */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="banner-ads" className="flex items-center gap-2">
                  {t('adTypes.banner.label')}
                  <Badge variant="secondary" className="text-xs">
                    {t('adTypes.banner.badge')}
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('adTypes.banner.description')}
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
                  {t('adTypes.popup.label')}
                  <Badge variant="secondary" className="text-xs">
                    {t('adTypes.popup.badge')}
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('adTypes.popup.description')}
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
                  {t('adTypes.interstitial.label')}
                  <Badge variant="outline" className="text-xs">
                    {t('adTypes.interstitial.badge')}
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('adTypes.interstitial.description')}
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

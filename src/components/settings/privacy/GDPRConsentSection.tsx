
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Settings, BarChart3, Target } from 'lucide-react';
import { useGDPRConsent, ConsentPreferences } from '@/contexts/GDPRConsentContext';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

export const GDPRConsentSection: React.FC = () => {
  const { t } = useTranslation('settings');
  const { 
    preferences, 
    updateConsent, 
    openSettings, 
    hasConsent 
  } = useGDPRConsent();

  const handleConsentChange = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'necessary') return;
    
    const newPreferences = {
      ...preferences,
      [key]: value
    };
    
    updateConsent(newPreferences);
    toast.success(t('consentSettingsUpdated') || "Nastavení souhlasu bylo aktualizováno");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('gdprConsentManagement') || 'GDPR Consent Management'}
        </CardTitle>
        <CardDescription>
          {t('manageCookiesAndDataProcessing') || 'Spravujte své souhlas s cookies a zpracováním osobních údajů'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasConsent && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('noConsentSetYet') || 'Nemáte ještě nastaven souhlas s cookies.'} 
              <Button 
                variant="link" 
                className="p-0 ml-1 text-yellow-800 underline"
                onClick={openSettings}
              >
                {t('setNow') || 'Nastavit nyní'}
              </Button>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('necessaryCookies') || 'Nezbytné cookies'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('requiredForBasicWebFunctionality') || 'Požadované pro základní funkčnost webu'}
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('functionalCookies') || 'Funkční cookies'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('rememberSettingsAndPersonalization') || 'Zapamatování nastavení a personalizace'}
              </p>
            </div>
            <Switch
              checked={preferences.functional}
              onCheckedChange={(checked) => handleConsentChange('functional', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('analyticsCookies') || 'Analytické cookies'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('anonymousStatsForServiceImprovement') || 'Anonymní statistiky pro zlepšení služeb'}
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('advertisingCookiesAdSense') || 'Reklamní cookies (Google AdSense)'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('personalizedAdsAndMeasurement') || 'Personalizované reklamy a jejich měření'}
              </p>
            </div>
            <Switch
              checked={preferences.advertising}
              onCheckedChange={(checked) => handleConsentChange('advertising', checked)}
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{t('googleAdSense') || 'Google AdSense'}:</strong> {t('adSenseDescription') || 'Pokud povolíte reklamní cookies, budou se zobrazovat personalizované reklamy od Google AdSense, které pomáhají financovat tuto aplikaci.'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('showCookieBanner') || 'Zobrazit cookie banner'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('reopenCookieSettings') || 'Znovu otevřít nastavení cookies'}
            </p>
          </div>
          <Button onClick={openSettings} variant="outline" size="sm">
            {t('openSettings') || 'Otevřít nastavení'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

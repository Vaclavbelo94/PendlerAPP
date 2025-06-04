
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Settings, BarChart3, Target } from 'lucide-react';
import { useGDPRConsent, ConsentPreferences } from '@/contexts/GDPRConsentContext';
import { toast } from "sonner";

export const GDPRConsentSection: React.FC = () => {
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
    toast.success("Nastavení souhlasu bylo aktualizováno");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          GDPR Consent Management
        </CardTitle>
        <CardDescription>
          Spravujte své souhlas s cookies a zpracováním osobních údajů
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasConsent && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Nemáte ještě nastaven souhlas s cookies. 
              <Button 
                variant="link" 
                className="p-0 ml-1 text-yellow-800 underline"
                onClick={openSettings}
              >
                Nastavit nyní
              </Button>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Nezbytné cookies
              </Label>
              <p className="text-sm text-muted-foreground">
                Požadované pro základní funkčnost webu
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Funkční cookies
              </Label>
              <p className="text-sm text-muted-foreground">
                Zapamatování nastavení a personalizace
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
                Analytické cookies
              </Label>
              <p className="text-sm text-muted-foreground">
                Anonymní statistiky pro zlepšení služeb
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
                Reklamní cookies (Google AdSense)
              </Label>
              <p className="text-sm text-muted-foreground">
                Personalizované reklamy a jejich měření
              </p>
            </div>
            <Switch
              checked={preferences.advertising}
              onCheckedChange={(checked) => handleConsentChange('advertising', checked)}
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Google AdSense:</strong> Pokud povolíte reklamní cookies, budou se zobrazovat 
              personalizované reklamy od Google AdSense, které pomáhají financovat tuto aplikaci.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Zobrazit cookie banner
            </Label>
            <p className="text-sm text-muted-foreground">
              Znovu otevřít nastavení cookies
            </p>
          </div>
          <Button onClick={openSettings} variant="outline" size="sm">
            Otevřít nastavení
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

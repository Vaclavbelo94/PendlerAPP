
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Cookie, Settings, Shield, BarChart3, Target } from 'lucide-react';
import { useGDPRConsent, ConsentPreferences } from '@/contexts/GDPRConsentContext';

export const CookieConsentBanner: React.FC = () => {
  const { 
    showBanner, 
    preferences, 
    acceptAll, 
    rejectAll, 
    updateConsent, 
    closeBanner 
  } = useGDPRConsent();
  
  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<ConsentPreferences>(preferences);

  if (!showBanner) return null;

  const handleSavePreferences = () => {
    updateConsent(localPreferences);
  };

  const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'necessary') return; // Nelze změnit nezbytné cookies
    
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookies a ochrana soukromí
          </CardTitle>
          <CardDescription>
            Používáme cookies pro zlepšení vaší zkušenosti a zobrazování personalizovaných reklam. 
            Vyberte si, které kategorie cookies chcete povolit.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showDetails ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Abychom vám mohli poskytovat naše služby včetně zobrazování reklam prostřednictvím 
                Google AdSense, potřebujeme váš souhlas s používáním cookies. Vaše data jsou chráněna 
                v souladu s GDPR.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={acceptAll} className="flex-1">
                  Přijmout vše
                </Button>
                <Button onClick={rejectAll} variant="outline" className="flex-1">
                  Odmítnout vše
                </Button>
                <Button 
                  onClick={() => setShowDetails(true)} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Nastavení
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Nezbytné cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Shield className="h-4 w-4" />
                      Nezbytné cookies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Požadované pro základní funkčnost webu (přihlášení, navigace)
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                {/* Funkční cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Settings className="h-4 w-4" />
                      Funkční cookies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Zapamatování nastavení, jazyka a personalizace
                    </p>
                  </div>
                  <Switch 
                    checked={localPreferences.functional}
                    onCheckedChange={(checked) => handlePreferenceChange('functional', checked)}
                  />
                </div>

                {/* Analytické cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <BarChart3 className="h-4 w-4" />
                      Analytické cookies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Anonymní statistiky návštěvnosti pro zlepšení služeb
                    </p>
                  </div>
                  <Switch 
                    checked={localPreferences.analytics}
                    onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                  />
                </div>

                {/* Reklamní cookies (AdSense) */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Target className="h-4 w-4" />
                      Reklamní cookies (Google AdSense)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Personalizované reklamy a měření jejich efektivity
                    </p>
                  </div>
                  <Switch 
                    checked={localPreferences.advertising}
                    onCheckedChange={(checked) => handlePreferenceChange('advertising', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSavePreferences} className="flex-1">
                  Uložit nastavení
                </Button>
                <Button 
                  onClick={() => setShowDetails(false)} 
                  variant="outline"
                  className="flex-1"
                >
                  Zpět
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Své preference můžete kdykoli změnit v Nastavení → Soukromí. 
                Více informací najdete v našich{' '}
                <a href="/privacy" className="text-primary hover:underline">zásadách ochrany soukromí</a>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

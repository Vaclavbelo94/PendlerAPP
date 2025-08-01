
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from 'react-i18next';
import { useDHLThemeContext } from '@/contexts/DHLThemeContext';

interface ColorSchemeSelectorProps {
  colorScheme: string;
  onColorSchemeChange: (value: string) => void;
}

const ColorSchemeSelector = ({ colorScheme, onColorSchemeChange }: ColorSchemeSelectorProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('settings');
  const { isDHLEmployee, isDHLThemeActive, canToggleDHLTheme, toggleDHLTheme } = useDHLThemeContext();

  const colorSchemes = [
    { value: "purple", label: t('colorPurple'), color: "bg-purple-500" },
    { value: "blue", label: t('colorBlue'), color: "bg-blue-500" },
    { value: "green", label: t('colorGreen'), color: "bg-green-500" },
    { value: "orange", label: t('colorOrange'), color: "bg-orange-500" },
    { value: "red", label: t('colorRed'), color: "bg-red-500" },
    { value: "yellow", label: t('colorYellow'), color: "bg-yellow-500" }
  ];

  return (
    <div className="space-y-6">
      {/* DHL Theme Control */}
      <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-950/10 dark:to-red-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Truck className="h-4 w-4 text-black" />
            </div>
            <div>
              <Label className="text-base font-semibold">🟡 DHL Žluté téma</Label>
              <p className="text-sm text-muted-foreground">
                Kompletní žluté pozadí s DHL barvami
              </p>
            </div>
          </div>
          <Switch
            checked={isDHLThemeActive}
            onCheckedChange={toggleDHLTheme}
            disabled={!canToggleDHLTheme}
          />
        </div>
        
        {isDHLThemeActive && (
          <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                AKTIVNÍ
              </Badge>
              Web používá kompletní žluté DHL téma
            </p>
          </div>
        )}
      </div>

      {/* Standard Color Schemes - only show if DHL theme is not active */}
      {!isDHLThemeActive && (
        <div>
          <Label className={`${isMobile ? 'text-sm' : 'text-base'} mb-3 block`}>{t('colorScheme')}</Label>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-4`}>
            {t('selectMainAppColor')} (dostupné po vypnutí DHL tématu)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colorSchemes.map((scheme) => (
              <Card
                key={scheme.value}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105",
                  colorScheme === scheme.value 
                    ? "ring-2 ring-primary shadow-md" 
                    : "hover:shadow-md"
                )}
                onClick={() => onColorSchemeChange(scheme.value)}
              >
                <CardContent className={`p-3 ${isMobile ? 'p-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-6 h-6 rounded-full", scheme.color)} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                      {scheme.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* DHL Theme Disabled Message */}
      {!isDHLThemeActive && (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">
              DHL téma vypnuto
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Zapněte přepínač výše pro aktivaci žlutého DHL tématu
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorSchemeSelector;

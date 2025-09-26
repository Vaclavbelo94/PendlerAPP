import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Palette, Sun, Moon, Monitor, Type, Layout, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface MobileAppearanceSettingsProps {
  onBack: () => void;
}

const MobileAppearanceSettings: React.FC<MobileAppearanceSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState([16]);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  const handleSave = () => {
    toast.success(t('appearanceSaved'));
  };

  const themeOptions = [
    { value: 'light', label: t('lightTheme'), icon: Sun },
    { value: 'dark', label: t('darkTheme'), icon: Moon },
    { value: 'system', label: t('systemTheme'), icon: Monitor }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{t('appearance')}</h1>
            <p className="text-sm text-muted-foreground">{t('appearanceDescription')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t('theme')}
            </CardTitle>
            <CardDescription>
              {t('themeDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="space-y-3">
                {themeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex items-center gap-2 flex-1 cursor-pointer">
                        <IconComponent className="h-4 w-4" />
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              {t('fontSize')}
            </CardTitle>
            <CardDescription>
              {t('fontSizeDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('small')}</span>
                <span>{t('large')}</span>
              </div>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  {t('currentSize')}: {fontSize[0]}px
                </span>
              </div>
            </div>
            
            {/* Preview Text */}
            <div 
              className="p-3 border rounded-lg bg-muted/30"
              style={{ fontSize: `${fontSize[0]}px` }}
            >
              {t('previewText')}
            </div>
          </CardContent>
        </Card>

        {/* Display Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              {t('displayOptions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactMode">{t('compactMode')}</Label>
                <p className="text-sm text-muted-foreground">{t('compactModeDesc')}</p>
              </div>
              <Switch
                id="compactMode"
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">{t('animations')}</Label>
                <p className="text-sm text-muted-foreground">{t('animationsDesc')}</p>
              </div>
              <Switch
                id="animations"
                checked={animations}
                onCheckedChange={setAnimations}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t('accessibility')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {t('accessibilityDescription')}
            </div>
            
            <Button variant="outline" className="w-full justify-start">
              {t('highContrastMode')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              {t('reduceMotion')}
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <Button onClick={handleSave} className="w-full">
            {t('saveChanges')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileAppearanceSettings;
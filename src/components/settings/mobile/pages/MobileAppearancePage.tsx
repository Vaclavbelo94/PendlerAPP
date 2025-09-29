import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Monitor, Moon, Sun, Type, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { useInternationalization } from '@/hooks/useInternationalization';

const MobileAppearancePage = () => {
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const { currentLanguage, availableLanguages, changeLanguage } = useInternationalization();

  const themeOptions = [
    { value: 'light', label: t('light'), icon: Sun },
    { value: 'dark', label: t('dark'), icon: Moon },
    { value: 'system', label: t('system'), icon: Monitor }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Theme Selection */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t('theme')}</h3>
        </div>
        
        <RadioGroup value={theme} onValueChange={setTheme} className="space-y-3">
          {themeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label 
                htmlFor={option.value}
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Language Selection */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t('language')}</h3>
        </div>
        
        <Select value={currentLanguage} onValueChange={changeLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Options */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-between h-auto py-3 px-4"
          onClick={() => console.log('Font size settings')}
        >
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{t('fontSize')}</div>
              <div className="text-sm text-muted-foreground">{t('fontSizeDesc')}</div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default MobileAppearancePage;
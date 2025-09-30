import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Monitor, Globe, Type } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useInternationalization } from '@/hooks/useInternationalization';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

const MobileAppearancePage = () => {
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const { currentLanguage, availableLanguages, changeLanguage } = useInternationalization();
  const { unifiedUser } = useAuth();
  const [fontSize, setFontSize] = useState('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [unifiedUser?.id]);

  const loadSettings = async () => {
    if (!unifiedUser?.id) return;
    
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('font_size')
        .eq('user_id', unifiedUser.id)
        .single();
      
      if (data?.font_size) {
        setFontSize(data.font_size);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key: string, value: string) => {
    if (!unifiedUser?.id) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: unifiedUser.id,
          [key]: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast.success('Nastavení uloženo');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Chyba při ukládání');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    saveSettings('theme', newTheme);
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    saveSettings('language', langCode);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    saveSettings('font_size', size);
    document.documentElement.style.fontSize = 
      size === 'small' ? '14px' : 
      size === 'large' ? '18px' : '16px';
  };

  const themes = [
    { value: 'light', label: t('light'), icon: Sun },
    { value: 'dark', label: t('dark'), icon: Moon },
    { value: 'system', label: t('system'), icon: Monitor },
  ];

  const fontSizes = [
    { value: 'small', label: t('small') },
    { value: 'medium', label: t('medium') },
    { value: 'large', label: t('large') },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">{t('theme')}</h3>
        <RadioGroup value={theme} onValueChange={handleThemeChange}>
          {themes.map(({ value, label, icon: Icon }) => (
            <div key={value} className="flex items-center space-x-3 bg-card border rounded-lg p-4">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="flex items-center gap-2 flex-1 cursor-pointer">
                <Icon className="h-4 w-4" />
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Language Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">{t('language')}</h3>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{t('language')}</span>
          </div>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Font Size Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">{t('fontSize')}</h3>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Type className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{t('fontSize')}</span>
          </div>
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MobileAppearancePage;
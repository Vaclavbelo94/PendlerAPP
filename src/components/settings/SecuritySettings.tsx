
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Key, Eye, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const SecuritySettings = () => {
  const { t } = useTranslation('settings');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [suspiciousActivityAlerts, setSuspiciousActivityAlerts] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);

  useEffect(() => {
    // Load security settings from localStorage
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTwoFactorAuth(parsed.twoFactorAuth ?? false);
        setAutoLogout(parsed.autoLogout ?? true);
        setSessionTimeout(parsed.sessionTimeout ?? '30');
        setLoginNotifications(parsed.loginNotifications ?? true);
        setSuspiciousActivityAlerts(parsed.suspiciousActivityAlerts ?? true);
        setDataEncryption(parsed.dataEncryption ?? true);
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      twoFactorAuth,
      autoLogout,
      sessionTimeout,
      loginNotifications,
      suspiciousActivityAlerts,
      dataEncryption
    };
    
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    toast.success(t('settingsSaved'));
  };

  const handleReset = () => {
    setTwoFactorAuth(false);
    setAutoLogout(true);
    setSessionTimeout('30');
    setLoginNotifications(true);
    setSuspiciousActivityAlerts(true);
    setDataEncryption(true);
    localStorage.removeItem('securitySettings');
    toast.success(t('settingsReset'));
  };

  return (
    <div className="space-y-6">
      {/* Authentication Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Zabezpečení ověření
          </CardTitle>
          <CardDescription>
            {t('securityAndPrivacySettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('twoFactorAuth')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('additionalAccountProtection')}
              </p>
            </div>
            <Switch
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('autoLogout')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('logoutAfter30MinInactivity')}
              </p>
            </div>
            <Switch
              checked={autoLogout}
              onCheckedChange={setAutoLogout}
            />
          </div>

          {autoLogout && (
            <div className="space-y-2">
              <Label>Časový limit relace (minuty)</Label>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vyberte časový limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minut</SelectItem>
                  <SelectItem value="30">30 minut</SelectItem>
                  <SelectItem value="60">1 hodina</SelectItem>
                  <SelectItem value="120">2 hodiny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Oznámení o zabezpečení
          </CardTitle>
          <CardDescription>
            Spravujte upozornění na bezpečnostní události
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Oznámení o přihlášení</Label>
              <p className="text-sm text-muted-foreground">
                Upozornit na nová přihlášení do účtu
              </p>
            </div>
            <Switch
              checked={loginNotifications}
              onCheckedChange={setLoginNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Podezřelé aktivity</Label>
              <p className="text-sm text-muted-foreground">
                Upozornit na neobvyklé aktivity v účtu
              </p>
            </div>
            <Switch
              checked={suspiciousActivityAlerts}
              onCheckedChange={setSuspiciousActivityAlerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Šifrování dat
              </Label>
              <p className="text-sm text-muted-foreground">
                Šifrovat citlivá data uložená lokálně
              </p>
            </div>
            <Switch
              checked={dataEncryption}
              onCheckedChange={setDataEncryption}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Bezpečnostní akce
          </CardTitle>
          <CardDescription>
            Nástroje pro správu zabezpečení účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Zobrazit aktivní relace
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Historie zabezpečení
            </Button>
          </div>
          <Button variant="destructive" className="w-full">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Odhlásit ze všech zařízení
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2">
          {t('saveChanges')}
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          {t('resetToDefaults')}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;

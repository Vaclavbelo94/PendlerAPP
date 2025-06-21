
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Smartphone, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from '@/hooks/useLanguage';

const SecuritySettings = () => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch') || "Nová hesla se neshodují");
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('passwordMinLength') || "Heslo musí mít alespoň 6 znaků");
      return;
    }

    setLoading(true);
    try {
      // In real app, this would call Supabase auth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('passwordChangedSuccessfully') || "Heslo bylo úspěšně změněno");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(t('passwordChangeError') || "Chyba při změně hesla");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? (t('2faDisabled') || "2FA bylo vypnuto") : (t('2faEnabled') || "2FA bylo zapnuto"));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {t('changePassword') || 'Změna hesla'}
          </CardTitle>
          <CardDescription>
            {t('updatePasswordForSecurity') || 'Aktualizujte své heslo pro lepší zabezpečení'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('currentPassword') || 'Současné heslo'}</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('enterCurrentPassword') || 'Zadejte současné heslo'}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('newPassword') || 'Nové heslo'}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('enterNewPasswordMin6') || 'Zadejte nové heslo (min. 6 znaků)'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmNewPassword') || 'Potvrzení nového hesla'}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmNewPassword') || 'Potvrďte nové heslo'}
            />
          </div>

          <Button 
            onClick={handleChangePassword} 
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {loading ? (t('changingPassword') || "Měním heslo...") : (t('changePassword') || "Změnit heslo")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t('twoFactorAuth') || 'Dvoufaktorové ověření'}
          </CardTitle>
          <CardDescription>
            {t('addExtraSecurityLayer') || 'Přidejte extra vrstvu zabezpečení k vašemu účtu'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">{t('enable2fa') || 'Povolit 2FA'}</Label>
              <p className="text-sm text-muted-foreground">
                {t('requireSecondFactorLogin') || 'Vyžadovat druhý faktor při přihlášení'}
              </p>
            </div>
            <Switch
              id="2fa"
              checked={twoFactorEnabled}
              onCheckedChange={handleEnable2FA}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">{t('2faSetup') || 'Nastavení 2FA'}</p>
              <p className="text-sm text-muted-foreground">
                {t('scanQrCodeWithAuthApp') || 'Naskenujte QR kód pomocí autentifikační aplikace (Google Authenticator, Authy, apod.)'}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                {t('showQrCode') || 'Zobrazit QR kód'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('additionalSecuritySettings') || 'Další bezpečnostní nastavení'}
          </CardTitle>
          <CardDescription>
            {t('advancedSecurityOptions') || 'Pokročilé možnosti zabezpečení'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sessionTimeout">{t('autoLogout') || 'Automatické odhlášení'}</Label>
              <p className="text-sm text-muted-foreground">
                {t('logoutAfter30MinInactivity') || 'Automaticky odhlásit po 30 minutách nečinnosti'}
              </p>
            </div>
            <Switch
              id="sessionTimeout"
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              {t('showActiveSessions') || 'Zobrazit aktivní relace'}
            </Button>
            <Button variant="outline" className="w-full">
              {t('downloadSecurityLog') || 'Stáhnout bezpečnostní log'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;

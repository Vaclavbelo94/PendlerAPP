
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Eye, EyeOff, Smartphone, Clock } from 'lucide-react';
import { toast } from "sonner";

export const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků");
      return;
    }

    setLoading(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Heslo bylo úspěšně změněno");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error("Chyba při změně hesla");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? "2FA bylo vypnuto" : "2FA bylo zapnuto");
  };

  const handleViewActiveSessions = () => {
    toast.info("Funkce zobrazení aktivních relací bude dostupná brzy");
  };

  const handleDownloadSecurityLog = () => {
    // Create mock security log
    const securityLog = {
      user: 'current_user',
      loginHistory: [
        { date: new Date().toISOString(), ip: '192.168.1.1', device: 'Chrome Browser' },
        { date: new Date(Date.now() - 86400000).toISOString(), ip: '192.168.1.1', device: 'Mobile App' }
      ],
      passwordChanges: [
        { date: new Date(Date.now() - 604800000).toISOString(), success: true }
      ],
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(securityLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Bezpečnostní log byl stažen");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Změna hesla
          </CardTitle>
          <CardDescription>
            Aktualizujte své heslo pro lepší zabezpečení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Současné heslo</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Zadejte současné heslo"
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
            <Label htmlFor="newPassword">Nové heslo</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Zadejte nové heslo (min. 6 znaků)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potvrzení nového hesla</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Potvrďte nové heslo"
            />
          </div>

          <Button 
            onClick={handleChangePassword} 
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {loading ? "Měním heslo..." : "Změnit heslo"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Dvoufaktorové ověření
          </CardTitle>
          <CardDescription>
            Přidejte extra vrstvu zabezpečení k vašemu účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Povolit 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Vyžadovat druhý faktor při přihlášení
              </p>
            </div>
            <Switch
              id="2fa"
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Nastavení 2FA</p>
              <p className="text-sm text-muted-foreground mb-3">
                Naskenujte QR kód pomocí autentifikační aplikace (Google Authenticator, Authy, apod.)
              </p>
              <Button variant="outline" size="sm">
                Zobrazit QR kód
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Další bezpečnostní nastavení
          </CardTitle>
          <CardDescription>
            Pokročilé možnosti zabezpečení a soukromí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sessionTimeout">Automatické odhlášení</Label>
              <p className="text-sm text-muted-foreground">
                Automaticky odhlásit po 30 minutách nečinnosti
              </p>
            </div>
            <Switch
              id="sessionTimeout"
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="loginNotifications">Oznámení o přihlášení</Label>
              <p className="text-sm text-muted-foreground">
                Upozornit na nová přihlášení z neznámých zařízení
              </p>
            </div>
            <Switch
              id="loginNotifications"
              checked={loginNotifications}
              onCheckedChange={setLoginNotifications}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Správa relací a auditu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleViewActiveSessions}>
                Zobrazit aktivní relace
              </Button>
              <Button variant="outline" onClick={handleDownloadSecurityLog}>
                Stáhnout bezpečnostní log
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

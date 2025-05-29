
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Smartphone, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
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
      // In real app, this would call Supabase auth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Heslo bylo úspěšně změněno");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Chyba při změně hesla");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? "2FA bylo vypnuto" : "2FA bylo zapnuto");
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
              onCheckedChange={handleEnable2FA}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Nastavení 2FA</p>
              <p className="text-sm text-muted-foreground">
                Naskenujte QR kód pomocí autentifikační aplikace (Google Authenticator, Authy, apod.)
              </p>
              <Button variant="outline" size="sm" className="mt-2">
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
            Pokročilé možnosti zabezpečení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Zobrazit aktivní relace
            </Button>
            <Button variant="outline" className="w-full">
              Stáhnout bezpečnostní log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;

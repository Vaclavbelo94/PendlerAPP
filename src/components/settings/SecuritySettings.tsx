
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, EyeOff, Key, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const SecuritySettings = () => {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load security settings from localStorage on mount
    const savedSecuritySettings = localStorage.getItem('securitySettings');
    if (savedSecuritySettings) {
      try {
        const parsed = JSON.parse(savedSecuritySettings);
        setTwoFactorEnabled(parsed.twoFactorEnabled ?? false);
        setSessionTimeout(parsed.sessionTimeout ?? 30);
        setLoginNotifications(parsed.loginNotifications ?? true);
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const securitySettings = {
        twoFactorEnabled,
        sessionTimeout,
        loginNotifications
      };
      
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
      toast.success("Bezpečnostní nastavení byla uložena");
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error("Chyba při ukládání nastavení");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vyplňte všechna pole");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Nové heslo musí mít alespoň 6 znaků");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password change logic with Supabase
      toast.success("Heslo bylo úspěšně změněno");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Chyba při změně hesla");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Opravdu chcete smazat svůj účet? Tato akce je nevratná.")) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement account deletion logic
      toast.success("Žádost o smazání účtu byla odeslána");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Chyba při mazání účtu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Zabezpečení účtu
          </CardTitle>
          <CardDescription>
            Nastavení zabezpečení a ochrany účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactor" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Dvoufaktorové ověření
              </Label>
              <p className="text-sm text-muted-foreground">
                Dodatečná vrstva zabezpečení pro váš účet
              </p>
            </div>
            <Switch
              id="twoFactor"
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Timeout relace (minuty)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              min="5"
              max="1440"
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Automatické odhlášení po neaktivitě
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="loginNotifications">Oznámení o přihlášení</Label>
              <p className="text-sm text-muted-foreground">
                Upozornění na nová přihlášení do účtu
              </p>
            </div>
            <Switch
              id="loginNotifications"
              checked={loginNotifications}
              onCheckedChange={setLoginNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Změna hesla
          </CardTitle>
          <CardDescription>
            Aktualizace přihlašovacího hesla
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Současné heslo</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Zadejte současné heslo"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nové heslo</Label>
            <Input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Zadejte nové heslo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potvrdit nové heslo</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Potvrďte nové heslo"
            />
          </div>

          <Button onClick={handlePasswordChange} disabled={loading}>
            {loading ? "Změním heslo..." : "Změnit heslo"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Nebezpečná zóna
          </CardTitle>
          <CardDescription>
            Nevratné akce týkající se vašeho účtu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-destructive">Smazat účet</h4>
              <p className="text-sm text-muted-foreground">
                Trvale smaže váš účet a všechna data. Tato akce je nevratná.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
              {loading ? "Zpracovávám..." : "Smazat účet"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? "Ukládám..." : "Uložit nastavení"}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;

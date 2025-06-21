
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Key, Trash2, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { useLanguage } from '@/hooks/useLanguage';

const AccountSettings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch') || "Nová hesla se neshodují");
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('passwordMinLength') || "Heslo musí mít alespoň 6 znaků");
      return;
    }
    toast.success(t('passwordChangedSuccessfully') || "Heslo bylo úspěšně změněno");
  };

  const handleDeleteAccount = () => {
    toast.error(t('deleteAccountFeatureComingSoon') || "Funkce smazání účtu bude implementována později");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('accountInfo') || 'Informace o účtu'}
          </CardTitle>
          <CardDescription>
            {t('basicAccountInformation') || 'Základní informace o vašem účtu'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('emailAddress') || 'E-mailová adresa'}</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{t('accountType') || 'Typ účtu'}</Label>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">
                  {t('basicAccount') || 'Základní účet'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('registrationDate') || 'Datum registrace'}</Label>
            <p className="text-sm text-muted-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : (t('unknown') || 'Neznámé')}
            </p>
          </div>
        </CardContent>
      </Card>

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
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('enterCurrentPassword') || 'Zadejte současné heslo'}
            />
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
            <Label htmlFor="confirmPassword">{t('confirmNewPassword') || 'Potvrďte nové heslo'}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('enterNewPasswordAgain') || 'Zadejte nové heslo znovu'}
            />
          </div>

          <Button 
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            {t('changePassword') || 'Změnit heslo'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t('dangerZone') || 'Nebezpečná zóna'}
          </CardTitle>
          <CardDescription>
            {t('irreversibleActions') || 'Tyto akce jsou nevratné. Buďte opatrní.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('deleteAccount') || 'Smazat účet'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {t('deleteAccountWarning') || 'Tato akce smaže všechna vaše data a nelze ji vrátit zpět.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;

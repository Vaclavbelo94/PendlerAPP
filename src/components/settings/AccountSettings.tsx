
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Key, Trash2, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const AccountSettings = () => {
  const { user } = useAuth();
  const { t } = useTranslation('settings');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('passwordMinLength'));
      return;
    }
    toast.success(t('passwordChangedSuccessfully'));
  };

  const handleDeleteAccount = () => {
    toast.error(t('deleteAccountFeatureComingSoon'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('accountInfo')}
          </CardTitle>
          <CardDescription>
            {t('basicAccountInformation')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('emailAddress')}</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{t('accountType')}</Label>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">
                  {t('basicAccount')}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('registrationDate')}</Label>
            <p className="text-sm text-muted-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : t('unknown')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {t('changePassword')}
          </CardTitle>
          <CardDescription>
            {t('updatePasswordForSecurity')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('enterCurrentPassword')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('enterNewPasswordMin6')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('enterNewPasswordAgain')}
            />
          </div>

          <Button 
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            {t('changePassword')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t('dangerZone')}
          </CardTitle>
          <CardDescription>
            {t('irreversibleActions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('deleteAccount')}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {t('deleteAccountWarning')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;

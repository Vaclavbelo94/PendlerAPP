
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { useTranslation } from 'react-i18next';
import PasswordChangeForm from "./PasswordChangeForm";
import AccountDeletionForm from "./AccountDeletionForm";

const ProfileSettingsSection = () => {
  const { t } = useTranslation('profile');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('accountSettings')}
          </CardTitle>
          <CardDescription>
            {t('accountSecurityDescription')}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PasswordChangeForm />
      
      <Separator />
      
      <AccountDeletionForm />
    </div>
  );
};

export default ProfileSettingsSection;


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import PasswordChangeForm from "./PasswordChangeForm";
import AccountDeletionForm from "./AccountDeletionForm";

const ProfileSettingsSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Nastavení účtu
          </CardTitle>
          <CardDescription>
            Spravujte zabezpečení a nastavení vašeho účtu
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

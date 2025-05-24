
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, KeyIcon, BellIcon, LanguagesIcon } from "lucide-react";
import PersonalInfoForm from "../settings/PersonalInfoForm";
import NotificationSettings from "../settings/NotificationSettings";
import LanguagePreferences from "../settings/LanguagePreferences";
import PasswordChangeForm from "@/components/profile/unified/PasswordChangeForm";
import { useProfileSettings } from "../settings/useProfileSettings";

const ProfileSettingsSection = () => {
  const { 
    loading, 
    profileSettings, 
    filledFields, 
    handleInputChange, 
    handleSaveProfile 
  } = useProfileSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 max-w-2xl">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Osobní údaje</span>
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <KeyIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Heslo</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <BellIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Notifikace</span>
        </TabsTrigger>
        <TabsTrigger value="language" className="flex items-center gap-2">
          <LanguagesIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Jazyk</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Osobní informace</CardTitle>
            <CardDescription>
              Upravte své osobní údaje a veřejné informace profilu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PersonalInfoForm
              displayName={profileSettings.displayName}
              bio={profileSettings.bio}
              location={profileSettings.location}
              website={profileSettings.website}
              filledFields={filledFields}
              handleInputChange={handleInputChange}
            />
            
            <Separator />
            
            <div className="flex justify-end">
              <button 
                onClick={handleSaveProfile} 
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {loading ? "Ukládání..." : "Uložit změny"}
              </button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <PasswordChangeForm />
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Nastavení notifikací</CardTitle>
            <CardDescription>
              Spravujte, jaké typy upozornění chcete dostávat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <NotificationSettings
              emailNotifications={profileSettings.emailNotifications}
              shiftNotifications={profileSettings.shiftNotifications}
              languageReminders={profileSettings.languageReminders}
              handleInputChange={handleInputChange}
            />
            
            <Separator />
            
            <div className="flex justify-end">
              <button 
                onClick={handleSaveProfile} 
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {loading ? "Ukládání..." : "Uložit nastavení"}
              </button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="language">
        <Card>
          <CardHeader>
            <CardTitle>Jazykové preference</CardTitle>
            <CardDescription>
              Nastavte preferovaný jazyk aplikace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LanguagePreferences
              preferredLanguage={profileSettings.preferredLanguage}
              handleInputChange={handleInputChange}
            />
            
            <Separator />
            
            <div className="flex justify-end">
              <button 
                onClick={handleSaveProfile} 
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {loading ? "Ukládání..." : "Uložit nastavení"}
              </button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileSettingsSection;

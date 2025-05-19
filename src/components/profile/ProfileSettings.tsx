
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PersonalInfoForm from "./settings/PersonalInfoForm";
import NotificationSettings from "./settings/NotificationSettings";
import LanguagePreferences from "./settings/LanguagePreferences";
import LoadingSpinner from "./settings/LoadingSpinner";
import { useProfileSettings } from "./settings/useProfileSettings";

const ProfileSettings = () => {
  const { 
    loading, 
    profileSettings, 
    filledFields, 
    handleInputChange, 
    handleSaveProfile 
  } = useProfileSettings();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rozšířené nastavení profilu</CardTitle>
        <CardDescription>
          Upravte si své osobní údaje a nastavení
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
        
        <NotificationSettings
          emailNotifications={profileSettings.emailNotifications}
          shiftNotifications={profileSettings.shiftNotifications}
          languageReminders={profileSettings.languageReminders}
          handleInputChange={handleInputChange}
        />
        
        <Separator />
        
        <LanguagePreferences
          preferredLanguage={profileSettings.preferredLanguage}
          handleInputChange={handleInputChange}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={loading}>
          {loading ? "Ukládání..." : "Uložit nastavení"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;

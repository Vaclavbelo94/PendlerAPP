
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Truck,
  Moon,
  Sun
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import PasswordChangeForm from "./PasswordChangeForm";
import AccountDeletionForm from "./AccountDeletionForm";

const ProfileSettingsSection = () => {
  const { t, i18n } = useTranslation('profile');
  const { user, unifiedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    displayName: user?.user_metadata?.username || '',
    bio: '',
    location: '',
    website: ''
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    shiftReminders: true,
    weeklyReports: false,
    systemUpdates: true
  });

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    language: i18n.language,
    colorScheme: 'blue'
  });

  // DHL specific settings (only for DHL employees)
  const [dhlSettings, setDhlSettings] = useState({
    autoShiftGeneration: true,
    commuteTracking: true,
    documentReminders: true
  });

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('profileUpdated'));
    } catch (error) {
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('notificationsUpdated'));
    } catch (error) {
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceSave = async () => {
    setIsLoading(true);
    try {
      if (appearanceSettings.language !== i18n.language) {
        await i18n.changeLanguage(appearanceSettings.language);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('appearanceUpdated'));
    } catch (error) {
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('profileInformation')}
          </CardTitle>
          <CardDescription>
            {t('updateProfileDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('displayName')}</Label>
              <Input
                id="displayName"
                value={profileSettings.displayName}
                onChange={(e) => setProfileSettings(prev => ({...prev, displayName: e.target.value}))}
                placeholder={t('enterDisplayName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('location')}</Label>
              <Input
                id="location"
                value={profileSettings.location}
                onChange={(e) => setProfileSettings(prev => ({...prev, location: e.target.value}))}
                placeholder={t('enterLocation')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">{t('bio')}</Label>
            <Input
              id="bio"
              value={profileSettings.bio}
              onChange={(e) => setProfileSettings(prev => ({...prev, bio: e.target.value}))}
              placeholder={t('tellUsAboutYou')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">{t('website')}</Label>
            <Input
              id="website"
              value={profileSettings.website}
              onChange={(e) => setProfileSettings(prev => ({...prev, website: e.target.value}))}
              placeholder="https://..."
            />
          </div>

          <Button onClick={handleProfileSave} disabled={isLoading}>
            {isLoading ? t('saving') : t('saveChanges')}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Notifikace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications')}
          </CardTitle>
          <CardDescription>
            {t('manageNotificationPreferences')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('emailNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('receiveEmailUpdates')}</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, emailNotifications: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('shiftReminders')}</Label>
                <p className="text-sm text-muted-foreground">{t('remindersForUpcomingShifts')}</p>
              </div>
              <Switch
                checked={notificationSettings.shiftReminders}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, shiftReminders: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('weeklyReports')}</Label>
                <p className="text-sm text-muted-foreground">{t('receiveWeeklySummaries')}</p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, weeklyReports: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('systemUpdates')}</Label>
                <p className="text-sm text-muted-foreground">{t('importantAppUpdates')}</p>
              </div>
              <Switch
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, systemUpdates: checked}))}
              />
            </div>
          </div>

          <Button onClick={handleNotificationSave} disabled={isLoading}>
            {isLoading ? t('saving') : t('saveNotificationSettings')}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Vzhled a jazyk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('appearance')}
          </CardTitle>
          <CardDescription>
            {t('customizeAppearance')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {appearanceSettings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <Label>{t('darkMode')}</Label>
            </div>
            <Switch
              checked={appearanceSettings.darkMode}
              onCheckedChange={(checked) => setAppearanceSettings(prev => ({...prev, darkMode: checked}))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('language')}
            </Label>
            <Select
              value={appearanceSettings.language}
              onValueChange={(value) => setAppearanceSettings(prev => ({...prev, language: value}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Čeština</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pl">Polski</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('colorScheme')}</Label>
            <Select
              value={appearanceSettings.colorScheme}
              onValueChange={(value) => setAppearanceSettings(prev => ({...prev, colorScheme: value}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">{t('blue')}</SelectItem>
                <SelectItem value="green">{t('green')}</SelectItem>
                <SelectItem value="purple">{t('purple')}</SelectItem>
                <SelectItem value="orange">{t('orange')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAppearanceSave} disabled={isLoading}>
            {isLoading ? t('saving') : t('saveAppearanceSettings')}
          </Button>
        </CardContent>
      </Card>

      {/* DHL specifické nastavení (pouze pro DHL zaměstnance) */}
      {unifiedUser?.isDHLEmployee && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t('dhlSettings')}
              </CardTitle>
              <CardDescription>
                {t('dhlSpecificPreferences')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('autoShiftGeneration')}</Label>
                  <p className="text-sm text-muted-foreground">{t('automaticallyCreateShifts')}</p>
                </div>
                <Switch
                  checked={dhlSettings.autoShiftGeneration}
                  onCheckedChange={(checked) => setDhlSettings(prev => ({...prev, autoShiftGeneration: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('commuteTracking')}</Label>
                  <p className="text-sm text-muted-foreground">{t('trackDailyCommute')}</p>
                </div>
                <Switch
                  checked={dhlSettings.commuteTracking}
                  onCheckedChange={(checked) => setDhlSettings(prev => ({...prev, commuteTracking: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('documentReminders')}</Label>
                  <p className="text-sm text-muted-foreground">{t('remindDocumentExpiry')}</p>
                </div>
                <Switch
                  checked={dhlSettings.documentReminders}
                  onCheckedChange={(checked) => setDhlSettings(prev => ({...prev, documentReminders: checked}))}
                />
              </div>

              <Button onClick={() => toast.success(t('dhlSettingsSaved'))} disabled={isLoading}>
                {isLoading ? t('saving') : t('saveDhlSettings')}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <Separator />
      
      {/* Změna hesla */}
      <PasswordChangeForm />
      
      <Separator />
      
      {/* Smazání účtu */}
      <AccountDeletionForm />
    </div>
  );
};

export default ProfileSettingsSection;

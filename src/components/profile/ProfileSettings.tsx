
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Phone } from "lucide-react";
import { useProfileSettings } from "./settings/useProfileSettings";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import DHLProfileSettings from './DHLProfileSettings';

const ProfileSettings = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  const isDHLUser = canAccessDHLFeatures(user);
  
  const {
    loading,
    profileSettings,
    filledFields,
    handleInputChange,
    handleSaveProfile
  } = useProfileSettings();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* DHL Settings - only for DHL users */}
      {isDHLUser && <DHLProfileSettings />}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('personalInformation')}</CardTitle>
          <CardDescription>
            {t('personalInfoManage')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('displayName')}</Label>
              <div className="relative">
                <Input
                  id="displayName"
                  value={profileSettings.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder={t('yourDisplayName')}
                />
                {filledFields.displayName && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profileSettings.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+420 123 456 789"
                  className="pl-10"
                />
                {filledFields.phoneNumber && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('phoneDisplayNote')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('location')}</Label>
            <div className="relative">
              <Input
                id="location"
                value={profileSettings.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={t('cityRegion')}
              />
              {filledFields.location && (
                <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">{t('website')}</Label>
            <div className="relative">
              <Input
                id="website"
                type="url"
                value={profileSettings.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
              {filledFields.website && (
                <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t('aboutMe')}</Label>
            <div className="relative">
              <Textarea
                id="bio"
                value={profileSettings.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder={t('writeSomethingAboutYourself')}
                rows={3}
              />
              {filledFields.bio && (
                <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('notificationSettings')}</CardTitle>
          <CardDescription>
            {t('notificationManage')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('emailNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('receiveEmailNotifications')}
                </p>
              </div>
              <Switch
                checked={profileSettings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('shiftNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('shiftNotificationsDescription')}
                </p>
              </div>
              <Switch
                checked={profileSettings.shiftNotifications}
                onCheckedChange={(checked) => handleInputChange('shiftNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('languageReminders')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('languageRemindersDescription')}
                </p>
              </div>
              <Switch
                checked={profileSettings.languageReminders}
                onCheckedChange={(checked) => handleInputChange('languageReminders', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t('languagePreferences')}</CardTitle>
          <CardDescription>
            {t('languagePreferencesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">{t('preferredLanguage')}</Label>
            <Select
              value={profileSettings.preferredLanguage}
              onValueChange={(value) => handleInputChange('preferredLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">{t('czech')}</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">{t('german')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={loading}>
          {loading ? t('saving') : t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;

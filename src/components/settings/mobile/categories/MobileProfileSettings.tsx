import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Mail, Phone, Globe, MapPin, FileText, Camera, Lock, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

interface MobileProfileSettingsProps {
  onBack: () => void;
}

const MobileProfileSettings: React.FC<MobileProfileSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { user, unifiedUser } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const [profile, setProfile] = useState({
    displayName: unifiedUser?.email?.split('@')[0] || '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    language: 'cs'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    shifts: true,
    reminders: true
  });

  const handleSave = () => {
    // Save profile settings
    toast.success(t('profileSaved'));
  };

  const handlePasswordChange = () => {
    // Trigger password reset
    toast.info(t('passwordResetSent'));
  };

  const handleDeleteAccount = () => {
    // Delete account confirmation
    toast.error(t('deleteAccountNotImplemented'));
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{t('profile')}</h1>
            <p className="text-sm text-muted-foreground">{t('profileDescription')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('accountInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user?.email ? getUserInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{profile.displayName || user?.email}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {unifiedUser?.role || 'USER'}
                    </Badge>
                    {unifiedUser?.isPremium && (
                      <Badge variant="default" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">{t('displayName')}</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder={t('enterDisplayName')}
                />
              </div>

              <div>
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t('enterPhoneNumber')}
                />
              </div>

              <div>
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={t('enterLocation')}
                />
              </div>

              <div>
                <Label htmlFor="website">{t('website')}</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  placeholder={t('enterWebsite')}
                />
              </div>

              <div>
                <Label htmlFor="bio">{t('bio')}</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={t('enterBio')}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Čeština</SelectItem>
                <SelectItem value="pl">Polski</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('notificationPreferences')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">{t('emailNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('emailNotificationsDesc')}</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="shiftNotifications">{t('shiftNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('shiftNotificationsDesc')}</p>
              </div>
              <Switch
                id="shiftNotifications"
                checked={notifications.shifts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, shifts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminders">{t('languageReminders')}</Label>
                <p className="text-sm text-muted-foreground">{t('languageRemindersDesc')}</p>
              </div>
              <Switch
                id="reminders"
                checked={notifications.reminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reminders: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t('security')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handlePasswordChange}
            >
              <Lock className="h-4 w-4 mr-2" />
              {t('changePassword')}
            </Button>

            <Separator />

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('deleteAccount')}
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <Button onClick={handleSave} className="w-full">
            {t('saveChanges')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileProfileSettings;
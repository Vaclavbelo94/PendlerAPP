import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Globe, MapPin, Camera, Lock, Trash2, Crown, Building2, Languages } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ConsistentCard, ConsistentButton } from '@/components/ui/design-system';
import { useAuth } from '@/hooks/auth';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useCompany } from '@/hooks/useCompany';
import { useInternationalization } from '@/hooks/useInternationalization';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const MobileProfileTab = () => {
  const { t } = useTranslation('settings');
  const { user, unifiedUser } = useAuth();
  const { settings, saveSettings, isLoading } = useUserSettings();
  const { isDHL } = useCompany();
  const { availableLanguages, changeLanguage } = useInternationalization();
  
  const [profile, setProfile] = useState({
    displayName: '',
    phone: '',
    location: '',
    website: '',
    bio: ''
  });

  const [dhlData, setDhlData] = useState({
    personalNumber: '',
    currentWoche: 1,
    position: ''
  });

  // Load profile data on mount
  useEffect(() => {
    if (settings && !isLoading) {
      setProfile({
        displayName: settings.display_name || unifiedUser?.email?.split('@')[0] || '',
        phone: settings.phone_number || '',
        location: settings.location || '',
        website: settings.website || '',
        bio: settings.bio || ''
      });
    }
  }, [settings, isLoading, unifiedUser]);

  // Load DHL data if user is DHL employee
  useEffect(() => {
    const loadDHLData = async () => {
      if (!isDHL || !user) return;

      try {
        const { data: assignment } = await supabase
          .from('user_dhl_assignments')
          .select('*, dhl_positions(name)')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle();

        if (assignment) {
          setDhlData({
            personalNumber: profile?.username || '',
            currentWoche: assignment.current_woche || 1,
            position: assignment.dhl_positions?.name || ''
          });
        }
      } catch (error) {
        console.error('Error loading DHL data:', error);
      }
    };

    loadDHLData();
  }, [isDHL, user]);

  const handleSave = async () => {
    const success = await saveSettings({
      display_name: profile.displayName,
      phone_number: profile.phone,
      location: profile.location,
      website: profile.website,
      bio: profile.bio
    });

    if (success) {
      toast.success(t('profileSaved'));
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      toast.success(t('passwordResetSent'));
    } catch (error) {
      toast.error('Chyba při odesílání e-mailu');
    }
  };

  const handleDeleteAccount = () => {
    toast.error(t('deleteAccountNotImplemented'));
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return <div className="p-4">Načítám...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Account Information */}
      <ConsistentCard
        title={t('accountInfo')}
        className="animate-fade-in"
      >
        {/* Avatar Section */}
        <div className="flex items-center justify-between mb-6">
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
                  <Badge variant="default" className="text-xs bg-gradient-primary text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {isDHL && (
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    DHL
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <ConsistentButton variant="outline" size="sm">
            <Camera className="h-4 w-4" />
          </ConsistentButton>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">{t('displayName')}</Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder={t('enterDisplayName')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">{t('displayNameDescription')}</p>
          </div>

          <div>
            <Label htmlFor="phone">{t('phoneNumber')}</Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              placeholder={t('enterPhoneNumber')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">{t('phoneNumberDescription')}</p>
          </div>

          <div>
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder={t('enterLocation')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">{t('locationDescription')}</p>
          </div>

          <div>
            <Label htmlFor="website">{t('website')}</Label>
            <Input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
              placeholder={t('enterWebsite')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">{t('websiteDescription')}</p>
          </div>

          <div>
            <Label htmlFor="bio">{t('bio')}</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder={t('enterBio')}
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">{t('bioDescription')}</p>
          </div>
        </div>
      </ConsistentCard>

      {/* Language Settings */}
      <ConsistentCard
        title={t('language')}
        className="animate-fade-in"
      >
        <Select value={settings.language} onValueChange={changeLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ConsistentCard>

      {/* Premium Status */}
      <ConsistentCard
        title={t('premiumStatus')}
        className="animate-fade-in"
      >
        {unifiedUser?.isPremium ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-green-600">{t('premiumActive')}</p>
                {unifiedUser.premiumExpiry && (
                  <p className="text-sm text-muted-foreground">
                    {t('premiumExpires')}: {new Date(unifiedUser.premiumExpiry).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">{t('premiumNotActive')}</p>
            <ConsistentButton variant="default" className="w-full bg-gradient-primary hover:bg-gradient-primary/90">
              <Crown className="h-4 w-4 mr-2" />
              {t('upgradeToPremium')}
            </ConsistentButton>
          </div>
        )}
      </ConsistentCard>

      {/* DHL Settings - only for DHL employees */}
      {isDHL && (
        <ConsistentCard
          title={t('dhlSettings')}
          description={t('dhlSettingsDescription')}
          className="animate-fade-in"
        >
          <div className="space-y-4">
            <div>
              <Label>{t('personalNumber')}</Label>
              <Input
                value={dhlData.personalNumber}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label>{t('currentWoche')}</Label>
              <Input
                value={dhlData.currentWoche}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label>{t('position')}</Label>
              <Input
                value={dhlData.position}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </ConsistentCard>
      )}

      {/* Security Settings */}
      <ConsistentCard
        title={t('security')}
        className="animate-fade-in"
      >
        <div className="space-y-4">
          <ConsistentButton
            variant="outline"
            className="w-full justify-start"
            onClick={handlePasswordChange}
          >
            <Lock className="h-4 w-4 mr-2" />
            {t('changePassword')}
          </ConsistentButton>

          <ConsistentButton
            variant="destructive"
            className="w-full justify-start"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('deleteAccount')}
          </ConsistentButton>
        </div>
      </ConsistentCard>

      {/* Save Button */}
      <div className="pb-6">
        <ConsistentButton onClick={handleSave} className="w-full">
          {t('saveChanges')}
        </ConsistentButton>
      </div>
    </div>
  );
};

export default MobileProfileTab;
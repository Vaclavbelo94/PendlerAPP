import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { useInternationalization } from '@/hooks/useInternationalization';
import { useUserSettings } from '@/hooks/useUserSettings';
import SettingItem from '../SettingItem';

interface ProfileSettingsProps {
  onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { user } = useAuth();
  const { availableLanguages, changeLanguage, currentLanguage } = useInternationalization();
  const { settings, updateSetting, isSaving } = useUserSettings();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    try {
      changeLanguage(langCode);
      await updateSetting('language', langCode);
      toast.success(t('languageChanged'));
    } catch (error) {
      toast.error('Nepodařilo se změnit jazyk');
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.email) return;
    
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
      
      toast.success(t('passwordResetSent'));
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Nepodařilo se odeslat e-mail pro změnu hesla');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast.error(t('deleteAccountNotImplemented'));
  };

  const languageOptions = availableLanguages.map(lang => ({
    value: lang.code,
    label: `${lang.flag} ${lang.name}`
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold">{t('profile')}</h2>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('account')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('email')}
                description={t('emailDescription')}
                type="display"
                value={user?.email || ''}
              />
              
              <SettingItem
                title={t('displayName')}
                description={t('displayNameDescription')}
                type="input"
                value={settings.display_name}
                onChange={(value) => updateSetting('display_name', value)}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('language')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('language')}
                description={t('languageDescription')}
                type="select"
                value={currentLanguage}
                onChange={handleLanguageChange}
                options={languageOptions}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('security')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('changePassword')}
                description={t('changePasswordDescription')}
                type="button"
                onClick={handlePasswordChange}
                disabled={isChangingPassword || isSaving}
              />
              
              <SettingItem
                title={t('deleteAccount')}
                description={t('deleteAccountDescription')}
                type="button"
                onClick={handleDeleteAccount}
                variant="destructive"
                disabled={isSaving}
              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
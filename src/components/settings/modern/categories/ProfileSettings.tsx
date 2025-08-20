import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth';
import SettingItem from '../SettingItem';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation('settings');
  const { user } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const languageOptions = [
    { value: 'cs', label: 'Čeština' },
    { value: 'de', label: 'Deutsch' },
    { value: 'pl', label: 'Polski' }
  ];

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    toast.success(t('languageChanged'));
  };

  const handlePasswordChange = () => {
    setShowPasswordChange(true);
    // TODO: Implement password change functionality
    toast.info(t('passwordChangeNotImplemented'));
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    toast.error(t('deleteAccountNotImplemented'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">{t('profile')}</h2>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('accountInfo')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('email')}
                type="display"
                value={user?.email || 'N/A'}
              />
              <SettingItem
                title={t('displayName')}
                type="input"
                value={user?.user_metadata?.display_name || ''}
                onChange={(value) => {
                  // TODO: Update display name
                  toast.info(t('displayNameUpdateNotImplemented'));
                }}
              />
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('language')}</h3>
            <SettingItem
              title={t('preferredLanguage')}
              description={t('languageDescription')}
              type="select"
              value={i18n.language}
              onChange={handleLanguageChange}
              options={languageOptions}
            />
          </Card>

          {/* Security */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('security')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('changePassword')}
                description={t('passwordDescription')}
                type="button"
                onClick={handlePasswordChange}
              />
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/20">
            <h3 className="text-lg font-medium mb-4 text-destructive">{t('dangerZone')}</h3>
            <SettingItem
              title={t('deleteAccount')}
              description={t('deleteAccountDescription')}
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
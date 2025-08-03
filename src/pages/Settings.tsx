
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import GeneralSettings from '@/components/settings/GeneralSettings';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import DeviceSettings from '@/components/settings/DeviceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import ModernSettingsContainer from '@/components/settings/modern/ModernSettingsContainer';
import DashboardBackground from '@/components/common/DashboardBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('settings');

  return (
    <Layout>
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('title')} />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with dashboard-style animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20`}>
                <SettingsIcon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
              </div>
              <div>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-foreground`}>
                  {t('title')}
                </h1>
                <p className={`text-muted-foreground ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                  {isMobile 
                    ? t('basicSettings') 
                    : t('applicationBehavior')
                  }
                </p>
              </div>
            </div>
            {isMobile && (
              <p className="text-xs text-muted-foreground/80 text-center px-4">
                💡 {t('swipeNavigationTip')}
              </p>
            )}
          </motion.div>

      <ProfileErrorBoundary>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[calc(100vh-12rem)] bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden"
        >
          <ModernSettingsContainer />
        </motion.div>
      </ProfileErrorBoundary>
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default Settings;

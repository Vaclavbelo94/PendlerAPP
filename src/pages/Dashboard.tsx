
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import DashboardBackground from '@/components/common/DashboardBackground';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardActions from '@/components/dashboard/DashboardActions';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import DHLSetupNotification from '@/components/dashboard/DHLSetupNotification';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['dashboard', 'ui']);

  const username = user?.email?.split('@')[0] || t('ui:user');

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('dashboard:title')} | PendlerApp</title>
        <meta name="description" content={t('dashboard:dashboardSubtitle')} />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container max-w-7xl py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t('dashboard:welcomeBack')}, {username}!
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  {t('dashboard:dashboardSubtitle')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* DHL Setup Notification */}
          <DHLSetupNotification />

          {/* Dashboard Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <DashboardOverview />
          </motion.div>

          {/* Dashboard Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <DashboardStats />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <DashboardActions />
          </motion.div>

          {/* Dashboard Widgets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <DashboardWidgets />
          </motion.div>
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default Dashboard;

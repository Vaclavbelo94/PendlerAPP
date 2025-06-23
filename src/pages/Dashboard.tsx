
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardActions from '@/components/dashboard/DashboardActions';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';

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
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10">
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
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

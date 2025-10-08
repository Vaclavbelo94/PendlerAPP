import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';
import WageCalculator from '@/components/wage/WageCalculator';

const WageOverview = () => {
  const { t } = useTranslation('wageCalculator');

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <div className="container max-w-6xl py-8 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {t('description')}
              </p>
            </motion.div>

            <WageCalculator />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WageOverview;

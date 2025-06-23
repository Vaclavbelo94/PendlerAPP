
import React from 'react';
import { Helmet } from 'react-helmet';
import ModernHero from '@/components/modern/ModernHero';
import { PublicLayout } from '@/components/modern/PublicLayout';
import { useTranslation } from 'react-i18next';

const ModernIndex: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <PublicLayout>
      <Helmet>
        <title>PendlerApp - {t('heroSubtitle') || 'Modern App for Commuters'}</title>
        <meta name="description" content={t('heroDescription') || 'Comprehensive solution for cross-border workers'} />
        <meta name="keywords" content="pendler, německo, polsko, práce, směny, kalkulačka, daně" />
        <meta property="og:title" content={`PendlerApp - ${t('heroSubtitle') || 'Modern App for Commuters'}`} />
        <meta property="og:description" content={t('heroDescription') || 'Comprehensive solution for cross-border workers'} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pendlerapp.com" />
      </Helmet>
      <ModernHero />
    </PublicLayout>
  );
};

export default ModernIndex;

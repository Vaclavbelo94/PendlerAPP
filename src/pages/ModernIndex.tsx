
import React from 'react';
import { Helmet } from 'react-helmet';
import ModernHero from '@/components/modern/ModernHero';
import { PublicLayout } from '@/components/modern/PublicLayout';
import { useTranslation } from 'react-i18next';

const ModernIndex: React.FC = () => {
  const { t } = useTranslation('dashboard');

  return (
    <PublicLayout>
      <Helmet>
        <title>PendlerApp - {t('czechWorkersHelper')}</title>
        <meta name="description" content={t('completeGermanySolution')} />
        <meta name="keywords" content="pendler, německo, polsko, práce, směny, kalkulačka, daně" />
        <meta property="og:title" content={`PendlerApp - ${t('czechWorkersHelper')}`} />
        <meta property="og:description" content={t('completeGermanySolution')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pendlerapp.com" />
      </Helmet>
      <ModernHero />
    </PublicLayout>
  );
};

export default ModernIndex;

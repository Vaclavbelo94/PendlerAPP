
import React from 'react';
import { Helmet } from 'react-helmet';
import ModernHero from '@/components/home/ModernHero';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>PendlerApp - {t('appName')}</title>
        <meta name="description" content={t('heroDescription')} />
        <meta name="keywords" content="pendler, německo, práce, směny, němčina, kalkulačka mezd" />
        <meta property="og:title" content={`PendlerApp - ${t('appName')}`} />
        <meta property="og:description" content={t('heroDescription')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pendlerapp.com" />
      </Helmet>
      
      <ModernHero />
    </>
  );
};

export default HomePage;


import React from 'react';
import { Helmet } from 'react-helmet';
import { ModernHero } from '@/components/modern/ModernHero';
import { PublicLayout } from '@/components/modern/PublicLayout';
import { useLanguage } from '@/hooks/useLanguage';

const ModernIndex: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PublicLayout>
      <Helmet>
        <title>PendlerApp - {t('heroSubtitle')}</title>
        <meta name="description" content={t('heroDescription')} />
        <meta name="keywords" content="pendler, německo, polsko, práce, směny, kalkulačka, daně" />
        <meta property="og:title" content={`PendlerApp - ${t('heroSubtitle')}`} />
        <meta property="og:description" content={t('heroDescription')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pendlerapp.com" />
      </Helmet>
      <ModernHero />
    </PublicLayout>
  );
};

export default ModernIndex;

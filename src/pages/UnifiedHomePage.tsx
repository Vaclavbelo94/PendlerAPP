
import React from 'react';
import { Helmet } from 'react-helmet';
import { UnifiedHero } from '@/components/home/unified/UnifiedHero';
import { UnifiedFeatures } from '@/components/home/unified/UnifiedFeatures';
import { UnifiedStats } from '@/components/home/unified/UnifiedStats';
import { UnifiedCTA } from '@/components/home/unified/UnifiedCTA';
import { useTranslation } from 'react-i18next';

const UnifiedHomePage = () => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('czechWorkersHelper')} - {t('completeGermanySolution')}</title>
        <meta 
          name="description" 
          content={t('completeGermanySolution')} 
        />
      </Helmet>
      
      <UnifiedHero />
      <UnifiedFeatures />
      <UnifiedStats />
      <UnifiedCTA />
    </div>
  );
};

export default UnifiedHomePage;


import React from 'react';
import { Helmet } from 'react-helmet';
import { UnifiedHero } from '@/components/home/unified/UnifiedHero';
import { UnifiedFeatures } from '@/components/home/unified/UnifiedFeatures';
import { UnifiedStats } from '@/components/home/unified/UnifiedStats';
import { UnifiedCTA } from '@/components/home/unified/UnifiedCTA';
import { useLanguage } from '@/hooks/useLanguage';

const UnifiedHomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('pendlerHelper')} - {t('workAbroadGuide')}</title>
        <meta 
          name="description" 
          content={t('completeAppDescription')} 
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

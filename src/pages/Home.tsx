
import React from 'react';
import { Helmet } from 'react-helmet';
import DHLModernHero from '@/components/home/DHLModernHero';
import Features from '@/components/home/Features';
import ModernTestimonials from '@/components/home/ModernTestimonials';
import CTA from '@/components/home/CTA';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation('dashboard');

  return (
    <>
      <Helmet>
        <title>PendlerApp - {t('czechWorkersHelper')}</title>
        <meta 
          name="description" 
          content={t('completeGermanySolution')} 
        />
        <meta name="keywords" content="pendler, czech, germany, austria, work abroad, tax advisor, calculator" />
      </Helmet>
      
      <div className="flex flex-col">
        <DHLModernHero />
        <Features />
        <ModernTestimonials />
        <CTA />
      </div>
    </>
  );
};

export default Home;

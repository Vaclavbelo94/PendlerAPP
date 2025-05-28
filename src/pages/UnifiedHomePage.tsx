
import React from 'react';
import { Helmet } from 'react-helmet';
import { UnifiedHero } from '@/components/home/unified/UnifiedHero';
import { UnifiedFeatures } from '@/components/home/unified/UnifiedFeatures';
import { UnifiedStats } from '@/components/home/unified/UnifiedStats';
import { UnifiedCTA } from '@/components/home/unified/UnifiedCTA';

const UnifiedHomePage = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Pendlerův Pomocník - Váš průvodce pro práci v zahraničí</title>
        <meta 
          name="description" 
          content="Komplexní aplikace pro správu směn, vzdělávání a efektivní dojíždění. Vše co potřebujete pro úspěšnou práci v zahraničí na jednom místě." 
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

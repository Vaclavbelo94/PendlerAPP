
import React from 'react';
import { Helmet } from 'react-helmet';
import DHLModernHero from '@/components/home/DHLModernHero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>PendlerApp - Profesionální nástroje pro české pendlery</title>
        <meta 
          name="description" 
          content="Komplexní řešení pro české pracovníky v zahraničí. Cestovní kalkulačky, daňové poradenství, překladač a správa směn na jednom místě." 
        />
        <meta name="keywords" content="pendler, czech, germany, austria, work abroad, tax advisor, calculator" />
      </Helmet>
      
      <div className="flex flex-col">
        <DHLModernHero />
        <Features />
        <Testimonials />
        <CTA />
      </div>
    </>
  );
};

export default Home;

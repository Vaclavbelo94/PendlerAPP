
import React from 'react';
import { Helmet } from "react-helmet";
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { EnhancedStats } from '@/components/home/EnhancedStats';
import { HowItWorks } from '@/components/home/HowItWorks';
import Benefits from '@/components/home/Benefits';
import CTA from '@/components/home/CTA';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Pendlerův Pomocník - Váš průvodce pro práci v zahraničí</title>
      </Helmet>
      
      <Hero />
      <EnhancedStats />
      <Features />
      <HowItWorks />
      <Benefits />
      <CTA />
    </div>
  );
};

export default Home;

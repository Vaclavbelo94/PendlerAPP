
import React from 'react';
import { Helmet } from "react-helmet";
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { EnhancedStats } from '@/components/home/EnhancedStats';
import { HowItWorks } from '@/components/home/HowItWorks';
import Benefits from '@/components/home/Benefits';
import AppShowcase from '@/components/home/AppShowcase';
import CTA from '@/components/home/CTA';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Pendler Buddy - Váš průvodce pro práci v zahraničí</title>
      </Helmet>
      
      <Hero />
      <EnhancedStats />
      <Features />
      <HowItWorks />
      <Benefits />
      <AppShowcase />
      <CTA />
    </div>
  );
};

export default Home;

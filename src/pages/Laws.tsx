import React from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';

const Laws = () => {
  return (
    <PremiumCheck featureKey="laws">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Přehled zákonů</h1>
        
      </div>
    </PremiumCheck>
  );
};

export default Laws;

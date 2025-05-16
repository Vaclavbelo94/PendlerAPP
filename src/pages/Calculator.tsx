import React from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import BasicCalculator from "@/components/calculator/BasicCalculator";

const Calculator = () => {
  return (
    <PremiumCheck featureKey="calculator">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Kalkulačky</h1>
        <BasicCalculator />
      </div>
    </PremiumCheck>
  );
};

export default Calculator;


import { useState, useCallback } from 'react';

export interface TaxResult {
  grossIncome: number;
  netIncome: number;
  taxAmount: number;
  socialInsurance: number;
  effectiveRate: number;
}

export interface TaxCalculatorOptions {
  country: string;
  taxClass: string;
  children: number;
  married: boolean;
  church: boolean;
}

export const useTaxCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateTax = useCallback((grossIncome: number, options: TaxCalculatorOptions): TaxResult | null => {
    if (grossIncome <= 0) return null;

    setIsCalculating(true);
    
    try {
      // Simplified German tax calculation
      let taxableIncome = grossIncome;
      
      // Basic allowances
      const basicAllowance = 10908; // 2024 German basic allowance
      taxableIncome = Math.max(0, taxableIncome - basicAllowance);
      
      // Progressive tax calculation (simplified)
      let incomeTax = 0;
      if (taxableIncome <= 16040) {
        // 14% to 24% bracket
        incomeTax = taxableIncome * 0.14;
      } else if (taxableIncome <= 66760) {
        // 24% to 42% bracket
        incomeTax = 16040 * 0.14 + (taxableIncome - 16040) * 0.24;
      } else if (taxableIncome <= 277826) {
        // 42% bracket
        incomeTax = 16040 * 0.14 + (66760 - 16040) * 0.24 + (taxableIncome - 66760) * 0.42;
      } else {
        // 45% bracket
        incomeTax = 16040 * 0.14 + (66760 - 16040) * 0.24 + (277826 - 66760) * 0.42 + (taxableIncome - 277826) * 0.45;
      }
      
      // Solidarity surcharge (5.5% on income tax if > 16956€)
      const solidarityTax = incomeTax > 16956 ? incomeTax * 0.055 : 0;
      
      // Church tax (8% or 9% of income tax if applicable)
      const churchTax = options.church ? incomeTax * 0.08 : 0;
      
      // Social insurance (approximate 20% of gross)
      const socialInsurance = grossIncome * 0.20;
      
      const totalTax = incomeTax + solidarityTax + churchTax;
      const netIncome = grossIncome - totalTax - socialInsurance;
      const effectiveRate = (totalTax / grossIncome) * 100;
      
      return {
        grossIncome,
        netIncome,
        taxAmount: totalTax,
        socialInsurance,
        effectiveRate
      };
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return {
    calculateTax,
    isCalculating
  };
};

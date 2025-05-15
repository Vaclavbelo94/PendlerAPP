
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TaxResult {
  grossIncome: number;
  taxAmount: number;
  socialSecurity: number;
  healthInsurance: number;
  netIncome: number;
  effectiveTaxRate: number;
}

interface TaxCalculatorOptions {
  country: string;
  taxClass?: string;
  children?: number;
  married?: boolean;
  church?: boolean;
}

export const useTaxCalculator = () => {
  const [result, setResult] = useState<TaxResult | null>(null);
  const { toast } = useToast();

  const calculateGermanTax = (
    grossIncome: number, 
    options: TaxCalculatorOptions
  ): TaxResult => {
    const { taxClass = "1", children = 0, married = false, church = false } = options;
    
    // Simplified German tax calculation (approximation)
    let taxRate: number;
    switch (taxClass) {
      case "1":
        taxRate = 0.36; // Class I - approximately 36%
        break;
      case "2":
        taxRate = 0.32; // Class II - approximately 32%
        break;
      case "3":
        taxRate = 0.28; // Class III - approximately 28%
        break;
      case "4":
        taxRate = 0.36; // Class IV - approximately 36%
        break;
      case "5":
        taxRate = 0.42; // Class V - approximately 42%
        break;
      case "6":
        taxRate = 0.45; // Class VI - approximately 45%
        break;
      default:
        taxRate = 0.36;
    }
    
    // Apply modifiers
    if (children > 0) {
      taxRate -= 0.01 * Math.min(children, 3); // Max 3% reduction for children
    }
    
    if (church) {
      taxRate += 0.009; // Church tax approximately 0.9%
    }
    
    // High-income surtax
    if (grossIncome > 250000) {
      taxRate += 0.03; // Solidarity surcharge for high incomes
    }
    
    const taxAmount = grossIncome * taxRate;
    const socialSecurity = grossIncome * 0.15; // Approximately 15% for social security
    const healthInsurance = grossIncome * 0.075; // Approximately 7.5% for health insurance
    const totalDeductions = taxAmount + socialSecurity + healthInsurance;
    const netIncome = grossIncome - totalDeductions;
    
    return {
      grossIncome,
      taxAmount,
      socialSecurity,
      healthInsurance,
      netIncome,
      effectiveTaxRate: totalDeductions / grossIncome
    };
  };
  
  const calculateCzechTax = (
    grossIncome: number, 
    options: TaxCalculatorOptions
  ): TaxResult => {
    const { children = 0, married = false } = options;
    
    let taxRate = 0.15; // Flat 15% income tax
    
    // Apply modifiers
    if (children > 0) {
      taxRate -= 0.01 * Math.min(children, 3); // Tax relief for children
    }
    
    if (grossIncome > 1800000) { // Approximately 72,000 EUR
      taxRate = 0.23; // Higher tax bracket
    }
    
    const taxAmount = grossIncome * taxRate;
    const socialSecurity = grossIncome * 0.065; // 6.5% social security
    const healthInsurance = grossIncome * 0.045; // 4.5% health insurance
    const totalDeductions = taxAmount + socialSecurity + healthInsurance;
    const netIncome = grossIncome - totalDeductions;
    
    return {
      grossIncome,
      taxAmount,
      socialSecurity,
      healthInsurance,
      netIncome,
      effectiveTaxRate: totalDeductions / grossIncome
    };
  };
  
  const calculateTax = (
    amount: string | number,
    options: TaxCalculatorOptions
  ) => {
    try {
      const income = typeof amount === "string" ? parseFloat(amount) : amount;
      
      if (isNaN(income) || income <= 0) {
        toast({
          title: "Neplatná hodnota",
          description: "Zadejte platnou hodnotu příjmu",
          variant: "destructive"
        });
        return null;
      }
      
      let result: TaxResult;
      
      switch (options.country.toLowerCase()) {
        case "de":
        case "germany":
        case "německo":
          result = calculateGermanTax(income, options);
          break;
        case "cz":
        case "czech":
        case "česko":
          result = calculateCzechTax(income, options);
          break;
        default:
          result = calculateGermanTax(income, options); // Default to German tax
      }
      
      setResult(result);
      return result;
    } catch (error) {
      console.error("Error calculating tax:", error);
      toast({
        title: "Chyba výpočtu",
        description: "Došlo k chybě při výpočtu daně",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    calculateTax,
    result
  };
};

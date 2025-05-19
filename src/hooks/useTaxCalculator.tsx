
import { useState } from "react";
import { TaxResult } from "@/components/tax-advisor/tax-optimizer/types";

interface TaxParams {
  country: string;
  taxClass?: string;
  children: number;
  married: boolean;
  church: boolean;
}

export const useTaxCalculator = () => {
  const calculateTax = (grossIncome: number, params: TaxParams): TaxResult | null => {
    if (grossIncome <= 0) return null;

    const { country, taxClass, children, married, church } = params;

    if (country === 'de') {
      // Německý daňový výpočet
      return calculateGermanTax(grossIncome, taxClass, children, married, church);
    } else {
      // Český daňový výpočet
      return calculateCzechTax(grossIncome, children, married);
    }
  };

  const calculateGermanTax = (
    grossIncome: number, 
    taxClass?: string, 
    children: number = 0, 
    married: boolean = false, 
    church: boolean = false
  ): TaxResult => {
    // Zjednodušený výpočet německé daně
    let taxableIncome = grossIncome;
    
    // Odečtení základního odpočtu
    const basicAllowance = 12000; // Základní nezdanitelná částka (2023)
    taxableIncome = Math.max(0, taxableIncome - basicAllowance);
    
    // Odečtení odpočtu na děti
    if (children > 0) {
      const childAllowance = 8978 * children;
      taxableIncome = Math.max(0, taxableIncome - childAllowance);
    }

    // Výpočet daně podle daňových tříd
    let taxRate = 0.25; // Výchozí sazba daně
    
    switch(taxClass) {
      case "1": // Jednotlivci
        taxRate = 0.25;
        break;
      case "2": // Samoživitelé
        taxRate = 0.24;
        break;
      case "3": // Manželé (vyšší příjem)
        taxRate = married ? 0.21 : 0.25;
        break;
      case "4": // Manželé (podobný příjem)
        taxRate = married ? 0.23 : 0.25;
        break;
      case "5": // Manželé (nižší příjem)
        taxRate = married ? 0.28 : 0.25;
        break;
      case "6": // Vedlejší příjem
        taxRate = 0.30;
        break;
      default:
        taxRate = 0.25;
    }
    
    // Výpočet daně z příjmu
    const incomeTax = taxableIncome * taxRate;
    
    // Připočtení církevní daně
    const churchTax = church ? incomeTax * 0.09 : 0;
    
    // Výpočet solidaritního poplatku (5.5% z daně z příjmu, pokud daň > 16956 €)
    const solidarityTax = incomeTax > 16956 ? incomeTax * 0.055 : 0;
    
    // Celková daň
    const totalTax = incomeTax + churchTax + solidarityTax;
    
    // Sociální pojištění (18.6% z hrubé mzdy - zjednodušeno)
    const socialSecurity = grossIncome * 0.186;
    
    // Zdravotní pojištění (14.6% z hrubé mzdy - zjednodušeno)
    const healthInsurance = grossIncome * 0.146;
    
    // Čistý příjem
    const netIncome = grossIncome - totalTax - socialSecurity - healthInsurance;
    
    return {
      grossIncome,
      taxAmount: totalTax,
      socialSecurity,
      healthInsurance,
      netIncome,
      effectiveTaxRate: totalTax / grossIncome
    };
  };

  const calculateCzechTax = (
    grossIncome: number, 
    children: number = 0, 
    married: boolean = false
  ): TaxResult => {
    // Zjednodušený výpočet české daně
    
    // Superhrubá mzda byla zrušena, základem daně je hrubá mzda
    const taxableIncome = grossIncome;
    
    // Daň z příjmu 15%
    let incomeTax = taxableIncome * 0.15;
    
    // Slevy na dani
    const basicTaxCredit = 30840; // Základní sleva na poplatníka (2023)
    incomeTax = Math.max(0, incomeTax - basicTaxCredit);
    
    // Sleva na děti
    if (children > 0) {
      // První dítě: 15 204 Kč, druhé dítě: 22 320 Kč, třetí a další: 27 840 Kč
      let childCredit = 0;
      for (let i = 1; i <= children; i++) {
        if (i === 1) childCredit += 15204;
        else if (i === 2) childCredit += 22320;
        else childCredit += 27840;
      }
      incomeTax = Math.max(0, incomeTax - childCredit);
    }
    
    // Sociální pojištění (6.5% zaměstnanec)
    const socialSecurity = grossIncome * 0.065;
    
    // Zdravotní pojištění (4.5% zaměstnanec)
    const healthInsurance = grossIncome * 0.045;
    
    // Čistý příjem
    const netIncome = grossIncome - incomeTax - socialSecurity - healthInsurance;
    
    return {
      grossIncome,
      taxAmount: incomeTax,
      socialSecurity,
      healthInsurance,
      netIncome,
      effectiveTaxRate: incomeTax / grossIncome
    };
  };

  return { calculateTax };
};

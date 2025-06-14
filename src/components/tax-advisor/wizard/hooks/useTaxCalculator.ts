
import { useState, useCallback } from 'react';
import { TaxWizardData, TaxCalculationResult } from '../types';

export const useTaxCalculator = () => {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const calculateTax = useCallback((data: TaxWizardData): TaxCalculationResult => {
    const { reisepauschale, deductions } = data;
    
    // Reisepauschale výpočet
    let reisepausaleBenefit = 0;
    if (reisepauschale.transportType === 'car') {
      if (reisepauschale.commuteDistance <= 20) {
        reisepausaleBenefit = reisepauschale.commuteDistance * 0.30 * reisepauschale.workDaysPerYear;
      } else {
        reisepausaleBenefit = (20 * 0.30 + (reisepauschale.commuteDistance - 20) * 0.38) * reisepauschale.workDaysPerYear;
      }
    } else {
      reisepausaleBenefit = reisepauschale.commuteDistance * 0.30 * reisepauschale.workDaysPerYear;
    }

    // Druhé bydlení
    const secondHomeBenefit = reisepauschale.hasSecondHome ? reisepauschale.secondHomeCost : 0;

    // Další odpočty
    const workClothesBenefit = deductions.workClothes ? deductions.workClothesCost : 0;
    const educationBenefit = deductions.education ? deductions.educationCost : 0;
    const insuranceBenefit = deductions.insurance ? deductions.insuranceCost : 0;

    // Celkové odpočty
    const totalDeductions = reisepausaleBenefit + secondHomeBenefit + workClothesBenefit + educationBenefit + insuranceBenefit;

    // Odhadovaná úspora (25% průměrná sazba)
    const estimatedTaxSaving = totalDeductions * 0.25;
    const monthlyBenefit = estimatedTaxSaving / 12;

    const calculationResult = {
      reisepausaleBenefit,
      secondHomeBenefit,
      workClothesBenefit,
      educationBenefit,
      insuranceBenefit,
      totalDeductions,
      estimatedTaxSaving,
      monthlyBenefit
    };

    setResult(calculationResult);
    return calculationResult;
  }, []);

  return { result, calculateTax };
};

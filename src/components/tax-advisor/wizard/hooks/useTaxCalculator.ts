
import { useState, useCallback } from 'react';
import { TaxWizardData, TaxCalculationResult } from '../types';

export const useTaxCalculator = () => {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const calculateTax = useCallback((data: TaxWizardData): TaxCalculationResult => {
    const { reisepauschale, deductions } = data;
    
    // Progresivní Reisepauschale výpočet
    let reisepausaleBenefit = 0;
    const distance = reisepauschale.commuteDistance;
    const workDays = reisepauschale.workDaysPerYear;
    
    // Základní sazba pro všechny typy dopravy
    if (distance <= 20) {
      reisepausaleBenefit = distance * 0.30 * workDays;
    } else {
      // Progresivní sazba: 0,30€ do 20km, 0,38€ nad 20km
      reisepausaleBenefit = (20 * 0.30 + (distance - 20) * 0.38) * workDays;
    }

    // Druhé bydlení v Německu - přidává 46 cest ročně (1 týdně)
    let secondHomeBenefit = 0;
    if (reisepauschale.hasSecondHome) {
      // 46 dodatečných cest ročně se stejnou progresivní sazbou
      const additionalTrips = 46;
      if (distance <= 20) {
        secondHomeBenefit = distance * 0.30 * additionalTrips;
      } else {
        secondHomeBenefit = (20 * 0.30 + (distance - 20) * 0.38) * additionalTrips;
      }
      // Plus skutečné náklady na druhé bydlení
      secondHomeBenefit += reisepauschale.secondHomeCost;
    }

    // Základní odpočty
    const workClothesBenefit = deductions.workClothes ? deductions.workClothesCost : 0;
    const educationBenefit = deductions.education ? deductions.educationCost : 0;
    const insuranceBenefit = deductions.insurance ? deductions.insuranceCost : 0;
    
    // Nové odpočty
    const professionalLiteratureBenefit = deductions.professionalLiterature ? deductions.professionalLiteratureCost : 0;
    const toolsBenefit = deductions.tools ? deductions.toolsCost : 0;
    const workingMaterialsBenefit = deductions.workingMaterials ? deductions.workingMaterialsCost : 0;
    const professionalAssociationBenefit = deductions.professionalAssociation ? deductions.professionalAssociationCost : 0;
    const homeOfficeBenefit = deductions.homeOffice ? deductions.homeOfficeCost : 0;

    // Celkové odpočty
    const totalDeductions = reisepausaleBenefit + secondHomeBenefit + workClothesBenefit + 
                           educationBenefit + insuranceBenefit + professionalLiteratureBenefit +
                           toolsBenefit + workingMaterialsBenefit + professionalAssociationBenefit + 
                           homeOfficeBenefit;

    // Odhadovaná úspora (25% průměrná sazba daně v Německu)
    const estimatedTaxSaving = totalDeductions * 0.25;
    const monthlyBenefit = estimatedTaxSaving / 12;

    const calculationResult = {
      reisepausaleBenefit,
      secondHomeBenefit,
      workClothesBenefit,
      educationBenefit,
      insuranceBenefit,
      professionalLiteratureBenefit,
      toolsBenefit,
      workingMaterialsBenefit,
      professionalAssociationBenefit,
      homeOfficeBenefit,
      totalDeductions,
      estimatedTaxSaving,
      monthlyBenefit
    };

    setResult(calculationResult);
    return calculationResult;
  }, []);

  return { result, calculateTax };
};

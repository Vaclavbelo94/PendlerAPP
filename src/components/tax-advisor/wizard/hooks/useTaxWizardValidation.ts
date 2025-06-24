
import { TaxWizardData } from '../types';

export const useTaxWizardValidation = (wizardData: TaxWizardData) => {
  const canCalculate = () => {
    return wizardData.personalInfo.firstName && 
           wizardData.personalInfo.lastName && 
           wizardData.personalInfo.email &&
           wizardData.employmentInfo.employerName && 
           wizardData.employmentInfo.annualIncome > 0 &&
           wizardData.employmentInfo.commuteDistance > 0 &&
           wizardData.reisepauschale.commuteDistance > 0 && 
           wizardData.reisepauschale.workDaysPerYear > 0;
  };

  const canGoNext = (currentStep: number) => {
    switch (currentStep) {
      case 1: // Osobní údaje
        return wizardData.personalInfo.firstName && 
               wizardData.personalInfo.lastName && 
               wizardData.personalInfo.email;
      case 2: // Zaměstnání
        return wizardData.employmentInfo.employerName && 
               wizardData.employmentInfo.annualIncome > 0 &&
               wizardData.employmentInfo.commuteDistance > 0;
      case 3: // Cestovní náhrady
        return wizardData.reisepauschale.commuteDistance > 0 && 
               wizardData.reisepauschale.workDaysPerYear > 0;
      case 4: // Odpočty
        return true; // Odpočty jsou volitelné
      default:
        return false;
    }
  };

  return {
    canCalculate,
    canGoNext
  };
};


import { useState } from 'react';
import { TaxWizardData, PersonalInfo, EmploymentInfo, ReisepauschaleInfo, AdditionalDeductions } from '../types';

export const useTaxWizardData = () => {
  const [wizardData, setWizardData] = useState<TaxWizardData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      address: '',
      taxId: '',
      email: '',
      dateOfBirth: ''
    },
    employmentInfo: {
      employerName: '',
      annualIncome: 0,
      taxClass: '',
      importFromShifts: false,
      workDaysPerYear: 220,
      commuteDistance: 0
    },
    reisepauschale: {
      transportType: 'car',
      hasSecondHome: false,
      secondHomeCost: 1200,
      workDaysPerYear: 220,
      commuteDistance: 0
    },
    deductions: {
      workClothes: false,
      workClothesCost: 400,
      education: false,
      educationCost: 800,
      insurance: false,
      insuranceCost: 300,
      churchTax: false,
      professionalLiterature: false,
      professionalLiteratureCost: 200,
      tools: false,
      toolsCost: 500,
      workingMaterials: false,
      workingMaterialsCost: 300,
      professionalAssociation: false,
      professionalAssociationCost: 150,
      homeOffice: false,
      homeOfficeCost: 1260 // 5€/měsíc × 12 měsíců × 21 pracovních dnů
    }
  });

  const updatePersonalInfo = (data: PersonalInfo) => {
    setWizardData(prev => ({ ...prev, personalInfo: data }));
  };

  const updateEmploymentInfo = (data: EmploymentInfo) => {
    setWizardData(prev => ({ ...prev, employmentInfo: data }));
  };

  const updateReisepauschale = (data: ReisepauschaleInfo) => {
    // Explicitně zajistíme boolean typ pro hasSecondHome
    const sanitizedData: ReisepauschaleInfo = {
      ...data,
      hasSecondHome: Boolean(data.hasSecondHome) === true
    };
    setWizardData(prev => ({ ...prev, reisepauschale: sanitizedData }));
  };

  const updateDeductions = (data: AdditionalDeductions) => {
    // Explicitně zajistíme boolean typy pro všechny deduction fields
    const sanitizedData: AdditionalDeductions = {
      ...data,
      workClothes: Boolean(data.workClothes) === true,
      education: Boolean(data.education) === true,
      insurance: Boolean(data.insurance) === true,
      churchTax: Boolean(data.churchTax) === true,
      professionalLiterature: Boolean(data.professionalLiterature) === true,
      tools: Boolean(data.tools) === true,
      workingMaterials: Boolean(data.workingMaterials) === true,
      professionalAssociation: Boolean(data.professionalAssociation) === true,
      homeOffice: Boolean(data.homeOffice) === true
    };
    setWizardData(prev => ({ ...prev, deductions: sanitizedData }));
  };

  return {
    wizardData,
    updatePersonalInfo,
    updateEmploymentInfo,
    updateReisepauschale,
    updateDeductions
  };
};

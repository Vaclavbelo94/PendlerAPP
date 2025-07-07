
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  address: string;
  taxId: string;
  email: string;
  dateOfBirth: string;
}

export interface EmploymentInfo {
  employerName: string;
  annualIncome: number;
  taxClass: string;
  importFromShifts: boolean;
  workDaysPerYear: number;
  commuteDistance: number;
}

export interface ReisepauschaleInfo {
  transportType: 'car' | 'public';
  hasSecondHome: boolean;
  secondHomeCost: number;
  workDaysPerYear: number;
  commuteDistance: number;
}

export interface AdditionalDeductions {
  workClothes: boolean;
  workClothesCost: number;
  education: boolean;
  educationCost: number;
  insurance: boolean;
  insuranceCost: number;
  churchTax: boolean;
  // Nové odpočty podle německých standardů
  professionalLiterature: boolean;
  professionalLiteratureCost: number;
  tools: boolean;
  toolsCost: number;
  workingMaterials: boolean;
  workingMaterialsCost: number;
  professionalAssociation: boolean;
  professionalAssociationCost: number;
  homeOffice: boolean;
  homeOfficeCost: number;
}

export interface TaxWizardData {
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  reisepauschale: ReisepauschaleInfo;
  deductions: AdditionalDeductions;
}

export interface TaxCalculationResult {
  reisepausaleBenefit: number;
  secondHomeBenefit: number;
  workClothesBenefit: number;
  educationBenefit: number;
  insuranceBenefit: number;
  professionalLiteratureBenefit: number;
  toolsBenefit: number;
  workingMaterialsBenefit: number;
  professionalAssociationBenefit: number;
  homeOfficeBenefit: number;
  totalDeductions: number;
  estimatedTaxSaving: number;
  monthlyBenefit: number;
}


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
  totalDeductions: number;
  estimatedTaxSaving: number;
  monthlyBenefit: number;
}

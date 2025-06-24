
export interface PdfData {
  personalData: {
    fullName: string;
    taxId: string;
    address: string;
    dateOfBirth: string;
    email: string;
  };
  employmentData: {
    employer: string;
    annualIncome: number;
  };
  deductibleItems: {
    commuteExpenses: {
      distance: number;
      days: number;
      total: number;
    };
    secondHomeExpenses?: number;
    workClothesExpenses?: number;
    educationExpenses?: number;
    insuranceExpenses?: number;
  };
  taxSavings: {
    totalDeductions: number;
    estimatedSaving: number;
  };
  additionalNotes?: string;
}

export type SupportedLanguage = 'cz' | 'de' | 'pl';

export interface TranslationKeys {
  title: string;
  sections: {
    personalData: string;
    employmentData: string;
    deductibleItems: string;
    taxSavings: string;
    additionalNotes: string;
  };
  fields: {
    fullName: string;
    taxId: string;
    address: string;
    dateOfBirth: string;
    email: string;
    employer: string;
    annualIncome: string;
    commuteExpenses: string;
    secondHomeExpenses: string;
    workClothesExpenses: string;
    educationExpenses: string;
    insuranceExpenses: string;
  };
  calculations: {
    commuteFormula: string;
    savingsNote: string;
  };
  footer: {
    generatedBy: string;
    contact: string;
    date: string;
  };
}

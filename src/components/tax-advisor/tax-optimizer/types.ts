
export interface FormData {
  country: string;
  income: string;
  taxClass?: string;
  children: string;
  married: boolean;
  church: boolean;
  commuteDistance?: string;
  workDays?: string;
  housingCosts?: string;
  workEquipment?: string;
  insurance?: string;
  otherExpenses?: string;
  [key: string]: string | boolean | undefined;
}

export interface TaxResult {
  grossIncome: number;
  taxAmount: number;
  socialSecurity: number;
  healthInsurance: number;
  netIncome: number;
  effectiveTaxRate: number;
}

export interface TaxCalculatorFormProps {
  onCalculate: (data: FormData) => void;
  onCountryChange: (country: string) => void;
  displayCurrency: string;
}

export interface ResultsDisplayProps {
  currentResult: TaxResult;
  optimizedResult: TaxResult | null;
  savings: number | null;
  displayCurrency: string;
}

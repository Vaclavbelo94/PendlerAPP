
export interface DocumentData {
  documentType: string;
  yearOfTax: string;
  name: string;
  taxId: string;
  address: string;
  dateOfBirth?: string;
  email: string;
  employerName?: string;
  incomeAmount?: string;
  commuteDistance?: string;
  commuteWorkDays?: string;
  includeCommuteExpenses: boolean;
  includeSecondHome: boolean;
  includeWorkClothes: boolean;
  additionalNotes?: string;
}

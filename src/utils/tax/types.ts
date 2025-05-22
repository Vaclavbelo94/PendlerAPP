
export interface DocumentData {
  name: string;
  taxId: string;
  address: string;
  documentType: string;
  dateOfBirth?: string;
  yearOfTax: string;
  email: string;
  employerName?: string;
  incomeAmount?: string;
  includeCommuteExpenses: boolean;
  commuteDistance?: string;
  commuteWorkDays?: string;
  includeSecondHome: boolean;
  includeWorkClothes: boolean;
  additionalNotes?: string;
}

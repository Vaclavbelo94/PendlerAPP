
import { TaxWizardData, TaxCalculationResult } from '../types';
import { generateModernTaxDocument } from '@/utils/pdf/modern/ModernTaxPDFGenerator';

export const exportTaxWizardPDF = async (
  wizardData: TaxWizardData,
  result: TaxCalculationResult,
  t: (key: string) => string
) => {
  // Převod wizard dat na DocumentData formát s explicitní boolean konverzí
  const documentData = {
    documentType: 'tax-wizard' as const,
    yearOfTax: new Date().getFullYear().toString(),
    name: `${wizardData.personalInfo.firstName} ${wizardData.personalInfo.lastName}`,
    taxId: wizardData.personalInfo.taxId,
    address: wizardData.personalInfo.address,
    dateOfBirth: wizardData.personalInfo.dateOfBirth,
    email: wizardData.personalInfo.email,
    employerName: wizardData.employmentInfo.employerName,
    incomeAmount: wizardData.employmentInfo.annualIncome.toString(),
    commuteDistance: wizardData.reisepauschale.commuteDistance.toString(),
    commuteWorkDays: wizardData.reisepauschale.workDaysPerYear.toString(),
    includeCommuteExpenses: true,
    includeSecondHome: Boolean(wizardData.reisepauschale.hasSecondHome) === true,
    includeWorkClothes: Boolean(wizardData.deductions.workClothes) === true,
    additionalNotes: `${t('results.generatedWith')} PendlerApp Wizard. ${t('results.totalDeductions')}: ${result.totalDeductions.toFixed(2)}€, ${t('results.estimatedSaving')}: ${result.estimatedTaxSaving.toFixed(2)}€`
  };

  const blob = await generateModernTaxDocument(documentData);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PendlerApp_${t('results.taxWizard')}_${wizardData.personalInfo.lastName}_${new Date().getFullYear()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

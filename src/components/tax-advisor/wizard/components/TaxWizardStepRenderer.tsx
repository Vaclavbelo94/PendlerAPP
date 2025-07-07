
import React from 'react';
import { TaxWizardData, TaxCalculationResult } from '../types';
import PersonalInfoStep from '../steps/PersonalInfoStep';
import EmploymentStep from '../steps/EmploymentStep';
import ReisepauschaleStep from '../steps/ReisepauschaleStep';
import DeductionsStep from '../steps/DeductionsStep';
import ResultsStep from '../steps/ResultsStep';
import { useTranslation } from 'react-i18next';

interface TaxWizardStepRendererProps {
  currentStep: number;
  wizardData: TaxWizardData;
  result: TaxCalculationResult | null;
  onPersonalInfoChange: (data: any) => void;
  onEmploymentChange: (data: any) => void;
  onReisepauschaleChange: (data: any) => void;
  onDeductionsChange: (data: any) => void;
  onExportPDF: () => void;
  onExportXML?: () => void;
  onDownloadGuide?: () => void;
}

const TaxWizardStepRenderer: React.FC<TaxWizardStepRendererProps> = ({
  currentStep,
  wizardData,
  result,
  onPersonalInfoChange,
  onEmploymentChange,
  onReisepauschaleChange,
  onDeductionsChange,
  onExportPDF,
  onExportXML,
  onDownloadGuide
}) => {
  const { t } = useTranslation('common');

  switch (currentStep) {
    case 1:
      return (
        <PersonalInfoStep
          data={wizardData.personalInfo}
          onChange={onPersonalInfoChange}
        />
      );
    case 2:
      return (
        <EmploymentStep
          data={wizardData.employmentInfo}
          onChange={onEmploymentChange}
        />
      );
    case 3:
      return (
        <ReisepauschaleStep
          data={wizardData.reisepauschale}
          employmentData={wizardData.employmentInfo}
          onChange={onReisepauschaleChange}
        />
      );
    case 4:
      return (
        <DeductionsStep
          data={wizardData.deductions}
          onChange={onDeductionsChange}
        />
      );
    case 5:
      return result ? (
        <ResultsStep
          data={wizardData}
          result={result}
          onExportPDF={onExportPDF}
          onExportXML={onExportXML}
          onDownloadGuide={onDownloadGuide}
        />
      ) : (
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default TaxWizardStepRenderer;

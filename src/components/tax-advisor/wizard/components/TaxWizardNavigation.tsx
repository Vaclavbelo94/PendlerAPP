
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxCalculationResult } from '../types';

interface TaxWizardNavigationProps {
  currentStep: number;
  canGoNext: boolean;
  result: TaxCalculationResult | null;
  onPrevious: () => void;
  onNext: () => void;
  onExportPDF: () => void;
  isMobile?: boolean;
}

const TaxWizardNavigation: React.FC<TaxWizardNavigationProps> = ({
  currentStep,
  canGoNext,
  result,
  onPrevious,
  onNext,
  onExportPDF,
  isMobile = false
}) => {
  const { t } = useTranslation(['taxAdvisor', 'common']);

  if (isMobile) {
    return null; // Navigation is handled by mobile progress component
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('common:back')}
      </Button>

      {currentStep < 5 ? (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          {t('common:next')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onExportPDF}
          disabled={!result}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('wizard.results.exportPdf')}
        </Button>
      )}
    </div>
  );
};

export default TaxWizardNavigation;

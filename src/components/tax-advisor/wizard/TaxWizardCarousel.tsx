
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTaxCalculator } from './hooks/useTaxCalculator';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

// Import hooks
import { useTaxWizardData } from './hooks/useTaxWizardData';
import { useTaxWizardNavigation } from './hooks/useTaxWizardNavigation';
import { useTaxWizardValidation } from './hooks/useTaxWizardValidation';

// Import components
import TaxWizardStepRenderer from './components/TaxWizardStepRenderer';
import TaxWizardNavigation from './components/TaxWizardNavigation';
import TaxWizardProgress from './TaxWizardProgress';
import TaxWizardMobileProgress from './TaxWizardMobileProgress';

// Import services
import { exportTaxWizardPDF } from './services/taxWizardPDFService';
import { useElsterIntegration } from './hooks/useElsterIntegration';

const TaxWizardCarousel: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation(['taxAdvisor', 'common']);
  const { result, calculateTax } = useTaxCalculator();
  const isMobile = useIsMobile();
  const { 
    exportToElsterXML, 
    downloadElsterGuide, 
    downloadDocumentChecklist 
  } = useElsterIntegration();
  
  // Custom hooks
  const {
    wizardData,
    updatePersonalInfo,
    updateEmploymentInfo,
    updateReisepauschale,
    updateDeductions
  } = useTaxWizardData();

  const {
    currentStep,
    setCurrentStep,
    steps,
    handleNext,
    handlePrevious
  } = useTaxWizardNavigation();

  const { canCalculate, canGoNext } = useTaxWizardValidation(wizardData);

  const stepLabels = [
    t('wizard.steps.personal'),
    t('wizard.steps.employment'),
    t('wizard.steps.reisepauschale'),
    t('wizard.steps.deductions'),
    t('wizard.steps.results')
  ];

  const { containerRef } = useSwipeNavigation({
    items: steps,
    currentItem: steps[currentStep - 1],
    onItemChange: (step) => {
      const stepIndex = steps.indexOf(step) + 1;
      setCurrentStep(stepIndex);
    },
    enabled: true
  });

  // Automaticky spustí výpočet když jsou všechna data kompletní
  useEffect(() => {
    if (canCalculate()) {
      calculateTax(wizardData);
    }
  }, [wizardData, calculateTax, canCalculate]);

  const handleExportPDF = async () => {
    if (!result) {
      toast({
        title: t('wizard.results.error'),
        description: t('wizard.results.completeCalculationFirst'),
        variant: "destructive",
      });
      return;
    }

    try {
      await exportTaxWizardPDF(wizardData, result, t);
      
      toast({
        title: t('wizard.results.exportSuccess'),
        description: t('wizard.results.documentDownloaded'),
      });
    } catch (error) {
      console.error('Chyba při exportu PDF:', error);
      toast({
        title: t('wizard.results.exportError'),
        description: t('wizard.results.failedToGenerate'),
        variant: "destructive",
      });
    }
  };

  const handleExportXML = async () => {
    if (!result) {
      toast({
        title: t('wizard.results.error'),
        description: t('wizard.results.completeCalculationFirst'),
        variant: "destructive",
      });
      return;
    }

    try {
      await exportToElsterXML(wizardData, result);
      
      toast({
        title: t('wizard.results.exportSuccess'),
        description: t('wizard.results.xmlExportSuccess'),
      });
    } catch (error) {
      console.error('Chyba při exportu XML:', error);
      toast({
        title: t('wizard.results.exportError'),
        description: error instanceof Error ? error.message : t('wizard.results.xmlExportError'),
        variant: "destructive",
      });
    }
  };

  const handleDownloadGuide = async () => {
    try {
      await downloadElsterGuide();
      
      toast({
        title: t('wizard.results.exportSuccess'),
        description: t('wizard.results.guideDownloaded'),
      });
    } catch (error) {
      console.error('Chyba při stahování průvodce:', error);
      toast({
        title: t('wizard.results.exportError'),
        description: t('wizard.results.guideDownloadError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={containerRef}>
      {/* Desktop Progress */}
      <TaxWizardProgress
        currentStep={currentStep}
        totalSteps={5}
        stepLabels={stepLabels}
      />

      {/* Mobile Progress */}
      {isMobile && (
        <TaxWizardMobileProgress
          currentStep={currentStep}
          totalSteps={5}
          stepLabels={stepLabels}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={Boolean(canGoNext(currentStep))}
        />
      )}

      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <TaxWizardStepRenderer
              currentStep={currentStep}
              wizardData={wizardData}
              result={result}
              onPersonalInfoChange={updatePersonalInfo}
              onEmploymentChange={updateEmploymentInfo}
              onReisepauschaleChange={updateReisepauschale}
              onDeductionsChange={updateDeductions}
              onExportPDF={handleExportPDF}
              onExportXML={handleExportXML}
              onDownloadGuide={handleDownloadGuide}
              onLoadData={(newData) => {
                // Implementace načtení dat bude doplněna později
                console.log('Loading data:', newData);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <TaxWizardNavigation
        currentStep={currentStep}
        canGoNext={Boolean(canGoNext(currentStep))}
        result={result}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onExportPDF={handleExportPDF}
        isMobile={isMobile}
      />
    </div>
  );
};

export default TaxWizardCarousel;

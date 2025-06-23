
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTaxCalculator } from './hooks/useTaxCalculator';
import { TaxWizardData, PersonalInfo, EmploymentInfo, ReisepauschaleInfo, AdditionalDeductions } from './types';
import { generateModernTaxDocument } from '@/utils/pdf/modern/ModernTaxPDFGenerator';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

// Import kroků
import PersonalInfoStep from './steps/PersonalInfoStep';
import EmploymentStep from './steps/EmploymentStep';
import ReisepauschaleStep from './steps/ReisepauschaleStep';
import DeductionsStep from './steps/DeductionsStep';
import ResultsStep from './steps/ResultsStep';
import TaxWizardProgress from './TaxWizardProgress';

const TaxWizardCarousel: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation('taxAdvisor');
  const { result, calculateTax } = useTaxCalculator();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<TaxWizardData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      address: '',
      taxId: '',
      email: '',
      dateOfBirth: ''
    },
    employmentInfo: {
      employerName: '',
      annualIncome: 0,
      taxClass: '',
      importFromShifts: false,
      workDaysPerYear: 220,
      commuteDistance: 0
    },
    reisepauschale: {
      transportType: 'car',
      hasSecondHome: false,
      secondHomeCost: 1200,
      workDaysPerYear: 220,
      commuteDistance: 0
    },
    deductions: {
      workClothes: false,
      workClothesCost: 400,
      education: false,
      educationCost: 800,
      insurance: false,
      insuranceCost: 300,
      churchTax: false
    }
  });

  const steps = ['personal', 'employment', 'reisepauschale', 'deductions', 'results'];
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

  const updatePersonalInfo = (data: PersonalInfo) => {
    setWizardData(prev => ({ ...prev, personalInfo: data }));
  };

  const updateEmploymentInfo = (data: EmploymentInfo) => {
    setWizardData(prev => ({ ...prev, employmentInfo: data }));
  };

  const updateReisepauschale = (data: ReisepauschaleInfo) => {
    setWizardData(prev => ({ ...prev, reisepauschale: data }));
  };

  const updateDeductions = (data: AdditionalDeductions) => {
    setWizardData(prev => ({ ...prev, deductions: data }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
    
    // Výpočet při přechodu na výsledky
    if (currentStep === 4) {
      calculateTax(wizardData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1: // Osobní údaje
        return wizardData.personalInfo.firstName && 
               wizardData.personalInfo.lastName && 
               wizardData.personalInfo.email;
      case 2: // Zaměstnání
        return wizardData.employmentInfo.employerName && 
               wizardData.employmentInfo.annualIncome > 0 &&
               wizardData.employmentInfo.commuteDistance > 0;
      case 3: // Cestovní náhrady
        return wizardData.reisepauschale.commuteDistance > 0 && 
               wizardData.reisepauschale.workDaysPerYear > 0;
      case 4: // Odpočty
        return true; // Odpočty jsou volitelné
      default:
        return false;
    }
  };

  const handleExportPDF = async () => {
    if (!result) {
      toast({
        title: t('results.error'),
        description: t('results.completeCalculationFirst'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Převod wizard dat na DocumentData formát
      const documentData = {
        documentType: 'tax-wizard',
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
        includeSecondHome: wizardData.reisepauschale.hasSecondHome,
        includeWorkClothes: wizardData.deductions.workClothes,
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

      toast({
        title: t('results.exportSuccess'),
        description: t('results.documentDownloaded'),
      });
    } catch (error) {
      console.error('Chyba při exportu PDF:', error);
      toast({
        title: t('results.exportError'),
        description: t('results.failedToGenerate'),
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={wizardData.personalInfo}
            onChange={updatePersonalInfo}
          />
        );
      case 2:
        return (
          <EmploymentStep
            data={wizardData.employmentInfo}
            onChange={updateEmploymentInfo}
          />
        );
      case 3:
        return (
          <ReisepauschaleStep
            data={wizardData.reisepauschale}
            employmentData={wizardData.employmentInfo}
            onChange={updateReisepauschale}
          />
        );
      case 4:
        return (
          <DeductionsStep
            data={wizardData.deductions}
            onChange={updateDeductions}
          />
        );
      case 5:
        return result ? (
          <ResultsStep
            data={wizardData}
            result={result}
            onExportPDF={handleExportPDF}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto" ref={containerRef}>
      <TaxWizardProgress
        currentStep={currentStep}
        totalSteps={5}
        stepLabels={stepLabels}
      />

      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common:back')}
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2"
          >
            {t('common:next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleExportPDF}
            disabled={!result}
            className="flex items-center gap-2"
          >
            {t('wizard.results.exportPdf')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaxWizardCarousel;

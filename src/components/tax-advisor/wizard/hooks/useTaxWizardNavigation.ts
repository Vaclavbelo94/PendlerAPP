
import { useState } from 'react';

export const useTaxWizardNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = ['personal', 'employment', 'reisepauschale', 'deductions', 'results'];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    steps,
    handleNext,
    handlePrevious
  };
};

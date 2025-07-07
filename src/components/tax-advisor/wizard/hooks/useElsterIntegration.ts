import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../types';
import { 
  generateElsterXML, 
  downloadElsterXML, 
  validateElsterData 
} from '../elster/services/elsterXmlService';
import { 
  generateElsterPDFGuide, 
  generateDocumentChecklistPDF 
} from '../elster/services/elsterPdfGuideService';

export const useElsterIntegration = () => {
  const { t, i18n } = useTranslation(['taxAdvisor']);

  const exportToElsterXML = useCallback(async (
    data: TaxWizardData, 
    result: TaxCalculationResult
  ) => {
    // Validace dat před exportem
    const validationErrors = validateElsterData(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Vytvoření XML souboru
    const elsterData = {
      personalInfo: data.personalInfo,
      employmentInfo: data.employmentInfo,
      reisepauschale: data.reisepauschale,
      deductions: data.deductions,
      calculations: result
    };

    downloadElsterXML(elsterData);
  }, []);

  const downloadElsterGuide = useCallback(async () => {
    await generateElsterPDFGuide(t, i18n.language);
  }, [t, i18n.language]);

  const downloadDocumentChecklist = useCallback(async () => {
    await generateDocumentChecklistPDF(t, i18n.language);
  }, [t, i18n.language]);

  const openElsterPortal = useCallback(() => {
    window.open('https://www.elster.de', '_blank');
  }, []);

  return {
    exportToElsterXML,
    downloadElsterGuide,
    downloadDocumentChecklist,
    openElsterPortal,
    validateElsterData
  };
};
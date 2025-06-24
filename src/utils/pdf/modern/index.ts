// Export the new multilingual tax PDF generator
export { generatePdf, downloadPdf } from './MultilingualTaxPDFGenerator';
export type { PdfData, SupportedLanguage, TranslationKeys } from './types';

// Keep existing exports for backward compatibility
export { ModernPDFTemplate, MODERN_COLORS } from './ModernPDFTemplate';
export { 
  ModernSection, 
  ModernTable, 
  ModernInfoBox, 
  ModernStatsGrid 
} from './ModernPDFComponents';

export { generateModernTaxDocument, downloadModernTaxDocument } from './ModernTaxPDFGenerator';
export { generateModernShiftsDocument, downloadModernShiftsDocument } from './ModernShiftsPDFGenerator';
export { generateModernCommuteDocument, downloadModernCommuteDocument } from './ModernCommutePDFGenerator';

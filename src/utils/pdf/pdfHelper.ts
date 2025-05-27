
import { jsPDF } from 'jspdf';
import { DHL_COLORS } from '@/lib/design-system';
import { 
  initializeEnhancedPDF, 
  addEnhancedDocumentHeader, 
  addEnhancedDocumentFooter 
} from './enhancedPdfHelper';

// Aktualizovaný hlavní helper - nyní používá vylepšené funkce
export const initializePDF = (): jsPDF => {
  return initializeEnhancedPDF();
};

export const addDocumentHeader = (doc: jsPDF, title: string, subtitle?: string): void => {
  addEnhancedDocumentHeader(doc, title, subtitle);
};

export const addDocumentFooter = (doc: jsPDF): void => {
  addEnhancedDocumentFooter(doc);
};

// Zachování zpětné kompatibility pro existující kod
const drawLogo = (doc: jsPDF, x: number, y: number, size: number): void => {
  try {
    doc.addImage('/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png', 'PNG', x, y - size/2, size, size);
  } catch (error) {
    // Fallback na původní vykreslování
    doc.setFillColor(255, 102, 0); // Orange
    doc.roundedRect(x, y - size/2, size, size, 2, 2, 'F');
    
    // Text loga
    doc.setFontSize(size * 0.6);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("PA", x + size / 2, y + size * 0.2, { align: "center" });
  }
};

export { drawLogo };


import { jsPDF } from 'jspdf';
import { DHL_COLORS } from '@/lib/design-system';
import { 
  initializeProfessionalPDF, 
  addProfessionalHeader, 
  addProfessionalFooter 
} from './professionalPdfHelper';

// Hlavní helper používá nový profesionální systém
export const initializePDF = (): jsPDF => {
  return initializeProfessionalPDF();
};

export const addDocumentHeader = (doc: jsPDF, title: string, subtitle?: string): void => {
  addProfessionalHeader(doc, title, subtitle);
};

export const addDocumentFooter = (doc: jsPDF): void => {
  addProfessionalFooter(doc);
};

// Zachování zpětné kompatibility pro existující kod
const drawLogo = (doc: jsPDF, x: number, y: number, size: number): void => {
  try {
    doc.addImage('/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png', 'PNG', x, y - size/2, size, size);
  } catch (error) {
    // Professional fallback logo
    doc.setFillColor(37, 99, 235); // Modern blue
    doc.roundedRect(x, y - size/2, size, size, 3, 3, 'F');
    
    doc.setFontSize(size * 0.6);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("PA", x + size / 2, y + size * 0.2, { align: "center" });
  }
};

export { drawLogo };

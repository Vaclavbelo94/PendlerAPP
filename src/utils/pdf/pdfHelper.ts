
import { jsPDF } from 'jspdf';
import { DHL_COLORS } from '@/lib/design-system';

// Přidání potřebné fonty pro českou diakritiku
// Poznámka: jsPDF vyžaduje specifické nastavení fontů pro jazyky s diakritikou
export const initializePDF = (): jsPDF => {
  // Vytvoření nového PDF dokumentu s podporou pro UTF-8
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });
  
  // Zajištění podpory pro české znaky
  doc.setLanguage("cs-CZ");
  
  return doc;
};

// Funkce pro přidání standardní hlavičky do dokumentu
export const addDocumentHeader = (doc: jsPDF, title: string): void => {
  // Nastavení okrajů
  const marginLeft = 14;
  const headerHeight = 25;
  
  // Přidání barevné hlavičky
  doc.setFillColor(DHL_COLORS.yellow);
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');
  
  // Přidání loga PendlerHelfer
  drawLogo(doc, marginLeft, 10, 14);
  
  // Přidání názvu aplikace
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PendlerHelfer", marginLeft + 20, 12);
  
  // Přidání podtitulku aplikace
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Pro české pendlery", marginLeft + 20, 17);
  
  // Přidání názvu dokumentu
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, doc.internal.pageSize.width / 2, headerHeight + 10, { align: "center" });
  
  // Přidání aktuálního data
  const currentDate = new Date().toLocaleDateString('cs-CZ');
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Vygenerováno: ${currentDate}`, doc.internal.pageSize.width - marginLeft, 10, { align: "right" });
  
  // Přidání URL webu
  doc.setFontSize(8);
  doc.text("www.pendlerhelfer.cz", doc.internal.pageSize.width - marginLeft, 15, { align: "right" });
  
  // Přidání oddělovací čáry
  doc.setDrawColor(DHL_COLORS.red);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, headerHeight + 20, doc.internal.pageSize.width - marginLeft, headerHeight + 20);
};

// Funkce pro přidání standardní patičky do dokumentu
export const addDocumentFooter = (doc: jsPDF): void => {
  const marginLeft = 14;
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(DHL_COLORS.red);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - marginLeft, doc.internal.pageSize.height - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Strana ${i} z ${pageCount} | PendlerHelfer © ${new Date().getFullYear()}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};

// Funkce pro vykreslení loga
const drawLogo = (doc: jsPDF, x: number, y: number, size: number): void => {
  // Vykreslení PH loga
  doc.setFillColor(DHL_COLORS.yellow);
  doc.roundedRect(x, y - size/2, size, size, 2, 2, 'F');
  
  // Přidání efektu gradientu
  doc.setFillColor(255, 255, 255, 20);
  doc.roundedRect(x, y - size/2, size, size / 2, 2, 0, 'F');
  
  // Text loga
  doc.setFontSize(size * 0.6);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("PH", x + size / 2, y + size * 0.2, { align: "center" });
  
  // Červená čára pod logem
  doc.setDrawColor(DHL_COLORS.red);
  doc.setLineWidth(size * 0.1);
  doc.line(x, y + size / 2.2, x + size, y + size / 2.2);
};


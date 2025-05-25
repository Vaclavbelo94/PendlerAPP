
import { jsPDF } from 'jspdf';
import { DHL_COLORS } from '@/lib/design-system';

// Přidání potřebné fonty pro českou diakritiku
export const initializePDF = (): jsPDF => {
  // Vytvoření nového PDF dokumentu s podporou pro UTF-8
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  // Načtení standardní fonty Helvetica, která lépe podporuje diakritiku
  doc.setFont("helvetica");

  // Kódování UTF-8 pro podporu diakritiky
  const utf8Text = (txt: string) => {
    try {
      return decodeURIComponent(encodeURIComponent(txt));
    } catch (e) {
      return txt; // Fallback na původní text v případě problému
    }
  };

  // Přepsání metody text pro správné zobrazení diakritiky
  const originalText = doc.text;
  doc.text = function(text: string | string[], x: number | number[], y?: number, options?: any): jsPDF {
    let processedText = typeof text === 'string' ? utf8Text(text) : text.map(t => utf8Text(t));
    return originalText.call(this, processedText, x, y, options);
  };
  
  return doc;
};

// Funkce pro přidání standardní hlavičky do dokumentu
export const addDocumentHeader = (doc: jsPDF, title: string): void => {
  // Nastavení okrajů
  const marginLeft = 14;
  const headerHeight = 25;
  
  // Přidání barevné hlavičky
  doc.setFillColor(255, 255, 255); // White background
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');
  
  // Přidání loga PendlerApp jako obrázku
  try {
    // Logo bude umístěno vlevo v hlavičce
    const logoWidth = 15;
    const logoHeight = 15;
    doc.addImage('/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png', 'PNG', marginLeft, 5, logoWidth, logoHeight);
  } catch (error) {
    console.log('Logo image not found, using fallback text');
    // Fallback na textové logo
    doc.setTextColor(255, 102, 0); // Orange color
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PendlerApp", marginLeft, 12);
  }
  
  // Přidání názvu aplikace vedle loga
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PendlerApp", marginLeft + 20, 12);
  
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
  doc.text("www.pendlerapp.cz", doc.internal.pageSize.width - marginLeft, 15, { align: "right" });
  
  // Přidání oddělovací čáry
  doc.setDrawColor(255, 102, 0); // Orange line
  doc.setLineWidth(0.5);
  doc.line(marginLeft, headerHeight + 20, doc.internal.pageSize.width - marginLeft, headerHeight + 20);
};

// Funkce pro přidání standardní patičky do dokumentu
export const addDocumentFooter = (doc: jsPDF): void => {
  const marginLeft = 14;
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(255, 102, 0); // Orange line
    doc.setLineWidth(0.5);
    doc.line(marginLeft, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - marginLeft, doc.internal.pageSize.height - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Strana ${i} z ${pageCount} | PendlerApp © ${new Date().getFullYear()}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};

// Funkce pro vykreslení loga - kept for backward compatibility but now uses image
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

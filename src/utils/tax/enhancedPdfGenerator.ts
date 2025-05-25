
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DocumentData } from './types';
import { getDocumentTitle } from './documentUtils';

// Opravené barvy místo DHL
const BRAND_COLORS = {
  primary: '#2563eb', // Blue
  secondary: '#64748b', // Slate gray
  accent: '#f59e0b', // Amber
  success: '#10b981', // Emerald
};

export const generateEnhancedTaxDocument = (data: DocumentData): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  // Nastavení fontu pro podporu diakritiky
  doc.setFont("helvetica");

  // Přidání hlavičky dokumentu
  addEnhancedDocumentHeader(doc, getDocumentTitle(data.documentType));
  
  // Přidání informace o zdaňovacím období
  doc.setFontSize(12);
  doc.text(`Zdaňovací období: ${data.yearOfTax}`, 14, 50);
  
  // Personal details section
  doc.setFontSize(14);
  doc.text('Osobní údaje', 14, 65);
  
  doc.setFontSize(11);
  autoTable(doc, {
    startY: 70,
    head: [['Položka', 'Hodnota']],
    body: [
      ['Jméno a příjmení', data.name],
      ['Daňové identifikační číslo', data.taxId],
      ['Adresa trvalého bydliště', data.address],
      ['Datum narození', data.dateOfBirth || 'Neuvedeno'],
      ['Email', data.email],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [37, 99, 235], // Primary blue
      textColor: [255, 255, 255]
    },
    styles: {
      font: 'helvetica',
      fontStyle: 'normal'
    }
  });
  
  // Employment details section if applicable
  if (data.employerName || data.incomeAmount) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.text('Údaje o zaměstnání', 14, finalY);
    
    doc.setFontSize(11);
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Položka', 'Hodnota']],
      body: [
        ['Zaměstnavatel', data.employerName || 'Neuvedeno'],
        ['Roční příjem (€)', data.incomeAmount || 'Neuvedeno'],
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255]
      },
      styles: {
        font: 'helvetica',
        fontStyle: 'normal'
      }
    });
  }
  
  // Deduction items section
  const deductionsY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.text('Odpočitatelné položky', 14, deductionsY);
  
  const deductions = [];
  
  if (data.includeCommuteExpenses) {
    const commuteCostPerKm = 0.30;
    const totalCommuteDays = parseInt(data.commuteWorkDays || '220');
    const commuteDistance = parseInt(data.commuteDistance || '0');
    const totalCommuteCost = commuteCostPerKm * commuteDistance * totalCommuteDays;
    
    deductions.push(['Náklady na dojíždění', `${commuteDistance} km × ${totalCommuteDays} dní = ${totalCommuteCost.toFixed(2)} €`]);
  }
  
  if (data.includeSecondHome) {
    deductions.push(['Druhé bydlení v Německu', 'Zahrnuto']);
  }
  
  if (data.includeWorkClothes) {
    deductions.push(['Pracovní oděvy a pomůcky', 'Zahrnuto']);
  }
  
  if (deductions.length > 0) {
    autoTable(doc, {
      startY: deductionsY + 5,
      head: [['Položka', 'Údaje']],
      body: deductions,
      theme: 'grid',
      headStyles: { 
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255]
      },
      styles: {
        font: 'helvetica',
        fontStyle: 'normal'
      }
    });
  }
  
  // Additional notes section
  if (data.additionalNotes) {
    const notesY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.text('Doplňující poznámky', 14, notesY);
    
    doc.setFontSize(11);
    autoTable(doc, {
      startY: notesY + 5,
      head: [['Poznámky']],
      body: [[data.additionalNotes]],
      theme: 'grid',
      headStyles: { 
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255]
      },
      styles: {
        font: 'helvetica',
        fontStyle: 'normal'
      }
    });
  }
  
  // Add signature area
  const signatureY = (doc as any).lastAutoTable.finalY + 40;
  
  doc.line(20, signatureY, 90, signatureY);
  doc.line(120, signatureY, 190, signatureY);
  
  doc.setFontSize(10);
  doc.text('Podpis daňového poplatníka', 55, signatureY + 5, { align: 'center' });
  doc.text('Podpis finančního úředníka', 155, signatureY + 5, { align: 'center' });
  
  // Přidání vylepšené patičky
  addEnhancedDocumentFooter(doc);
  
  return doc;
};

// Vylepšená hlavička dokumentu
const addEnhancedDocumentHeader = (doc: jsPDF, title: string): void => {
  const marginLeft = 14;
  const headerHeight = 25;
  
  // Přidání barevné hlavičky
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');
  
  // Přidání názvu aplikace
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PendlerHelfer", marginLeft, 12);
  
  // Přidání podtitulku aplikace
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Daňový asistent pro pendlery", marginLeft, 17);
  
  // Přidání názvu dokumentu
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, doc.internal.pageSize.width / 2, headerHeight + 10, { align: "center" });
  
  // Přidání aktuálního data
  const currentDate = new Date().toLocaleDateString('cs-CZ');
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text(`Vygenerováno: ${currentDate}`, doc.internal.pageSize.width - marginLeft, 10, { align: "right" });
  
  // Přidání URL webu
  doc.setFontSize(8);
  doc.text("www.pendlerhelfer.cz", doc.internal.pageSize.width - marginLeft, 15, { align: "right" });
  
  // Přidání oddělovací čáry
  doc.setDrawColor(245, 158, 11); // Accent amber
  doc.setLineWidth(0.5);
  doc.line(marginLeft, headerHeight + 20, doc.internal.pageSize.width - marginLeft, headerHeight + 20);
};

// Vylepšená patička dokumentu
const addEnhancedDocumentFooter = (doc: jsPDF): void => {
  const marginLeft = 14;
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(245, 158, 11); // Accent amber
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

// Pomocná funkce pro stažení vylepšeného PDF dokumentu
export const downloadEnhancedTaxDocument = (data: DocumentData): void => {
  const doc = generateEnhancedTaxDocument(data);
  const filename = `${getDocumentTitle(data.documentType).replace(/\s+/g, '_').toLowerCase()}_${new Date().getFullYear()}.pdf`;
  doc.save(filename);
};


import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DocumentData } from './types';
import { getDocumentTitle } from './documentUtils';
import { initializePDF, addDocumentHeader, addDocumentFooter } from '../pdf/pdfHelper';

export const generateTaxDocument = (data: DocumentData): jsPDF => {
  // Použijeme náš inicializátor pro PDF s českou diakritikou
  const doc = initializePDF();
  
  // Přidáme hlavičku dokumentu
  const documentTitle = getDocumentTitle(data.documentType);
  addDocumentHeader(doc, documentTitle);
  
  // Přidáme informaci o zdaňovacím období
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
    headStyles: { fillColor: [60, 60, 60] },
    // Nastavení pro správné zobrazení diakritiky v tabulkách
    styles: {
      font: 'helvetica',
      fontStyle: 'normal'
    },
    didDrawCell: (data) => {
      // Zde můžeme přidat další úpravy pro buňky, pokud by bylo potřeba
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
      headStyles: { fillColor: [60, 60, 60] },
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
      headStyles: { fillColor: [60, 60, 60] },
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
      headStyles: { fillColor: [60, 60, 60] },
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
  
  // Přidání standardní patičky
  addDocumentFooter(doc);
  
  return doc;
};

// Pomocná funkce pro stažení PDF dokumentu
export const downloadTaxDocument = (data: DocumentData): void => {
  const doc = generateTaxDocument(data);
  const filename = `${getDocumentTitle(data.documentType).replace(/\s+/g, '_').toLowerCase()}_${new Date().getFullYear()}.pdf`;
  doc.save(filename);
};


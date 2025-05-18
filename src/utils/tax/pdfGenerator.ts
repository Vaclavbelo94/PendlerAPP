
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DocumentData } from './types';
import { getDocumentTitle } from './documentUtils';

export const generateTaxDocument = (data: DocumentData): jsPDF => {
  const doc = new jsPDF();
  
  // Add document header
  const documentTitle = getDocumentTitle(data.documentType);
  doc.setFontSize(20);
  doc.text(documentTitle, 105, 20, { align: 'center' });
  
  // Add tax year
  doc.setFontSize(14);
  doc.text(`Zdaňovací období: ${data.yearOfTax}`, 105, 30, { align: 'center' });
  
  // Add document date
  const currentDate = new Date().toLocaleDateString('cs-CZ');
  doc.setFontSize(10);
  doc.text(`Datum vyhotovení: ${currentDate}`, 195, 10, { align: 'right' });
  
  // Personal details section
  doc.setFontSize(14);
  doc.text('Osobní údaje', 15, 45);
  
  doc.setFontSize(11);
  autoTable(doc, {
    startY: 50,
    head: [['Položka', 'Hodnota']],
    body: [
      ['Jméno a příjmení', data.name],
      ['Daňové identifikační číslo', data.taxId],
      ['Adresa trvalého bydliště', data.address],
      ['Datum narození', data.dateOfBirth || 'Neuvedeno'],
      ['Email', data.email],
    ],
    theme: 'grid',
    headStyles: { fillColor: [60, 60, 60] }
  });
  
  // Employment details section if applicable
  if (data.employerName || data.incomeAmount) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.text('Údaje o zaměstnání', 15, finalY);
    
    doc.setFontSize(11);
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Položka', 'Hodnota']],
      body: [
        ['Zaměstnavatel', data.employerName || 'Neuvedeno'],
        ['Roční příjem (€)', data.incomeAmount || 'Neuvedeno'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] }
    });
  }
  
  // Deduction items section
  const deductionsY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.text('Odpočitatelné položky', 15, deductionsY);
  
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
      headStyles: { fillColor: [60, 60, 60] }
    });
  }
  
  // Additional notes section
  if (data.additionalNotes) {
    const notesY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.text('Doplňující poznámky', 15, notesY);
    
    doc.setFontSize(11);
    autoTable(doc, {
      startY: notesY + 5,
      head: [['Poznámky']],
      body: [[data.additionalNotes]],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] }
    });
  }
  
  // Add signature area
  const signatureY = (doc as any).lastAutoTable.finalY + 40;
  
  doc.line(20, signatureY, 90, signatureY);
  doc.line(120, signatureY, 190, signatureY);
  
  doc.setFontSize(10);
  doc.text('Podpis daňového poplatníka', 55, signatureY + 5, { align: 'center' });
  doc.text('Podpis finančního úředníka', 155, signatureY + 5, { align: 'center' });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Vygenerováno pomocí Pendler Buddy - Daňový poradce | Strana ${i} z ${pageCount}`, 105, 285, { align: 'center' });
  }
  
  return doc;
};

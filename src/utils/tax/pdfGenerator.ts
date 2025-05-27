
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DocumentData } from './types';
import { getDocumentTitle } from './documentUtils';
import { initializePDF, addDocumentHeader, addDocumentFooter } from '../pdf/pdfHelper';
import { createStyledTable, addSection, addInfoBox } from '../pdf/enhancedPdfHelper';

export const generateTaxDocument = async (data: DocumentData): Promise<jsPDF> => {
  // Použijeme vylepšený inicializátor PDF
  const doc = initializePDF();
  
  // Přidáme moderní hlavičku
  const documentTitle = getDocumentTitle(data.documentType);
  const subtitle = `Zdaňovací období: ${data.yearOfTax}`;
  addDocumentHeader(doc, documentTitle, subtitle);
  
  let currentY = 85;
  
  // Osobní údaje sekce
  currentY = addSection(doc, "Osobní údaje", currentY);
  
  await createStyledTable(doc, {
    head: [['Položka', 'Hodnota']],
    body: [
      ['Jméno a příjmení', data.name],
      ['Daňové identifikační číslo', data.taxId],
      ['Adresa trvalého bydliště', data.address],
      ['Datum narození', data.dateOfBirth || 'Neuvedeno'],
      ['Email', data.email],
    ]
  }, currentY);
  
  // Údaje o zaměstnání (pokud jsou k dispozici)
  if (data.employerName || data.incomeAmount) {
    currentY = (doc as any).lastAutoTable.finalY + 15;
    currentY = addSection(doc, "Údaje o zaměstnání", currentY);
    
    await createStyledTable(doc, {
      head: [['Položka', 'Hodnota']],
      body: [
        ['Zaměstnavatel', data.employerName || 'Neuvedeno'],
        ['Roční příjem (€)', data.incomeAmount || 'Neuvedeno'],
      ]
    }, currentY);
  }
  
  // Odpočitatelné položky
  currentY = (doc as any).lastAutoTable.finalY + 15;
  currentY = addSection(doc, "Odpočitatelné položky", currentY);
  
  const deductions = [];
  let totalDeductions = 0;
  
  if (data.includeCommuteExpenses) {
    const commuteCostPerKm = 0.30;
    const totalCommuteDays = parseInt(data.commuteWorkDays || '220');
    const commuteDistance = parseInt(data.commuteDistance || '0');
    const totalCommuteCost = commuteCostPerKm * commuteDistance * totalCommuteDays;
    totalDeductions += totalCommuteCost;
    
    deductions.push([
      'Náklady na dojíždění', 
      `${commuteDistance} km × ${totalCommuteDays} dní × 0.30€`,
      `${totalCommuteCost.toFixed(2)} €`
    ]);
  }
  
  if (data.includeSecondHome) {
    const secondHomeCost = 1200; // Aproximativní roční náklad
    totalDeductions += secondHomeCost;
    deductions.push(['Druhé bydlení v Německu', 'Paušální náklad', `${secondHomeCost} €`]);
  }
  
  if (data.includeWorkClothes) {
    const workClothesCost = 400; // Aproximativní roční náklad
    totalDeductions += workClothesCost;
    deductions.push(['Pracovní oděvy a pomůcky', 'Paušální náklad', `${workClothesCost} €`]);
  }
  
  if (deductions.length > 0) {
    deductions.push(['', 'CELKEM', `${totalDeductions.toFixed(2)} €`]);
    
    await createStyledTable(doc, {
      head: [['Položka', 'Výpočet', 'Částka']],
      body: deductions
    }, currentY, {
      columnStyles: {
        2: { fontStyle: 'bold', halign: 'right' }
      }
    });
    
    // Info box s odhadovanou úsporou
    currentY = (doc as any).lastAutoTable.finalY + 10;
    const estimatedSaving = totalDeductions * 0.25; // 25% daňová sazba
    currentY = addInfoBox(
      doc, 
      `💰 Odhadovaná úspora na dani: ${estimatedSaving.toFixed(2)} € (při 25% sazbě)`, 
      currentY, 
      'success'
    );
  } else {
    currentY = addInfoBox(
      doc, 
      "ℹ️ Nebyly vybrány žádné odpočitatelné položky", 
      currentY, 
      'warning'
    );
  }
  
  // Doplňující poznámky
  if (data.additionalNotes) {
    currentY = currentY + 15;
    currentY = addSection(doc, "Doplňující poznámky", currentY);
    
    await createStyledTable(doc, {
      head: [['Poznámky']],
      body: [[data.additionalNotes]]
    }, currentY);
  }
  
  // Podpisová sekce
  const signatureY = Math.max((doc as any).lastAutoTable?.finalY + 40 || currentY + 40, 
    doc.internal.pageSize.height - 80);
  
  // Přidání nové stránky pokud není dost místa
  if (signatureY > doc.internal.pageSize.height - 60) {
    doc.addPage();
    const newSignatureY = 50;
    
    doc.line(20, newSignatureY, 90, newSignatureY);
    doc.line(120, newSignatureY, 190, newSignatureY);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Podpis daňového poplatníka', 55, newSignatureY + 7, { align: 'center' });
    doc.text('Podpis finančního úředníka', 155, newSignatureY + 7, { align: 'center' });
  } else {
    doc.line(20, signatureY, 90, signatureY);
    doc.line(120, signatureY, 190, signatureY);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Podpis daňového poplatníka', 55, signatureY + 7, { align: 'center' });
    doc.text('Podpis finančního úředníka', 155, signatureY + 7, { align: 'center' });
  }
  
  // Přidání vylepšené patičky
  addDocumentFooter(doc);
  
  return doc;
};

// Funkce pro stažení PDF dokumentu s vylepšeným názvem
export const downloadTaxDocument = async (data: DocumentData): Promise<void> => {
  const doc = await generateTaxDocument(data);
  const filename = `${getDocumentTitle(data.documentType).replace(/\s+/g, '_').toLowerCase()}_${new Date().getFullYear()}_enhanced.pdf`;
  doc.save(filename);
};

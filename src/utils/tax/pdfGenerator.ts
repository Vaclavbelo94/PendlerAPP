
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DocumentData } from './types';
import { getDocumentTitle } from './documentUtils';
import { 
  initializeProfessionalPDF, 
  addProfessionalHeader, 
  addProfessionalFooter,
  createProfessionalTable,
  addProfessionalSection,
  addProfessionalInfoBox,
  addProfessionalStatsCard,
  PROFESSIONAL_COLORS,
  SPACING
} from '../pdf/professionalPdfHelper';

export const generateTaxDocument = async (data: DocumentData): Promise<jsPDF> => {
  // Use professional PDF initializer
  const doc = initializeProfessionalPDF();
  
  // Add professional header
  const documentTitle = getDocumentTitle(data.documentType);
  const subtitle = `Zdaňovací období: ${data.yearOfTax} • Profesionální příprava`;
  addProfessionalHeader(doc, documentTitle, subtitle, 'accent');
  
  let currentY = 85;
  
  // Personal information section
  currentY = addProfessionalSection(doc, "👤 Osobní údaje", currentY, 'primary');
  
  await createProfessionalTable(doc, {
    head: [['Položka', 'Hodnota']],
    body: [
      ['Jméno a příjmení', data.name || 'Neuvedeno'],
      ['Daňové identifikační číslo', data.taxId || 'Neuvedeno'],
      ['Adresa trvalého bydliště', data.address || 'Neuvedeno'],
      ['Datum narození', data.dateOfBirth || 'Neuvedeno'],
      ['Email', data.email || 'Neuvedeno'],
    ]
  }, currentY);
  
  // Employment information (if available)
  if (data.employerName || data.incomeAmount) {
    currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
    currentY = addProfessionalSection(doc, "💼 Údaje o zaměstnání", currentY, 'secondary');
    
    await createProfessionalTable(doc, {
      head: [['Položka', 'Hodnota']],
      body: [
        ['Zaměstnavatel', data.employerName || 'Neuvedeno'],
        ['Roční příjem (€)', data.incomeAmount ? `${data.incomeAmount} €` : 'Neuvedeno'],
      ]
    }, currentY);
  }
  
  // Deductible items
  currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
  currentY = addProfessionalSection(doc, "💰 Odpočitatelné položky", currentY, 'accent');
  
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
    const secondHomeCost = 1200;
    totalDeductions += secondHomeCost;
    deductions.push(['Druhé bydlení v Německu', 'Paušální roční náklad', `${secondHomeCost} €`]);
  }
  
  if (data.includeWorkClothes) {
    const workClothesCost = 400;
    totalDeductions += workClothesCost;
    deductions.push(['Pracovní oděvy a pomůcky', 'Paušální roční náklad', `${workClothesCost} €`]);
  }
  
  if (deductions.length > 0) {
    // Add summary row
    deductions.push(['', 'CELKEM ODPOČET', `${totalDeductions.toFixed(2)} €`]);
    
    await createProfessionalTable(doc, {
      head: [['Položka', 'Výpočet', 'Částka (€)']],
      body: deductions
    }, currentY, {
      columnStyles: {
        2: { fontStyle: 'bold', halign: 'right' }
      }
    });
    
    // Tax savings calculation
    currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
    const estimatedSaving = totalDeductions * 0.25; // 25% tax rate
    
    // Professional stats for tax savings
    const taxStats = [
      { label: 'Celkem odpočet', value: `${totalDeductions.toFixed(0)} €`, color: PROFESSIONAL_COLORS.primary.main },
      { label: 'Odhadovaná úspora', value: `${estimatedSaving.toFixed(0)} €`, color: PROFESSIONAL_COLORS.success },
      { label: 'Daňová sazba', value: '25%', color: PROFESSIONAL_COLORS.accent.main },
      { label: 'Roční benefit', value: `${(estimatedSaving * 12).toFixed(0)} €`, color: PROFESSIONAL_COLORS.secondary.main }
    ];
    
    currentY = addProfessionalStatsCard(doc, taxStats, currentY);
    
    currentY = addProfessionalInfoBox(
      doc, 
      `🎯 Profesionální tip: S těmito odpočty můžete ušetřit až ${estimatedSaving.toFixed(2)} € ročně na dani. Nezapomeňte si připravit všechny potřebné doklady před podáním daňového přiznání.`, 
      currentY, 
      'success'
    );
  } else {
    currentY = addProfessionalInfoBox(
      doc, 
      "ℹ️ Nebyly vybrány žádné odpočitatelné položky. Pro optimalizaci daní zvažte využití dostupných odpočtů.", 
      currentY, 
      'warning'
    );
  }
  
  // Additional notes section
  if (data.additionalNotes) {
    currentY = currentY + SPACING.lg;
    currentY = addProfessionalSection(doc, "📝 Doplňující poznámky", currentY, 'secondary');
    
    await createProfessionalTable(doc, {
      head: [['Poznámky a dodatečné informace']],
      body: [[data.additionalNotes]]
    }, currentY);
    currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
  }
  
  // Professional signature section
  const signatureY = Math.max(currentY + 30, doc.internal.pageSize.height - 80);
  
  // Add new page if needed
  if (signatureY > doc.internal.pageSize.height - 60) {
    doc.addPage();
    const newSignatureY = 50;
    
    // Signature lines with professional styling
    doc.setDrawColor(PROFESSIONAL_COLORS.neutral[300]);
    doc.setLineWidth(1);
    doc.line(20, newSignatureY, 90, newSignatureY);
    doc.line(120, newSignatureY, 190, newSignatureY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PROFESSIONAL_COLORS.neutral[600]);
    doc.text('Podpis daňového poplatníka', 55, newSignatureY + 7, { align: 'center' });
    doc.text('Podpis finančního úředníka', 155, newSignatureY + 7, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(PROFESSIONAL_COLORS.neutral[400]);
    doc.text('Datum: _______________', 55, newSignatureY + 15, { align: 'center' });
    doc.text('Datum: _______________', 155, newSignatureY + 15, { align: 'center' });
  } else {
    doc.setDrawColor(PROFESSIONAL_COLORS.neutral[300]);
    doc.setLineWidth(1);
    doc.line(20, signatureY, 90, signatureY);
    doc.line(120, signatureY, 190, signatureY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PROFESSIONAL_COLORS.neutral[600]);
    doc.text('Podpis daňového poplatníka', 55, signatureY + 7, { align: 'center' });
    doc.text('Podpis finančního úředníka', 155, signatureY + 7, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(PROFESSIONAL_COLORS.neutral[400]);
    doc.text('Datum: _______________', 55, signatureY + 15, { align: 'center' });
    doc.text('Datum: _______________', 155, signatureY + 15, { align: 'center' });
  }
  
  // Add professional footer
  addProfessionalFooter(doc);
  
  return doc;
};

// Enhanced download function with professional naming
export const downloadTaxDocument = async (data: DocumentData): Promise<void> => {
  const doc = await generateTaxDocument(data);
  const filename = `PendlerApp_${getDocumentTitle(data.documentType).replace(/\s+/g, '_').toLowerCase()}_${data.yearOfTax}_professional.pdf`;
  doc.save(filename);
};

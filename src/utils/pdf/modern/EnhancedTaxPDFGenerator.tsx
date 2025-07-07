import { TaxWizardData, TaxCalculationResult } from '@/components/tax-advisor/wizard/types';

export const generateEnhancedTaxPDF = async (
  data: TaxWizardData, 
  result: TaxCalculationResult, 
  t: any
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Formátování měny
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Formátování data
  const formatDate = () => {
    return new Intl.DateTimeFormat('de-DE').format(new Date());
  };

  // Hlavička dokumentu
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(t('wizard.pdfExport.enhancedTitle'), margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${t('wizard.pdfExport.generatedDate')}: ${formatDate()}`, margin, yPosition);
  yPosition += 15;

  // ELSTER mapování sekce
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(t('wizard.pdfExport.elsterMapping'), margin, yPosition);
  yPosition += 10;

  // Tabulka pro ELSTER mapování
  const elsterMappings = [
    {
      category: t('wizard.pdfExport.personalData'),
      items: [
        { field: t('wizard.personalInfo.firstName'), value: data.personalInfo.firstName, elsterField: 'Mantelbogen - Zeile 4' },
        { field: t('wizard.personalInfo.lastName'), value: data.personalInfo.lastName, elsterField: 'Mantelbogen - Zeile 3' },
        { field: t('wizard.personalInfo.address'), value: data.personalInfo.address, elsterField: 'Mantelbogen - Zeile 6-8' },
        { field: t('wizard.personalInfo.taxId'), value: data.personalInfo.taxId, elsterField: 'Mantelbogen - Zeile 1' }
      ]
    },
    {
      category: t('wizard.pdfExport.employmentData'),
      items: [
        { field: t('wizard.employment.employerName'), value: data.employmentInfo.employerName, elsterField: 'Anlage N - Zeile 4' },
        { field: t('wizard.employment.annualIncome'), value: formatCurrency(data.employmentInfo.annualIncome), elsterField: 'Anlage N - Zeile 21' },
        { field: t('wizard.employment.taxClass'), value: data.employmentInfo.taxClass, elsterField: 'Anlage N - Zeile 22' }
      ]
    },
    {
      category: t('wizard.pdfExport.deductions'),
      items: [
        { field: t('wizard.reisepauschale.title'), value: formatCurrency(result.pendlerPauschale), elsterField: 'Anlage N - Zeile 31-35' },
        ...(data.deductions.workClothes ? [{ field: t('wizard.deductions.workClothes'), value: formatCurrency(data.deductions.workClothes), elsterField: 'Anlage N - Zeile 41' }] : []),
        ...(data.deductions.education ? [{ field: t('wizard.deductions.education'), value: formatCurrency(data.deductions.education), elsterField: 'Anlage N - Zeile 44' }] : []),
        ...(data.deductions.professionalLiterature ? [{ field: t('wizard.deductions.professionalLiterature'), value: formatCurrency(data.deductions.professionalLiterature), elsterField: 'Anlage N - Zeile 46' }] : []),
        ...(data.deductions.tools ? [{ field: t('wizard.deductions.tools'), value: formatCurrency(data.deductions.tools), elsterField: 'Anlage N - Zeile 47' }] : []),
        ...(data.deductions.homeOffice ? [{ field: t('wizard.deductions.homeOffice'), value: formatCurrency(data.deductions.homeOffice), elsterField: 'Anlage N - Zeile 50' }] : [])
      ]
    }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  elsterMappings.forEach((category) => {
    // Kontrola místa na stránce
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // Kategorie
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(category.category, margin, yPosition);
    yPosition += 8;

    // Záhlaví tabulky
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(t('wizard.pdfExport.field'), margin, yPosition);
    doc.text(t('wizard.pdfExport.value'), margin + 60, yPosition);
    doc.text(t('wizard.pdfExport.elsterLocation'), margin + 110, yPosition);
    yPosition += 5;

    // Čára pod záhlavím
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;

    // Data tabulky
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    category.items.forEach((item) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }

      const fieldText = doc.splitTextToSize(item.field, 55);
      const valueText = doc.splitTextToSize(item.value, 45);
      const elsterText = doc.splitTextToSize(item.elsterField, 65);

      const maxLines = Math.max(fieldText.length, valueText.length, elsterText.length);

      doc.text(fieldText, margin, yPosition);
      doc.text(valueText, margin + 60, yPosition);
      doc.text(elsterText, margin + 110, yPosition);
      
      yPosition += maxLines * 4 + 2;
    });

    yPosition += 5;
  });

  // Nová stránka pro detailní výpočty
  doc.addPage();
  yPosition = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(t('wizard.pdfExport.detailedCalculations'), margin, yPosition);
  yPosition += 15;

  // Reisepauschale výpočet
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(t('wizard.reisepauschale.title'), margin, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const reisepauschaleDetails = [
    `${t('wizard.reisepauschale.commuteDistance')}: ${data.reisepauschale.commuteDistance} km`,
    `${t('wizard.reisepauschale.workDaysPerYear')}: ${data.reisepauschale.workDaysPerYear} ${t('common.days')}`,
    `${t('wizard.reisepauschale.transportType')}: ${data.reisepauschale.transportType}`
  ];

  reisepauschaleDetails.forEach((detail) => {
    doc.text(`• ${detail}`, margin + 5, yPosition);
    yPosition += 5;
  });

  // Výpočet podle vzdálenosti
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.text(t('wizard.pdfExport.calculationBreakdown'), margin, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'normal');
  const distance = data.reisepauschale.commuteDistance;
  const workDays = data.reisepauschale.workDaysPerYear;
  
  if (distance <= 20) {
    doc.text(`${workDays} ${t('common.days')} × ${distance} km × 0,30 € = ${formatCurrency(workDays * distance * 0.30)}`, margin + 5, yPosition);
  } else {
    const firstPart = workDays * 20 * 0.30;
    const secondPart = workDays * (distance - 20) * 0.38;
    doc.text(`${workDays} ${t('common.days')} × 20 km × 0,30 € = ${formatCurrency(firstPart)}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`${workDays} ${t('common.days')} × ${distance - 20} km × 0,38 € = ${formatCurrency(secondPart)}`, margin + 5, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('common.total')}: ${formatCurrency(firstPart + secondPart)}`, margin + 5, yPosition);
  }

  yPosition += 10;

  // Druhý domov
  if (data.reisepauschale.hasSecondHome) {
    doc.setFont('helvetica', 'bold');
    doc.text(t('wizard.reisepauschale.secondHome'), margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    const secondHomeTrips = 46;
    const secondHomeBenefit = secondHomeTrips * distance * (distance <= 20 ? 0.30 : 0.38);
    doc.text(`${t('wizard.pdfExport.secondHomeCalculation')}: 46 × ${distance} km × ${distance <= 20 ? '0,30' : '0,38'} € = ${formatCurrency(secondHomeBenefit)}`, margin + 5, yPosition);
    yPosition += 10;
  }

  // Ostatní odpočty
  if (result.totalDeductions - result.pendlerPauschale > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text(t('wizard.pdfExport.otherDeductions'), margin, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    const deductionsList = [
      { key: 'workClothes', amount: data.deductions.workClothes },
      { key: 'education', amount: data.deductions.education },
      { key: 'insurance', amount: data.deductions.insurance },
      { key: 'professionalLiterature', amount: data.deductions.professionalLiterature },
      { key: 'tools', amount: data.deductions.tools },
      { key: 'homeOffice', amount: data.deductions.homeOffice }
    ];

    deductionsList.forEach((deduction) => {
      if (deduction.amount && deduction.amount > 0) {
        doc.text(`• ${t(`wizard.deductions.${deduction.key}`)}: ${formatCurrency(deduction.amount)}`, margin + 5, yPosition);
        yPosition += 5;
      }
    });
  }

  // Celkové shrnutí
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(t('wizard.pdfExport.totalSummary'), margin, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`${t('wizard.results.totalReisepauschale')}: ${formatCurrency(result.pendlerPauschale)}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`${t('wizard.results.otherDeductions')}: ${formatCurrency(result.totalDeductions - result.pendlerPauschale)}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`${t('wizard.results.totalDeductions')}: ${formatCurrency(result.totalDeductions)}`, margin + 5, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 150, 0);
  doc.text(`${t('wizard.results.estimatedRefund')}: ${formatCurrency(result.totalDeductions * 0.25)}`, margin + 5, yPosition);
  doc.setTextColor(0, 0, 0);

  // Nová stránka pro pokyny
  doc.addPage();
  yPosition = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(t('wizard.pdfExport.instructionsTitle'), margin, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const instructions = [
    t('wizard.pdfExport.instruction1'),
    t('wizard.pdfExport.instruction2'),
    t('wizard.pdfExport.instruction3'),
    t('wizard.pdfExport.instruction4'),
    t('wizard.pdfExport.instruction5'),
    t('wizard.pdfExport.instruction6')
  ];

  instructions.forEach((instruction, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    const lines = doc.splitTextToSize(`${index + 1}. ${instruction}`, pageWidth - 2 * margin);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * 5 + 3;
  });

  // Papatka
  yPosition += 10;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const footer = t('wizard.pdfExport.footer');
  const footerLines = doc.splitTextToSize(footer, pageWidth - 2 * margin);
  doc.text(footerLines, margin, yPosition);

  // Stažení PDF
  const fileName = `tax_return_guide_${data.personalInfo.lastName || 'user'}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
};
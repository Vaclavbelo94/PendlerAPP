// PDF Guide Service for ELSTER integration

// Služba pro generování PDF průvodce ELSTER
export const generateElsterPDFGuide = async (t: any, language: string): Promise<void> => {
  // Import PDFKit pro klientskou generaci PDF
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Nastavení fontů
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  
  // Titel
  const title = t('elster.pdfGuide.title');
  doc.text(title, margin, yPosition);
  yPosition += 15;

  // Úvod
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const introduction = t('elster.pdfGuide.introduction');
  const introLines = doc.splitTextToSize(introduction, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * 5 + 10;

  // Kroky
  const steps = [
    {
      number: 1,
      title: t('elster.steps.registration.title'),
      content: [
        t('elster.steps.registration.detail1'),
        t('elster.steps.registration.detail2'),
        t('elster.steps.registration.detail3'),
        t('elster.steps.registration.detail4')
      ]
    },
    {
      number: 2,
      title: t('elster.steps.certificate.title'),
      content: [
        t('elster.steps.certificate.detail1'),
        t('elster.steps.certificate.detail2'),
        t('elster.steps.certificate.detail3')
      ]
    },
    {
      number: 3,
      title: t('elster.steps.newDeclaration.title'),
      content: [
        t('elster.steps.newDeclaration.detail1'),
        t('elster.steps.newDeclaration.detail2'),
        t('elster.steps.newDeclaration.detail3')
      ]
    },
    {
      number: 4,
      title: t('elster.steps.fillForm.title'),
      content: [
        t('elster.steps.fillForm.detail1'),
        t('elster.steps.fillForm.detail2'),
        t('elster.steps.fillForm.detail3'),
        t('elster.steps.fillForm.detail4')
      ]
    },
    {
      number: 5,
      title: t('elster.steps.submit.title'),
      content: [
        t('elster.steps.submit.detail1'),
        t('elster.steps.submit.detail2'),
        t('elster.steps.submit.detail3')
      ]
    }
  ];

  for (const step of steps) {
    // Kontrola místa na stránce
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Nadpis kroku
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const stepTitle = `${step.number}. ${step.title}`;
    doc.text(stepTitle, margin, yPosition);
    yPosition += 10;

    // Obsah kroku
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    step.content.forEach((item, index) => {
      // Kontrola místa na stránce
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      const bulletPoint = `• ${item}`;
      const lines = doc.splitTextToSize(bulletPoint, pageWidth - 2 * margin - 10);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 4 + 2;
    });

    yPosition += 5;
  }

  // Nová stránka pro mapování formuláře
  doc.addPage();
  yPosition = margin;

  // Mapování formuláře
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(t('elster.formMapping.title'), margin, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  // Tabulka mapování
  const mappingData = [
    [t('wizard.personalInfo.firstName'), 'Mantelbogen', t('elster.formMapping.personalSection')],
    [t('wizard.personalInfo.lastName'), 'Mantelbogen', t('elster.formMapping.personalSection')],
    [t('wizard.personalInfo.address'), 'Mantelbogen', t('elster.formMapping.personalSection')],
    [t('wizard.personalInfo.taxId'), 'Mantelbogen', t('elster.formMapping.personalSection')],
    [t('wizard.employment.employerName'), 'Anlage N', t('elster.formMapping.employmentSection')],
    [t('wizard.employment.annualIncome'), 'Anlage N', t('elster.formMapping.employmentSection')],
    [t('wizard.reisepauschale.title'), 'Anlage N - Werbungskosten', t('elster.formMapping.deductionsSection')],
    [t('wizard.deductions.workClothes'), 'Anlage N - Werbungskosten', t('elster.formMapping.deductionsSection')],
    [t('wizard.deductions.education'), 'Anlage N - Werbungskosten', t('elster.formMapping.deductionsSection')]
  ];

  // Tabulka záhlaví
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(t('elster.formMapping.fieldName'), margin, yPosition);
  doc.text(t('elster.formMapping.elsterForm'), margin + 80, yPosition);
  doc.text(t('elster.formMapping.section'), margin + 140, yPosition);
  yPosition += 8;

  // Čára pod záhlavím
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Data tabulky
  doc.setFont('helvetica', 'normal');
  mappingData.forEach(([field, form, section]) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }

    doc.text(field, margin, yPosition);
    doc.text(form, margin + 80, yPosition);
    doc.text(section, margin + 140, yPosition);
    yPosition += 6;
  });

  // Nová stránka pro tipy
  doc.addPage();
  yPosition = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(t('elster.tips.title'), margin, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const tips = [
    t('elster.tips.tip1'),
    t('elster.tips.tip2'),
    t('elster.tips.tip3'),
    t('elster.tips.tip4'),
    t('elster.tips.tip5')
  ];

  tips.forEach((tip) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    const bulletPoint = `• ${tip}`;
    const lines = doc.splitTextToSize(bulletPoint, pageWidth - 2 * margin - 10);
    doc.text(lines, margin + 5, yPosition);
    yPosition += lines.length * 4 + 3;
  });

  // Papatka
  yPosition += 10;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  const footer = t('elster.pdfGuide.footer');
  const footerLines = doc.splitTextToSize(footer, pageWidth - 2 * margin);
  doc.text(footerLines, margin, yPosition);

  // Stažení PDF
  const fileName = `elster_guide_${language}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
};

// Vytvoření zjednodušeného check-listu ve formátu PDF
export const generateDocumentChecklistPDF = async (t: any, language: string): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Nadpis
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(t('documents.checklist.title'), margin, yPosition);
  yPosition += 15;

  // Úvod
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const intro = t('documents.checklist.introduction');
  const introLines = doc.splitTextToSize(intro, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * 5 + 10;

  // Povinné dokumenty
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(t('documents.requiredDocuments'), margin, yPosition);
  yPosition += 10;

  const requiredDocs = [
    { title: t('documents.steuerId.title'), desc: t('documents.steuerId.description') },
    { title: t('documents.payrollCertificate.title'), desc: t('documents.payrollCertificate.description') },
    { title: t('documents.residenceCertificate.title'), desc: t('documents.residenceCertificate.description') }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  requiredDocs.forEach((doc_item) => {
    // Checkbox
    doc.rect(margin, yPosition - 3, 4, 4);
    
    // Nadpis
    doc.setFont('helvetica', 'bold');
    doc.text(doc_item.title, margin + 8, yPosition);
    yPosition += 5;
    
    // Popis
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(doc_item.desc, pageWidth - 2 * margin - 10);
    doc.text(descLines, margin + 8, yPosition);
    yPosition += descLines.length * 4 + 5;
  });

  // Volitelné dokumenty
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(t('documents.optionalDocuments'), margin, yPosition);
  yPosition += 10;

  const optionalDocs = [
    { title: t('documents.commuteProof.title'), desc: t('documents.commuteProof.description') },
    { title: t('documents.workClothesReceipts.title'), desc: t('documents.workClothesReceipts.description') },
    { title: t('documents.educationCertificates.title'), desc: t('documents.educationCertificates.description') }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  optionalDocs.forEach((doc_item) => {
    if (yPosition > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPosition = margin;
    }

    // Checkbox
    doc.rect(margin, yPosition - 3, 4, 4);
    
    // Nadpis
    doc.setFont('helvetica', 'bold');
    doc.text(doc_item.title, margin + 8, yPosition);
    yPosition += 5;
    
    // Popis
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(doc_item.desc, pageWidth - 2 * margin - 10);
    doc.text(descLines, margin + 8, yPosition);
    yPosition += descLines.length * 4 + 5;
  });

  // Stažení
  const fileName = `document_checklist_${language}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
};
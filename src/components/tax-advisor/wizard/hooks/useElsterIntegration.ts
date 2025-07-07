import { useCallback } from 'react';
import { TaxWizardData, TaxCalculationResult } from '../types';

export const useElsterIntegration = () => {
  const exportToElsterXML = useCallback(async (data: TaxWizardData, result: TaxCalculationResult) => {
    try {
      // Create XML structure compatible with ELSTER format
      const xmlData = {
        personalInfo: {
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          taxId: data.personalInfo.taxId,
          address: data.personalInfo.address,
        },
        employment: {
          employerName: data.employmentInfo.employerName,
          annualIncome: data.employmentInfo.annualIncome,
          taxClass: data.employmentInfo.taxClass,
        },
        deductions: {
          reisepauschale: result.reisepausaleBenefit,
          totalDeductions: result.totalDeductions,
          workClothes: data.deductions.workClothes ? data.deductions.workClothesCost : 0,
          education: data.deductions.education ? data.deductions.educationCost : 0,
          insurance: data.deductions.insurance ? data.deductions.insuranceCost : 0,
          tools: data.deductions.tools ? data.deductions.toolsCost : 0,
          homeOffice: data.deductions.homeOffice ? data.deductions.homeOfficeCost : 0,
        },
        calculation: {
          totalDeductions: result.totalDeductions,
          estimatedRefund: result.totalDeductions * 0.25,
          taxSaving: result.reisepausaleBenefit + result.totalDeductions,
        }
      };

      // Convert to XML format
      const xmlContent = generateElsterXML(xmlData);
      
      // Create and download file
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elster_data_${new Date().getFullYear()}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting to ELSTER XML:', error);
      throw new Error('Failed to export XML for ELSTER');
    }
  }, []);

  const downloadElsterGuide = useCallback(async () => {
    try {
      // Create a comprehensive ELSTER guide
      const guideContent = createElsterGuide();
      
      const blob = new Blob([guideContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'elster_guide.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading ELSTER guide:', error);
      throw new Error('Failed to download ELSTER guide');
    }
  }, []);

  const downloadDocumentChecklist = useCallback(async () => {
    try {
      const checklistContent = createDocumentChecklist();
      
      const blob = new Blob([checklistContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document_checklist.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading document checklist:', error);
      throw new Error('Failed to download document checklist');
    }
  }, []);

  return {
    exportToElsterXML,
    downloadElsterGuide,
    downloadDocumentChecklist,
  };
};

// Helper function to generate ELSTER-compatible XML
const generateElsterXML = (data: any): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ElsterDocument>
  <Header>
    <Version>1.0</Version>
    <Created>${new Date().toISOString()}</Created>
    <Software>PendlerApp Tax Advisor</Software>
  </Header>
  <PersonalInfo>
    <FirstName>${data.personalInfo.firstName}</FirstName>
    <LastName>${data.personalInfo.lastName}</LastName>
    <TaxId>${data.personalInfo.taxId}</TaxId>
    <Address>${data.personalInfo.address}</Address>
  </PersonalInfo>
  <Employment>
    <EmployerName>${data.employment.employerName}</EmployerName>
    <AnnualIncome>${data.employment.annualIncome}</AnnualIncome>
    <TaxClass>${data.employment.taxClass}</TaxClass>
  </Employment>
  <Deductions>
    <Reisepauschale>${data.deductions.reisepauschale}</Reisepauschale>
    <WorkClothes>${data.deductions.workClothes}</WorkClothes>
    <Education>${data.deductions.education}</Education>
    <Insurance>${data.deductions.insurance}</Insurance>
    <Tools>${data.deductions.tools}</Tools>
    <HomeOffice>${data.deductions.homeOffice}</HomeOffice>
    <TotalDeductions>${data.deductions.totalDeductions}</TotalDeductions>
  </Deductions>
  <Calculation>
    <TotalDeductions>${data.calculation.totalDeductions}</TotalDeductions>
    <EstimatedRefund>${data.calculation.estimatedRefund}</EstimatedRefund>
    <TaxSaving>${data.calculation.taxSaving}</TaxSaving>
  </Calculation>
</ElsterDocument>`;
};

// Helper function to create ELSTER guide content
const createElsterGuide = (): string => {
  // This would typically create a PDF, but for simplicity, we're creating text content
  return `ELSTER Online Tax Filing Guide

1. Registration Process:
   - Visit https://elster.de
   - Click on "Registrierung"
   - Enter your tax identification number (Steuer-ID)
   - Provide personal information
   - Verify your identity

2. Certificate Download:
   - After registration, download your certificate
   - Install it in your browser
   - This enables secure authentication

3. Filing Your Tax Return:
   - Log in to ELSTER portal
   - Select "Einkommensteuererklärung"
   - Fill in the required forms:
     * Hauptvordruck (Main form)
     * Anlage N (Employment income)
     * Additional forms as needed
   
4. Required Documents:
   - Lohnsteuerbescheinigung (Tax certificate from employer)
   - Receipts for deductible expenses
   - Insurance documentation
   - Travel expense records

5. Submission:
   - Review all entries carefully
   - Submit electronically
   - Save confirmation for your records

Benefits of ELSTER:
- Faster processing (2-6 weeks vs 2-3 months)
- Automatic data validation
- Electronic confirmation
- Status tracking
- Environmental friendly

For more information, visit: https://elster.de`;
};

// Helper function to create document checklist
const createDocumentChecklist = (): string => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Tax Return Document Checklist</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .checkbox { margin: 10px 0; }
        .section { margin: 20px 0; border-left: 4px solid #007cba; padding-left: 15px; }
        h1 { color: #007cba; }
        h2 { color: #333; }
    </style>
</head>
<body>
    <h1>Tax Return Document Checklist</h1>
    
    <div class="section">
        <h2>Personal Documents</h2>
        <div class="checkbox">☐ Steuerliche Identifikationsnummer (Tax ID)</div>
        <div class="checkbox">☐ Valid ID or passport</div>
        <div class="checkbox">☐ Bank account details (IBAN)</div>
    </div>
    
    <div class="section">
        <h2>Employment Documents</h2>
        <div class="checkbox">☐ Lohnsteuerbescheinigung (Tax certificate)</div>
        <div class="checkbox">☐ Employment contract</div>
        <div class="checkbox">☐ Payslips (if requested)</div>
    </div>
    
    <div class="section">
        <h2>Deduction Documents</h2>
        <div class="checkbox">☐ Commuting expense records</div>
        <div class="checkbox">☐ Work clothing receipts</div>
        <div class="checkbox">☐ Education/training receipts</div>
        <div class="checkbox">☐ Professional literature receipts</div>
        <div class="checkbox">☐ Tools and equipment receipts</div>
        <div class="checkbox">☐ Home office expense documentation</div>
    </div>
    
    <div class="section">
        <h2>Insurance Documents</h2>
        <div class="checkbox">☐ Health insurance certificates</div>
        <div class="checkbox">☐ Life insurance documentation</div>
        <div class="checkbox">☐ Liability insurance proof</div>
    </div>
    
    <div class="section">
        <h2>Additional Documents (if applicable)</h2>
        <div class="checkbox">☐ Church tax documentation</div>
        <div class="checkbox">☐ Charitable donation receipts</div>
        <div class="checkbox">☐ Medical expense receipts</div>
        <div class="checkbox">☐ Childcare expense receipts</div>
    </div>
    
    <p><strong>Note:</strong> Keep all original documents and receipts for at least 6 years after filing.</p>
</body>
</html>`;
};
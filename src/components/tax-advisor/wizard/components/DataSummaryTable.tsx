import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, Car, Calculator, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../types';

interface DataSummaryTableProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
}

const DataSummaryTable: React.FC<DataSummaryTableProps> = ({ data, result }) => {
  const { t } = useTranslation(['taxAdvisor', 'common']);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTransportTypeText = (transportType: string) => {
    switch (transportType) {
      case 'car': return t('wizard.reisepauschale.car');
      case 'publicTransport': return t('wizard.reisepauschale.publicTransport');
      default: return transportType;
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'personal': return <User className="h-4 w-4" />;
      case 'employment': return <Building className="h-4 w-4" />;
      case 'commute': return <Car className="h-4 w-4" />;
      case 'deductions': return <FileText className="h-4 w-4" />;
      case 'calculation': return <Calculator className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const sections = [
    {
      key: 'personal',
      titleKey: 'wizard.steps.personal',
      data: [
        { label: t('wizard.personalInfo.firstName'), value: data.personalInfo.firstName },
        { label: t('wizard.personalInfo.lastName'), value: data.personalInfo.lastName },
        { label: t('wizard.personalInfo.address'), value: data.personalInfo.address },
        { label: t('wizard.personalInfo.taxId'), value: data.personalInfo.taxId },
        { label: t('wizard.personalInfo.email'), value: data.personalInfo.email }
      ].filter(item => item.value)
    },
    {
      key: 'employment',
      titleKey: 'wizard.steps.employment',
      data: [
        { label: t('wizard.employment.employerName'), value: data.employmentInfo.employerName },
        { label: t('wizard.employment.annualIncome'), value: data.employmentInfo.annualIncome ? formatCurrency(data.employmentInfo.annualIncome) : '' },
        { label: t('wizard.employment.taxClass'), value: data.employmentInfo.taxClass }
      ].filter(item => item.value)
    },
    {
      key: 'commute',
      titleKey: 'wizard.steps.reisepauschale',
      data: [
        { label: t('wizard.reisepauschale.commuteDistance'), value: `${data.reisepauschale.commuteDistance} km` },
        { label: t('wizard.reisepauschale.workDaysPerYear'), value: data.reisepauschale.workDaysPerYear?.toString() },
        { label: t('wizard.reisepauschale.transportType'), value: getTransportTypeText(data.reisepauschale.transportType) },
        { label: t('wizard.reisepauschale.hasSecondHome'), value: data.reisepauschale.hasSecondHome ? t('yes', { ns: 'common' }) : t('no', { ns: 'common' }) }
      ].filter(item => item.value)
    },
    {
      key: 'deductions',
      titleKey: 'wizard.steps.deductions',
      data: [
        { label: t('wizard.deductions.workClothes'), value: data.deductions.workClothes ? formatCurrency(data.deductions.workClothesCost) : t('no', { ns: 'common' }) },
        { label: t('wizard.deductions.education'), value: data.deductions.education ? formatCurrency(data.deductions.educationCost) : t('no', { ns: 'common' }) },
        { label: t('wizard.deductions.insurance'), value: data.deductions.insurance ? formatCurrency(data.deductions.insuranceCost) : t('no', { ns: 'common' }) },
        { label: t('wizard.deductions.professionalLiterature'), value: data.deductions.professionalLiterature ? formatCurrency(data.deductions.professionalLiteratureCost) : t('no', { ns: 'common' }) },
        { label: t('wizard.deductions.tools'), value: data.deductions.tools ? formatCurrency(data.deductions.toolsCost) : t('no', { ns: 'common' }) },
        { label: t('wizard.deductions.homeOffice'), value: data.deductions.homeOffice ? formatCurrency(data.deductions.homeOfficeCost) : t('no', { ns: 'common' }) }
      ]
    },
    {
      key: 'calculation',
      titleKey: 'wizard.results.calculationSummary',
      data: [
        { label: t('wizard.results.totalReisepauschale'), value: formatCurrency(result.reisepausaleBenefit) },
        { label: t('wizard.results.totalDeductions'), value: formatCurrency(result.totalDeductions) },
        { label: t('wizard.results.estimatedRefund'), value: formatCurrency(result.totalDeductions * 0.25) }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">{t('wizard.dataSummary.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('wizard.dataSummary.description')}</p>
      </div>

      {sections.map((section) => (
        <Card key={section.key} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {getSectionIcon(section.key)}
              {t(section.titleKey)}
              <Badge variant="secondary" className="ml-auto">
                {section.data.length} {t('wizard.dataSummary.items')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.data.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                  <span className="text-sm font-semibold text-right ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataSummaryTable;
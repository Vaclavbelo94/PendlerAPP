
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp } from 'lucide-react';
import { TaxWizardData, TaxCalculationResult } from '../types';
import { useTranslation } from 'react-i18next';

interface ResultsStepProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onExportPDF: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ data, result, onExportPDF }) => {
  const { t } = useTranslation('taxAdvisor');

  return (
    <div className="space-y-6">
      {/* Hlavní výsledky */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('wizard.results.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('wizard.results.totalDeductions')}</div>
              <div className="text-2xl font-bold text-green-600">
                {result.totalDeductions.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('wizard.results.estimatedSaving')}</div>
              <div className="text-2xl font-bold text-blue-600">
                {result.estimatedTaxSaving.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('common:monthly', { defaultValue: 'Měsíční benefit' })}</div>
              <div className="text-2xl font-bold text-purple-600">
                {result.monthlyBenefit.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('wizard.results.annualBenefit')}</div>
              <div className="text-2xl font-bold text-amber-600">
                {(result.monthlyBenefit * 12).toFixed(2)} €
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailní rozpis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('wizard.results.breakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>{t('wizard.results.reisepauschaleAmount')}:</span>
              <Badge variant="outline">{result.reisepausaleBenefit.toFixed(2)} €</Badge>
            </div>
            
            {result.secondHomeBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.reisepauschale.hasSecondHome')}:</span>
                <Badge variant="outline">{result.secondHomeBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.workClothesBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.deductions.workClothes')}:</span>
                <Badge variant="outline">{result.workClothesBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.educationBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.deductions.education')}:</span>
                <Badge variant="outline">{result.educationBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.insuranceBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.deductions.insurance')}:</span>
                <Badge variant="outline">{result.insuranceBenefit.toFixed(2)} €</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('common:export', { defaultValue: 'Export dokumentu' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              {t('wizard.results.exportDescription', { defaultValue: 'Stáhněte si kompletní daňový dokument s všemi vypočítanými odpočty' })}
            </p>
            <Button onClick={onExportPDF} size="lg" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              {t('wizard.results.exportPdf')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsStep;

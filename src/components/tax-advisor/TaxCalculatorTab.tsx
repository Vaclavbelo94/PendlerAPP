
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, History, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TaxCalculator from '@/components/calculator/TaxCalculator';
import { useTaxManagement } from '@/hooks/useTaxManagement';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';

const TaxCalculatorTab = () => {
  const { user } = useAuth();
  const { saveCalculation, calculations } = useTaxManagement();
  const { t } = useTranslation('common');

  const handleCalculation = async (inputs: Record<string, any>, results: Record<string, any>) => {
    if (user?.id && saveCalculation) {
      await saveCalculation({
        calculation_type: 'german_tax',
        inputs,
        results
      });
    }
  };

  // Filter calculations for the German tax calculator
  const germanTaxCalculations = calculations.filter(calc => calc.calculation_type === 'german_tax');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('taxCalculators')}</h2>
        <p className="text-muted-foreground">
          {t('quickCalculations')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5" />
              {t('germanCalculator')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {t('calculatorDescription')}
            </p>
            <Badge variant="outline">{t('currentRates')}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5" />
              {t('calculationHistory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {germanTaxCalculations.length} {t('calculationHistory').toLowerCase()}
            </p>
            <Badge variant="secondary">
              {user ? t('loggedInSaves') : t('notLoggedInNoSave')}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              {t('optimizationTips')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {t('calculatorDescription')}
            </p>
            <Badge variant="outline">{t('loading')}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {t('germanTaxCalculator2024')}
            </span>
            <Badge variant="outline">{t('currentRates')}</Badge>
          </CardTitle>
          <CardDescription>
            {t('calculatorDescription')} {' '}
            {user ? t('loggedInSaves') : t('notLoggedInNoSave')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaxCalculator 
            onCalculate={handleCalculation}
            calculationHistory={germanTaxCalculations}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCalculatorTab;

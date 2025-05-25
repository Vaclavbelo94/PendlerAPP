
import React from 'react';
import TaxCalculator from '@/components/calculator/TaxCalculator';
import { useTaxManagement } from '@/hooks/useTaxManagement';
import { useAuth } from '@/hooks/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const TaxCalculatorTab = () => {
  const { user } = useAuth();
  const { calculations, saveCalculation } = useTaxManagement();

  const handleCalculate = async (inputs: Record<string, any>, result: Record<string, any>) => {
    if (user?.id) {
      await saveCalculation({
        calculation_type: 'german_tax',
        inputs,
        results: result,
      });
    }
  };

  const germanTaxCalculations = calculations.filter(calc => calc.calculation_type === 'german_tax');

  // Transform calculations to match TaxCalculator's expected format
  const calculationHistory = germanTaxCalculations.map(calc => ({
    id: calc.id,
    inputs: calc.inputs,
    result: calc.results, // Map 'results' to 'result' for compatibility
    created_at: calc.created_at
  }));

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daňový kalkulátor</CardTitle>
          <CardDescription>Pro použití kalkulátoru se musíte přihlásit</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Přihlaste se pro ukládání výpočtů a přístup k historii
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rychlý daňový kalkulátor</CardTitle>
          <CardDescription>
            Vypočítejte svou daň z příjmu a čistou mzdu v Německu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Výpočty jsou automaticky ukládány do vaší historie pro budoucí reference
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <TaxCalculator 
        onCalculate={handleCalculate}
        calculationHistory={calculationHistory}
      />
    </div>
  );
};

export default TaxCalculatorTab;

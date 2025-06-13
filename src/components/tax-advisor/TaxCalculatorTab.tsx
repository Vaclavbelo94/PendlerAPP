
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, History, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TaxCalculator from '@/components/calculator/TaxCalculator';
import { useTaxManagement } from '@/hooks/useTaxManagement';
import { useAuth } from '@/hooks/auth';

const TaxCalculatorTab = () => {
  const { user } = useAuth();
  const { saveCalculation, calculations } = useTaxManagement();

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
        <h2 className="text-2xl font-bold">Daňové kalkulátory</h2>
        <p className="text-muted-foreground">
          Rychlé výpočty pro vaše daňové plánování
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5" />
              Německý kalkulátor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Přesný výpočet daní podle německých sazeb pro rok 2024
            </p>
            <Badge variant="outline">Aktuální pro 2024</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5" />
              Historie výpočtů
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {germanTaxCalculations.length} uložených výpočtů
            </p>
            <Badge variant="secondary">
              {user ? 'Přihlášeno' : 'Nepřihlášeno'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Optimalizace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Tipy založené na vašich výpočtech
            </p>
            <Badge variant="outline">Připravujeme</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Německý daňový kalkulátor 2024
            </span>
            <Badge variant="outline">Aktuální sazby</Badge>
          </CardTitle>
          <CardDescription>
            Vypočítejte přesnou výši vaší daňové povinnosti podle německých daňových sazeb.
            {user ? ' Vaše výpočty se automaticky ukládají.' : ' Přihlaste se pro ukládání výpočtů.'}
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

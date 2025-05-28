
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, History, Save, Download } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useTaxManagement } from '@/hooks/useTaxManagement';
import TaxCalculator from '@/components/calculator/TaxCalculator';
import GermanTaxCalculator from './calculators/GermanTaxCalculator';

const TaxCalculatorTab = () => {
  const { user } = useAuth();
  const { calculations, saveCalculation, loadCalculations } = useTaxManagement();
  const [activeCalculator, setActiveCalculator] = useState('german');

  useEffect(() => {
    if (user?.id) {
      loadCalculations('tax-calculator');
    }
  }, [user?.id]);

  const handleCalculationSave = async (inputs: Record<string, any>, result: Record<string, any>) => {
    if (!user?.id) return;

    try {
      await saveCalculation({
        calculation_type: 'tax-calculator',
        inputs,
        results: result,
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daňové kalkulátory</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              Pro použití kalkulátorů a ukládání výpočtů se musíte přihlásit.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daňové kalkulátory</h2>
          <p className="text-muted-foreground">
            Vypočítejte daně pro různé země a situace
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export výsledků
          </Button>
        </div>
      </div>

      <Tabs value={activeCalculator} onValueChange={setActiveCalculator}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="german">Německý kalkulátor</TabsTrigger>
          <TabsTrigger value="general">Obecný kalkulátor</TabsTrigger>
        </TabsList>

        <TabsContent value="german" className="space-y-6">
          <GermanTaxCalculator />
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <TaxCalculator 
            onCalculate={handleCalculationSave}
            calculationHistory={calculations}
          />
        </TabsContent>
      </Tabs>

      {calculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historie výpočtů
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculations.slice(0, 5).map((calculation) => (
                <div key={calculation.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">
                      {calculation.inputs.income ? `${calculation.inputs.income}€` : 'Výpočet'}
                      {calculation.inputs.taxClass && ` (Třída ${calculation.inputs.taxClass})`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(calculation.created_at!).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {calculation.results.netIncome ? 
                        `Čistý: ${calculation.results.netIncome.toFixed(0)}€` : 
                        'Dokončeno'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculation.results.effectiveTaxRate ? 
                        `Sazba: ${calculation.results.effectiveTaxRate.toFixed(1)}%` : 
                        ''
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxCalculatorTab;

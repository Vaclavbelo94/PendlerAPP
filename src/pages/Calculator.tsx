
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator as CalculatorIcon, Euro, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Calculator = () => {
  const { t } = useTranslation('calculator');
  const [grossSalary, setGrossSalary] = useState('');
  const [taxClass, setTaxClass] = useState('1');
  const [results, setResults] = useState<any>(null);

  const calculateTax = () => {
    const gross = parseFloat(grossSalary);
    if (!gross || gross <= 0) return;

    // Simplified German tax calculation for demonstration
    const socialSecurity = gross * 0.2; // ~20% for social security
    const taxRate = taxClass === '1' ? 0.14 : taxClass === '2' ? 0.12 : 0.16;
    const incomeTax = (gross - socialSecurity) * taxRate;
    const netSalary = gross - socialSecurity - incomeTax;

    setResults({
      gross,
      socialSecurity,
      incomeTax,
      netSalary,
      totalDeductions: socialSecurity + incomeTax
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalculatorIcon className="h-8 w-8" />
          Daňová kalkulačka
        </h1>
        <p className="text-muted-foreground">
          Spočítejte si hrubou a čistou mzdu v Německu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Zadejte údaje</CardTitle>
            <CardDescription>
              Vyplňte základní informace pro výpočet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Hrubá mzda (€/měsíc)</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="3000"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxClass">Daňová třída</Label>
              <Select value={taxClass} onValueChange={setTaxClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Třída I (svobodný)</SelectItem>
                  <SelectItem value="2">Třída II (samoživitel)</SelectItem>
                  <SelectItem value="3">Třída III (ženatý)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateTax} 
              className="w-full"
              disabled={!grossSalary || parseFloat(grossSalary) <= 0}
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Vypočítat
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Výsledky výpočtu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Hrubá mzda</p>
                  <p className="text-2xl font-bold text-green-600">
                    €{results.gross.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Čistá mzda</p>
                  <p className="text-2xl font-bold text-blue-600">
                    €{results.netSalary.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm">Sociální pojištění</span>
                  <span className="font-medium text-red-600">
                    -€{results.socialSecurity.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Daň z příjmu</span>
                  <span className="font-medium text-red-600">
                    -€{results.incomeTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Celkové odvody</span>
                  <span className="text-red-600">
                    -€{results.totalDeductions.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  * Výpočet je orientační a slouží pouze pro základní představu. 
                  Pro přesný výpočet kontaktujte daňového poradce.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Calculator;

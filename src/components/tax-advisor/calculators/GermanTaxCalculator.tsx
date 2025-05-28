
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Euro, TrendingDown, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  solidarityTax: number;
  churchTax: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
}

const GermanTaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState('');
  const [taxClass, setTaxClass] = useState('1');
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState('0');
  const [churchTaxRate, setChurchTaxRate] = useState('9');
  const [result, setResult] = useState<TaxResult | null>(null);
  const { toast } = useToast();

  const calculateGermanTax = () => {
    const income = parseFloat(grossIncome);
    if (!income || income <= 0) {
      toast({
        title: "Chyba",
        description: "Zadejte platný příjem",
        variant: "destructive",
      });
      return;
    }

    // Základní odpočet 2024
    const basicAllowance = 11784;
    
    // Zdanitelný příjem
    let taxableIncome = Math.max(0, income - basicAllowance);
    
    // Odpočet na děti
    const children = parseInt(childrenCount);
    if (children > 0) {
      const childAllowance = 9312 * children; // Kinderfreibetrag 2024
      taxableIncome = Math.max(0, taxableIncome - childAllowance);
    }

    // Výpočet daně z příjmu podle německé daňové stupnice
    let incomeTax = 0;
    
    if (taxableIncome <= 17005) {
      // Lineární zóna
      const y = (taxableIncome - 11784) / 10000;
      incomeTax = (922.98 * y + 1400) * y;
    } else if (taxableIncome <= 66760) {
      // První progresivní zóna
      const y = (taxableIncome - 17005) / 10000;
      incomeTax = (181.19 * y + 2397) * y + 1025.38;
    } else if (taxableIncome <= 277825) {
      // Druhá progresivní zóna
      incomeTax = 0.42 * taxableIncome - 10602.13;
    } else {
      // Vrchní sazba
      incomeTax = 0.45 * taxableIncome - 18936.88;
    }

    // Solidaritní příspěvek (5.5% z daně z příjmu, pokud > 18130 €)
    const solidarityTax = incomeTax > 18130 ? incomeTax * 0.055 : 0;
    
    // Církevní daň
    const churchRate = parseFloat(churchTaxRate) / 100;
    const churchTax = incomeTax * churchRate;
    
    // Celková daň
    const totalTax = incomeTax + solidarityTax + churchTax;
    
    // Čistý příjem
    const netIncome = income - totalTax;
    
    // Efektivní sazba
    const effectiveRate = (totalTax / income) * 100;
    
    // Mezní sazba (zjednodušeno)
    let marginalRate = 0;
    if (taxableIncome <= 17005) {
      marginalRate = 14;
    } else if (taxableIncome <= 66760) {
      marginalRate = 24;
    } else if (taxableIncome <= 277825) {
      marginalRate = 42;
    } else {
      marginalRate = 45;
    }

    const calculationResult: TaxResult = {
      grossIncome: income,
      taxableIncome,
      incomeTax,
      solidarityTax,
      churchTax,
      totalTax,
      netIncome,
      effectiveRate,
      marginalRate,
    };

    setResult(calculationResult);

    toast({
      title: "Výpočet dokončen",
      description: `Efektivní daňová sazba: ${effectiveRate.toFixed(1)}%`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Německý daňový kalkulátor 2024
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossIncome">Hrubý roční příjem (€)</Label>
              <Input
                id="grossIncome"
                type="number"
                placeholder="např. 45000"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxClass">Daňová třída</Label>
              <Select value={taxClass} onValueChange={setTaxClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">I - Svobodní</SelectItem>
                  <SelectItem value="2">II - Samoživitelé</SelectItem>
                  <SelectItem value="3">III - Manželé (vyšší příjem)</SelectItem>
                  <SelectItem value="4">IV - Manželé (podobný příjem)</SelectItem>
                  <SelectItem value="5">V - Manželé (nižší příjem)</SelectItem>
                  <SelectItem value="6">VI - Vedlejší příjem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="childrenCount">Počet dětí</Label>
              <Input
                id="childrenCount"
                type="number"
                min="0"
                value={childrenCount}
                onChange={(e) => {
                  setChildrenCount(e.target.value);
                  setHasChildren(parseInt(e.target.value) > 0);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="churchTaxRate">Církevní daň (%)</Label>
              <Select value={churchTaxRate} onValueChange={setChurchTaxRate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Bez církevní daně</SelectItem>
                  <SelectItem value="8">8% (většina spolkových zemí)</SelectItem>
                  <SelectItem value="9">9% (Bayern, Baden-Württemberg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculateGermanTax} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Vypočítat daň
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Výsledky výpočtu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hrubý příjem:</span>
                  <span className="font-medium">{formatCurrency(result.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Zdanitelný příjem:</span>
                  <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Daň z příjmu:</span>
                  <span className="font-medium text-red-600">{formatCurrency(result.incomeTax)}</span>
                </div>
                {result.solidarityTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Solidaritní příspěvek:</span>
                    <span className="font-medium text-red-600">{formatCurrency(result.solidarityTax)}</span>
                  </div>
                )}
                {result.churchTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Církevní daň:</span>
                    <span className="font-medium text-red-600">{formatCurrency(result.churchTax)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Celková daň:</span>
                  <span className="text-red-600">{formatCurrency(result.totalTax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Čistý příjem:</span>
                  <span className="text-green-600">{formatCurrency(result.netIncome)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Efektivní sazba:</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {result.effectiveRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mezní sazba:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    {result.marginalRate}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GermanTaxCalculator;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Euro, Car, Home, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface PendlerTaxResult {
  grossIncome: number;
  reisepausaleBenefit: number;
  secondHomeBenefit: number;
  totalBenefits: number;
  estimatedTaxSaving: number;
  netIncomeImprovement: number;
}

const PendlerTaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState('');
  const [commuteDistance, setCommuteDistance] = useState('');
  const [workDaysPerYear, setWorkDaysPerYear] = useState('220');
  const [transportType, setTransportType] = useState('car');
  const [hasSecondHome, setHasSecondHome] = useState(false);
  const [secondHomeCost, setSecondHomeCost] = useState('1200');
  const [result, setResult] = useState<PendlerTaxResult | null>(null);
  const { toast } = useToast();

  const calculatePendlerTax = () => {
    const income = parseFloat(grossIncome);
    const distance = parseFloat(commuteDistance);
    const workDays = parseInt(workDaysPerYear);
    
    if (!income || !distance || !workDays) {
      toast({
        title: "Chyba",
        description: "Vyplňte všechny povinné údaje",
        variant: "destructive",
      });
      return;
    }

    // Reisepauschale calculation podle německých pravidel 2024
    let reisepausaleBenefit = 0;
    
    if (transportType === 'car') {
      // Auto: 0.30€ za km první 20km, 0.38€ za km nad 20km
      if (distance <= 20) {
        reisepausaleBenefit = distance * 0.30 * workDays;
      } else {
        reisepausaleBenefit = (20 * 0.30 + (distance - 20) * 0.38) * workDays;
      }
    } else {
      // Veřejná doprava: skutečné náklady nebo paušál
      reisepausaleBenefit = distance * 0.30 * workDays;
    }

    // Druhé bydlení benefit
    const secondHomeBenefit = hasSecondHome ? parseFloat(secondHomeCost) : 0;
    
    // Celkové benefity
    const totalBenefits = reisepausaleBenefit + secondHomeBenefit;
    
    // Odhad daňové úspory (průměrná sazba 25%)
    const estimatedTaxSaving = totalBenefits * 0.25;
    
    // Zlepšení čistého příjmu
    const netIncomeImprovement = estimatedTaxSaving;

    const calculationResult: PendlerTaxResult = {
      grossIncome: income,
      reisepausaleBenefit,
      secondHomeBenefit,
      totalBenefits,
      estimatedTaxSaving,
      netIncomeImprovement,
    };

    setResult(calculationResult);

    toast({
      title: "Výpočet dokončen",
      description: `Odhadovaná roční úspora: ${estimatedTaxSaving.toFixed(0)}€`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const exportToReport = () => {
    if (!result) return;
    
    const reportData = {
      personalInfo: {
        grossIncome: result.grossIncome,
        commuteDistance: parseFloat(commuteDistance),
        workDays: parseInt(workDaysPerYear),
        transportType
      },
      calculations: result
    };
    
    // Pro budoucí implementaci PDF exportu
    console.log('Export data:', reportData);
    
    toast({
      title: "Report připraven",
      description: "Data jsou připravena pro daňového poradce",
    });
  };

  const handleSecondHomeChange = (checked: boolean | "indeterminate") => {
    setHasSecondHome(checked === true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Pendler kalkulačka - Reisepauschale 2024
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
              <Label htmlFor="commuteDistance">Vzdálenost do práce (km)</Label>
              <Input
                id="commuteDistance"
                type="number"
                placeholder="např. 35"
                value={commuteDistance}
                onChange={(e) => setCommuteDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDays">Počet pracovních dní ročně</Label>
              <Input
                id="workDays"
                type="number"
                value={workDaysPerYear}
                onChange={(e) => setWorkDaysPerYear(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportType">Typ dopravy</Label>
              <Select value={transportType} onValueChange={setTransportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Auto (0.30€/0.38€ za km)</SelectItem>
                  <SelectItem value="public">Veřejná doprava</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="secondHome"
                checked={hasSecondHome}
                onCheckedChange={handleSecondHomeChange}
              />
              <Label htmlFor="secondHome" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Druhé bydlení v Německu
              </Label>
            </div>

            {hasSecondHome && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="secondHomeCost">Roční náklad na druhé bydlení (€)</Label>
                <Input
                  id="secondHomeCost"
                  type="number"
                  value={secondHomeCost}
                  onChange={(e) => setSecondHomeCost(e.target.value)}
                  placeholder="např. 1200"
                />
              </div>
            )}
          </div>

          <Button onClick={calculatePendlerTax} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Vypočítat Reisepauschale
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Výsledky pro daňového poradce
              </span>
              <Badge variant="outline">Pro rok 2024</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Odpočty</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reisepauschale:</span>
                    <span className="font-medium">{formatCurrency(result.reisepausaleBenefit)}</span>
                  </div>
                  {result.secondHomeBenefit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Druhé bydlení:</span>
                      <span className="font-medium">{formatCurrency(result.secondHomeBenefit)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Celkem odpočet:</span>
                    <span className="text-green-600">{formatCurrency(result.totalBenefits)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Úspory</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Odhadovaná úspora daně:</span>
                    <span className="font-medium">{formatCurrency(result.estimatedTaxSaving)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Měsíční benefit:</span>
                    <span className="font-medium">{formatCurrency(result.netIncomeImprovement / 12)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Roční benefit:</span>
                    <span className="text-green-600">{formatCurrency(result.netIncomeImprovement)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={exportToReport} variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Exportovat pro poradce
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Pro daňového poradce:</strong> Výpočet zahrnuje Reisepauschale podle §9 EStG 
                s aktuálními sazbami 2024. Při vzdálenosti nad 20km se uplatňuje zvýšená sazba 0.38€/km.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PendlerTaxCalculator;

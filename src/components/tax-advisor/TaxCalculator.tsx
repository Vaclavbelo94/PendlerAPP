
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TaxCalculator = () => {
  const { t } = useTranslation('taxAdvisor');
  const [grossSalary, setGrossSalary] = useState('');
  const [taxClass, setTaxClass] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateTax = () => {
    const gross = parseFloat(grossSalary);
    if (!gross || !taxClass) return;

    // Simplified tax calculation
    const taxRate = getTaxRate(taxClass);
    const incomeTax = gross * taxRate;
    const socialInsurance = gross * 0.2;
    const netSalary = gross - incomeTax - socialInsurance;

    setResult({
      gross,
      incomeTax,
      socialInsurance,
      netSalary,
      effectiveTaxRate: ((incomeTax + socialInsurance) / gross * 100).toFixed(1)
    });
  };

  const getTaxRate = (taxClass: string) => {
    const rates = {
      'class1': 0.14,
      'class2': 0.14,
      'class3': 0.08,
      'class4': 0.14,
      'class5': 0.20,
      'class6': 0.18
    };
    return rates[taxClass as keyof typeof rates] || 0.14;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('calculator')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">{t('form.grossSalary')}</Label>
              <Input
                id="grossSalary"
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                placeholder="50000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxClass">{t('form.taxClass')}</Label>
              <Select value={taxClass} onValueChange={setTaxClass}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.taxClass')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class1">{t('taxClasses.class1')}</SelectItem>
                  <SelectItem value="class2">{t('taxClasses.class2')}</SelectItem>
                  <SelectItem value="class3">{t('taxClasses.class3')}</SelectItem>
                  <SelectItem value="class4">{t('taxClasses.class4')}</SelectItem>
                  <SelectItem value="class5">{t('taxClasses.class5')}</SelectItem>
                  <SelectItem value="class6">{t('taxClasses.class6')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={calculateTax} className="w-full">
            {t('form.calculate')}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              {t('results.breakdown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('grossSalary')}</div>
                <div className="text-2xl font-bold text-green-600">
                  {result.gross.toFixed(2)} €
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('netSalary')}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {result.netSalary.toFixed(2)} €
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('incomeTax')}</div>
                <div className="text-xl font-bold text-red-600">
                  {result.incomeTax.toFixed(2)} €
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('results.effectiveTaxRate')}</div>
                <div className="text-xl font-bold text-purple-600">
                  {result.effectiveTaxRate}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxCalculator;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Lightbulb, FileText, TrendingUp } from 'lucide-react';
import GermanTaxCalculator from './calculators/GermanTaxCalculator';
import TaxOptimizationTips from './optimization/TaxOptimizationTips';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const TaxOptimizer = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const { t } = useTranslation('common');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('taxOptimization') || 'Daňová optimalizace'}</h2>
        <p className="text-muted-foreground">
          {t('calculateTaxesFindSavings') || 'Vypočítejte své daně a najděte způsoby, jak ušetřit'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {t('taxCalculator') || 'Daňový kalkulátor'}
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            {t('optimization') || 'Optimalizace'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {t('accurateGermanTaxCalculation') || 'Přesný výpočet německé daně'}
                </span>
                <Badge variant="outline">{t('currentFor2024') || 'Aktuální pro 2024'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('calculateExactTaxLiabilityGerman2024') || 'Vypočítejte přesnou výši vaší daňové povinnosti podle německých daňových sazeb pro rok 2024.'}
              </p>
            </CardContent>
          </Card>
          
          <GermanTaxCalculator />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('taxSavingsTips') || 'Tipy pro daňové úspory'}
                </span>
                <Badge variant="secondary">{t('saveUp8000Yearly') || 'Ušetřete až 8000€ ročně'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('discoverLegalWaysReduceTaxBurden') || 'Objevte legální způsoby, jak snížit svou daňovou zátěž a maximalizovat čistý příjem.'}
              </p>
            </CardContent>
          </Card>
          
          <TaxOptimizationTips />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxOptimizer;

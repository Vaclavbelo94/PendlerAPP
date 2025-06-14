
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp, Euro } from 'lucide-react';
import { TaxWizardData, TaxCalculationResult } from '../types';

interface ResultsStepProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onExportPDF: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ data, result, onExportPDF }) => {
  return (
    <div className="space-y-6">
      {/* Hlavní výsledky */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Výsledky výpočtu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Celkové odpočty</div>
              <div className="text-2xl font-bold text-green-600">
                {result.totalDeductions.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Odhadovaná úspora</div>
              <div className="text-2xl font-bold text-blue-600">
                {result.estimatedTaxSaving.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Měsíční benefit</div>
              <div className="text-2xl font-bold text-purple-600">
                {result.monthlyBenefit.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Roční úspora</div>
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
            Detailní rozpis odpočtů
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Cestovní náhrady:</span>
              <Badge variant="outline">{result.reisepausaleBenefit.toFixed(2)} €</Badge>
            </div>
            
            {result.secondHomeBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Druhé bydlení:</span>
                <Badge variant="outline">{result.secondHomeBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.workClothesBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Pracovní oblečení:</span>
                <Badge variant="outline">{result.workClothesBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.educationBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Vzdělávání:</span>
                <Badge variant="outline">{result.educationBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.insuranceBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Pojištění:</span>
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
            Export dokumentu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Stáhněte si kompletní daňový dokument s všemi vypočítanými odpočty
            </p>
            <Button onClick={onExportPDF} size="lg" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Stáhnout PDF dokument
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsStep;

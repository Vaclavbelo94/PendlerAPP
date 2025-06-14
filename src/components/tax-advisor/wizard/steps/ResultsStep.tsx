
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Euro, TrendingUp, Calculator } from 'lucide-react';
import { TaxWizardData, TaxCalculationResult } from '../types';
import { useToast } from '@/hooks/use-toast';

interface ResultsStepProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onExportPDF: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ data, result, onExportPDF }) => {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleExport = () => {
    onExportPDF();
    toast({
      title: "PDF Export",
      description: "Daňový dokument je připraven ke stažení",
    });
  };

  return (
    <div className="space-y-6">
      {/* Hlavní výsledky */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Výsledky kalkulace
            </span>
            <Badge variant="outline">Pro rok 2024</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Odpočty */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Daňové odpočty</h4>
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
                
                {result.workClothesBenefit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pracovní oblečení:</span>
                    <span className="font-medium">{formatCurrency(result.workClothesBenefit)}</span>
                  </div>
                )}
                
                {result.educationBenefit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Vzdělávání:</span>
                    <span className="font-medium">{formatCurrency(result.educationBenefit)}</span>
                  </div>
                )}
                
                {result.insuranceBenefit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pojištění:</span>
                    <span className="font-medium">{formatCurrency(result.insuranceBenefit)}</span>
                  </div>
                )}
                
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Celkem odpočet:</span>
                  <span className="text-green-600">{formatCurrency(result.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Úspory */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Daňové úspory
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Odhadovaná úspora daně:</span>
                  <span className="font-medium">{formatCurrency(result.estimatedTaxSaving)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Měsíční benefit:</span>
                  <span className="font-medium">{formatCurrency(result.monthlyBenefit)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Roční benefit:</span>
                  <span className="text-green-600">{formatCurrency(result.estimatedTaxSaving)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Osobní údaje souhrn */}
      <Card>
        <CardHeader>
          <CardTitle>Shrnutí údajů</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Jméno:</span>
              <span className="font-medium ml-2">{data.personalInfo.firstName} {data.personalInfo.lastName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Zaměstnavatel:</span>
              <span className="font-medium ml-2">{data.employmentInfo.employerName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Roční příjem:</span>
              <span className="font-medium ml-2">{formatCurrency(data.employmentInfo.annualIncome)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Vzdálenost do práce:</span>
              <span className="font-medium ml-2">{data.reisepauschale.commuteDistance} km</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export pro daňového poradce
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Vygenerujte profesionální PDF dokument s kompletními údaji a výpočty pro vašeho daňového poradce.
            </p>
            
            <Button onClick={handleExport} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Stáhnout PDF pro daňového poradce
            </Button>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Obsah PDF:</strong> Osobní údaje, údaje o zaměstnání, detailní výpočty Reisepauschale, 
                další odpočty a doporučení pro optimalizaci daní podle německého práva.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsStep;

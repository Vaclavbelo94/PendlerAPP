
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Check, Download, Info } from "lucide-react";
import { toast } from "sonner";
import { ResultsDisplayProps } from './types';

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  currentResult,
  optimizedResult,
  savings,
  displayCurrency
}) => {
  const handleDownloadReport = () => {
    if (!currentResult) return;
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text("Zpráva o daňové optimalizaci", 105, 20, { align: 'center' });
      
      // Date
      const currentDate = new Date().toLocaleDateString('cs-CZ');
      doc.setFontSize(10);
      doc.text(`Datum: ${currentDate}`, 195, 10, { align: 'right' });
      
      // Input parameters section
      doc.setFontSize(14);
      doc.text("Základní údaje", 15, 40);
      
      // We don't have access to form values here, so just show results
      const basicData = [
        ['Hrubý příjem', `${currentResult.grossIncome.toFixed(2)} ${displayCurrency}`],
        ['Efektivní daňová sazba', `${(currentResult.effectiveTaxRate * 100).toFixed(2)}%`]
      ];
      
      autoTable(doc, {
        startY: 45,
        head: [['Parametr', 'Hodnota']],
        body: basicData,
        theme: 'grid',
        headStyles: { fillColor: [60, 60, 60] }
      });
      
      // Results table
      const resultsY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Výsledky výpočtu", 15, resultsY);
      
      const resultsData = [
        ['Hrubý příjem', `${currentResult.grossIncome.toFixed(2)} ${displayCurrency}`],
        ['Daň z příjmu', `${currentResult.taxAmount.toFixed(2)} ${displayCurrency}`],
        ['Sociální pojištění', `${currentResult.socialSecurity.toFixed(2)} ${displayCurrency}`],
        ['Zdravotní pojištění', `${currentResult.healthInsurance.toFixed(2)} ${displayCurrency}`],
        ['Čistý příjem', `${currentResult.netIncome.toFixed(2)} ${displayCurrency}`],
        ['Efektivní daňová sazba', `${(currentResult.effectiveTaxRate * 100).toFixed(2)}%`]
      ];
      
      autoTable(doc, {
        startY: resultsY + 5,
        head: [['Položka', 'Hodnota']],
        body: resultsData,
        theme: 'grid',
        headStyles: { fillColor: [60, 60, 60] }
      });
      
      // Optimized results if available
      if (optimizedResult) {
        const optimizedY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Výsledky s optimalizací", 15, optimizedY);
        
        const optimizedData = [
          ['Hrubý příjem po odečtení', `${optimizedResult.grossIncome.toFixed(2)} ${displayCurrency}`],
          ['Daň z příjmu', `${optimizedResult.taxAmount.toFixed(2)} ${displayCurrency}`],
          ['Sociální pojištění', `${optimizedResult.socialSecurity.toFixed(2)} ${displayCurrency}`],
          ['Zdravotní pojištění', `${optimizedResult.healthInsurance.toFixed(2)} ${displayCurrency}`],
          ['Čistý příjem', `${optimizedResult.netIncome.toFixed(2)} ${displayCurrency}`],
          ['Efektivní daňová sazba', `${(optimizedResult.effectiveTaxRate * 100).toFixed(2)}%`]
        ];
        
        autoTable(doc, {
          startY: optimizedY + 5,
          head: [['Položka', 'Hodnota']],
          body: optimizedData,
          theme: 'grid',
          headStyles: { fillColor: [60, 60, 60] }
        });
        
        // Savings calculation
        if (savings !== null) {
          const savingsY = (doc as any).lastAutoTable.finalY + 15;
          
          // Add highlight box for savings
          doc.setFillColor(230, 247, 230);
          doc.rect(15, savingsY, 180, 25, 'F');
          
          doc.setFontSize(14);
          doc.text("Celková úspora na dani", 20, savingsY + 10);
          
          doc.setFontSize(16);
          doc.setTextColor(0, 128, 0);
          doc.text(`${savings.toFixed(2)} ${displayCurrency}`, 20, savingsY + 20);
          doc.setTextColor(0, 0, 0);
        }
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Pendler Buddy - Zpráva o daňové optimalizaci | Strana ${i} z ${pageCount}`, 105, 285, { align: 'center' });
      }
      
      // Save the document
      const currentDateStr = new Date().toISOString().split('T')[0];
      doc.save(`Daňová_optimalizace_${currentDateStr}.pdf`);
      
      toast.success("Zpráva byla úspěšně stažena");
    } catch (error) {
      console.error("Chyba při vytváření PDF:", error);
      toast.error("Při stahování zprávy došlo k chybě");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-medium">Výsledky výpočtu</h3>
        <Button
          variant="outline"
          onClick={handleDownloadReport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Stáhnout zprávu
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic calculation */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Základní výpočet</CardTitle>
            <CardDescription>Bez optimalizace</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-100">
              <div className="grid grid-cols-2 py-2">
                <dt className="text-sm font-medium">Hrubý příjem:</dt>
                <dd className="text-sm text-right font-medium">
                  {currentResult.grossIncome.toFixed(2)} {displayCurrency}
                </dd>
              </div>
              <div className="grid grid-cols-2 py-2">
                <dt className="text-sm font-medium">Daň z příjmu:</dt>
                <dd className="text-sm text-right font-medium text-destructive">
                  -{currentResult.taxAmount.toFixed(2)} {displayCurrency}
                </dd>
              </div>
              <div className="grid grid-cols-2 py-2">
                <dt className="text-sm font-medium">Sociální pojištění:</dt>
                <dd className="text-sm text-right font-medium text-destructive">
                  -{currentResult.socialSecurity.toFixed(2)} {displayCurrency}
                </dd>
              </div>
              <div className="grid grid-cols-2 py-2">
                <dt className="text-sm font-medium">Zdravotní pojištění:</dt>
                <dd className="text-sm text-right font-medium text-destructive">
                  -{currentResult.healthInsurance.toFixed(2)} {displayCurrency}
                </dd>
              </div>
              <div className="grid grid-cols-2 py-2">
                <dt className="text-base font-semibold">Čistý příjem:</dt>
                <dd className="text-base text-right font-bold text-green-600">
                  {currentResult.netIncome.toFixed(2)} {displayCurrency}
                </dd>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground text-center">
                  Efektivní daňová sazba: {(currentResult.effectiveTaxRate * 100).toFixed(2)}%
                </p>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        {/* Optimized calculation */}
        {optimizedResult ? (
          <Card className="border border-green-200 bg-green-50/40">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">S optimalizací</CardTitle>
                  <CardDescription>Včetně odpočitatelných položek</CardDescription>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-100">
                <div className="grid grid-cols-2 py-2">
                  <dt className="text-sm font-medium">Hrubý příjem po odečtení:</dt>
                  <dd className="text-sm text-right font-medium">
                    {optimizedResult.grossIncome.toFixed(2)} {displayCurrency}
                  </dd>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <dt className="text-sm font-medium">Daň z příjmu:</dt>
                  <dd className="text-sm text-right font-medium text-destructive">
                    -{optimizedResult.taxAmount.toFixed(2)} {displayCurrency}
                  </dd>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <dt className="text-sm font-medium">Sociální pojištění:</dt>
                  <dd className="text-sm text-right font-medium text-destructive">
                    -{optimizedResult.socialSecurity.toFixed(2)} {displayCurrency}
                  </dd>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <dt className="text-sm font-medium">Zdravotní pojištění:</dt>
                  <dd className="text-sm text-right font-medium text-destructive">
                    -{optimizedResult.healthInsurance.toFixed(2)} {displayCurrency}
                  </dd>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <dt className="text-base font-semibold">Čistý příjem:</dt>
                  <dd className="text-base text-right font-bold text-green-600">
                    {optimizedResult.netIncome.toFixed(2)} {displayCurrency}
                  </dd>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Efektivní daňová sazba: {(optimizedResult.effectiveTaxRate * 100).toFixed(2)}%
                  </p>
                </div>
              </dl>
            </CardContent>
          </Card>
        ) : (
          <Alert className="bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertTitle>Zadejte odpočitatelné položky</AlertTitle>
            <AlertDescription>
              Pro výpočet potenciální úspory doplňte údaje o odpočitatelných položkách jako
              je dojíždění, náklady na bydlení nebo pracovní pomůcky.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {/* Savings summary */}
      {savings !== null && savings > 0 && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mt-4">
          <div className="text-center">
            <h4 className="text-lg font-medium text-green-800 mb-2">
              Potenciální úspora na dani
            </h4>
            <p className="text-3xl font-bold text-green-600">
              {savings.toFixed(2)} {displayCurrency}
            </p>
            <p className="text-sm text-green-700 mt-2">
              S odpočitatelnými položkami můžete ročně ušetřit až tuto částku na dani z příjmu.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;

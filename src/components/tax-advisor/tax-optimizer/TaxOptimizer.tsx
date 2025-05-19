
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import TaxCalculatorForm from "./TaxCalculatorForm";
import ResultsDisplay from "./ResultsDisplay";
import TaxOptimizationTips from "./TaxOptimizationTips";
import { FormData, TaxResult } from "./types";
import { useTaxCalculator } from "@/hooks/useTaxCalculator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";

const TaxOptimizer = () => {
  const [displayCurrency, setDisplayCurrency] = useState("€");
  const [currentResult, setCurrentResult] = useState<TaxResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<TaxResult | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const { calculateTax } = useTaxCalculator();
  const isMobile = useMediaQuery("xs");
  const { toast } = useToast();

  const handleCountryChange = (country: string) => {
    setDisplayCurrency(country === "de" ? "€" : "Kč");
  };

  const handleCalculate = (data: FormData) => {
    try {
      // Calculate current tax situation
      const grossIncome = parseFloat(data.income);
      const currentTaxResult = calculateTax(grossIncome, {
        country: data.country,
        taxClass: data.taxClass,
        children: data.children ? parseInt(data.children) : 0,
        married: data.married,
        church: data.church
      });

      // Set current result
      if (currentTaxResult) {
        setCurrentResult(currentTaxResult);
      }

      // Calculate optimized tax situation
      const commuteCosts = calculateCommuteCosts(data);
      const otherDeductions = calculateOtherDeductions(data);
      const totalDeductions = commuteCosts + otherDeductions;
      
      // Apply deductions to calculate optimized tax
      const optimizedGrossForTax = Math.max(0, grossIncome - totalDeductions);
      const optimizedTaxResult = calculateTax(optimizedGrossForTax, {
        country: data.country,
        taxClass: data.taxClass,
        children: data.children ? parseInt(data.children) : 0,
        married: data.married,
        church: data.church
      });

      // Calculate savings and set optimized result
      if (currentTaxResult && optimizedTaxResult) {
        // Adjust the net income to account for the original gross income
        const adjustedOptimizedResult = {
          ...optimizedTaxResult,
          grossIncome: currentTaxResult.grossIncome, // Keep same gross for proper comparison
        };
        
        const calculatedSavings = adjustedOptimizedResult.netIncome - currentTaxResult.netIncome;
        
        setOptimizedResult(adjustedOptimizedResult);
        setSavings(calculatedSavings);
        
        // Show success toast
        toast({
          title: "Výpočet proběhl úspěšně",
          description: `Potenciální úspora: ${calculatedSavings.toFixed(2)} ${displayCurrency}`,
          variant: calculatedSavings > 0 ? "default" : "destructive"
        });
        
        // Na mobilních zařízeních rolovat na výsledky
        if (isMobile && calculatedSavings > 0) {
          setTimeout(() => {
            const resultsElement = document.getElementById('tax-results');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      }
    } catch (error) {
      console.error("Chyba při výpočtu daní:", error);
      toast({
        title: "Chyba při výpočtu",
        description: "Došlo k chybě při výpočtu daní. Zkontrolujte zadané hodnoty.",
        variant: "destructive"
      });
    }
  };

  // Helper function to calculate commute costs based on form data
  const calculateCommuteCosts = (data: FormData): number => {
    if (!data.commuteDistance || !data.workDays) return 0;
    
    const distance = parseInt(data.commuteDistance);
    const workDays = parseInt(data.workDays);
    
    if (isNaN(distance) || isNaN(workDays) || distance <= 0 || workDays <= 0) return 0;
    
    // German tax rules: 0.30€ per km for first 20km, 0.38€ per km above that
    let commuteCosts = 0;
    if (distance <= 20) {
      commuteCosts = distance * 0.30 * workDays;
    } else {
      commuteCosts = (20 * 0.30 + (distance - 20) * 0.38) * workDays;
    }
    
    return commuteCosts;
  };

  // Helper function to calculate other deductions
  const calculateOtherDeductions = (data: FormData): number => {
    let totalDeductions = 0;
    
    // Housing costs
    if (data.housingCosts) {
      const housingCosts = parseFloat(data.housingCosts);
      if (!isNaN(housingCosts) && housingCosts > 0) {
        // Max 12,000€ per year for housing costs in Germany
        totalDeductions += Math.min(housingCosts, 12000);
      }
    }
    
    // Work equipment
    if (data.workEquipment) {
      const workEquipment = parseFloat(data.workEquipment);
      if (!isNaN(workEquipment) && workEquipment > 0) {
        totalDeductions += workEquipment;
      }
    }
    
    // Insurance
    if (data.insurance) {
      const insurance = parseFloat(data.insurance);
      if (!isNaN(insurance) && insurance > 0) {
        totalDeductions += insurance;
      }
    }
    
    // Other expenses
    if (data.otherExpenses) {
      const otherExpenses = parseFloat(data.otherExpenses);
      if (!isNaN(otherExpenses) && otherExpenses > 0) {
        totalDeductions += otherExpenses;
      }
    }
    
    return totalDeductions;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Daňová optimalizace pro pendlery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Tento nástroj vám pomůže optimalizovat vaše daňové zatížení při práci v Německu.
              Vyplňte formulář níže a zjistěte, kolik můžete ušetřit na daních.
            </AlertDescription>
          </Alert>
          
          <TaxCalculatorForm 
            onCalculate={handleCalculate}
            onCountryChange={handleCountryChange}
            displayCurrency={displayCurrency}
          />
          
          {currentResult && (
            <div className="mt-8 pt-4" id="tax-results">
              <Separator className="mb-6" />
              <ResultsDisplay 
                currentResult={currentResult}
                optimizedResult={optimizedResult}
                savings={savings}
                displayCurrency={displayCurrency}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <TaxOptimizationTips />
    </div>
  );
};

export default TaxOptimizer;

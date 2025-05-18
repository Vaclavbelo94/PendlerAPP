
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserProfileData } from '@/utils/tax';
import { toast } from "sonner";
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import TaxCalculatorForm from './TaxCalculatorForm';
import TaxOptimizationTips from './TaxOptimizationTips';
import ResultsDisplay from './ResultsDisplay';
import { FormData, TaxResult } from './types';

const TaxOptimizer = () => {
  const { user } = useAuth();
  const { calculateTax } = useTaxCalculator();
  const [displayCurrency, setDisplayCurrency] = useState<string>("EUR");
  const [currentResult, setCurrentResult] = useState<TaxResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<TaxResult | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  
  // Handle form submission and calculations
  const handleCalculate = (data: FormData) => {
    try {
      const incomeValue = parseFloat(data.income);
      if (isNaN(incomeValue) || incomeValue <= 0) {
        toast.error("Zadejte platnou výši příjmu");
        return;
      }
      
      // Basic calculation without deductions
      const basicResult = calculateTax(incomeValue, {
        country: data.country,
        taxClass: data.taxClass,
        children: parseInt(data.children),
        married: data.married,
        church: data.church,
      });
      
      setCurrentResult(basicResult);
      
      // Calculate with optimizations if deductions provided
      let totalDeductions = 0;
      
      // Calculate commute deductions
      if (data.commuteDistance && data.workDays) {
        const commuteDistance = parseFloat(data.commuteDistance);
        const workDays = parseFloat(data.workDays);
        
        if (!isNaN(commuteDistance) && !isNaN(workDays) && commuteDistance > 0 && workDays > 0) {
          // Calculate using the progressive rate (0.30€ for first 20km, 0.38€ for additional km)
          let commuteDeduction = 0;
          if (commuteDistance <= 20) {
            commuteDeduction = commuteDistance * 0.30 * workDays;
          } else {
            commuteDeduction = (20 * 0.30 * workDays) + ((commuteDistance - 20) * 0.38 * workDays);
          }
          totalDeductions += commuteDeduction;
        }
      }
      
      // Add other deductions
      ["housingCosts", "workEquipment", "insurance", "otherExpenses"].forEach(field => {
        const value = parseFloat(data[field as keyof typeof data] as string);
        if (!isNaN(value) && value > 0) {
          totalDeductions += value;
        }
      });
      
      // Calculate optimized taxes if deductions exist
      if (totalDeductions > 0) {
        // Apply deductions to taxable income
        const optimizedIncome = Math.max(0, incomeValue - totalDeductions);
        
        const optimizedCalc = calculateTax(optimizedIncome, {
          country: data.country,
          taxClass: data.taxClass,
          children: parseInt(data.children),
          married: data.married,
          church: data.church,
        });
        
        setOptimizedResult(optimizedCalc);
        
        // Calculate savings (difference in tax amount)
        if (basicResult && optimizedCalc) {
          const taxSavings = basicResult.taxAmount - optimizedCalc.taxAmount;
          setSavings(taxSavings);
          
          // Show toast with savings
          toast.success(`Potenciální úspora na dani: ${taxSavings.toFixed(2)} ${displayCurrency}`);
        }
      } else {
        setOptimizedResult(null);
        setSavings(null);
      }
    } catch (error) {
      console.error('Chyba při výpočtu optimalizace daní:', error);
      toast.error("Došlo k chybě při výpočtu");
    }
  };

  // Handle currency display based on country
  const handleCountryChange = (country: string) => {
    if (country === "de") {
      setDisplayCurrency("EUR");
    } else if (country === "cz") {
      setDisplayCurrency("CZK");
    }
  };

  // Load user profile data if available
  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        try {
          const profileData = await fetchUserProfileData(user.id);
          return profileData?.commuteDistance || '';
        } catch (error) {
          console.error("Error loading profile data:", error);
          return '';
        }
      };
      
      loadUserProfile();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daňová optimalizace</CardTitle>
          <CardDescription>
            Spočítejte si potenciální úsporu na daních s využitím odpočitatelných položek
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator">
            <TabsList className="mb-4">
              <TabsTrigger value="calculator">Kalkulačka</TabsTrigger>
              <TabsTrigger value="tips">Tipy na optimalizaci</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <TaxCalculatorForm 
                onCalculate={handleCalculate}
                onCountryChange={handleCountryChange}
                displayCurrency={displayCurrency}
              />
              
              {/* Results section */}
              {currentResult && (
                <div className="mt-8 space-y-6">
                  <Separator />
                  
                  <ResultsDisplay
                    currentResult={currentResult}
                    optimizedResult={optimizedResult}
                    savings={savings}
                    displayCurrency={displayCurrency}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tips">
              <TaxOptimizationTips />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxOptimizer;


import React, { useState } from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import BasicCalculator from "@/components/calculator/BasicCalculator";
import ScientificCalculator from "@/components/calculator/ScientificCalculator";
import TaxCalculator from "@/components/calculator/TaxCalculator";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalculatorIcon, TrendingUp, CreditCard, BarChart3, Square } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAmortizationSchedule } from '@/hooks/useAmortizationSchedule';
import AmortizationTable from '@/components/calculator/AmortizationTable';

const Calculator = () => {
  // Check if we're on a mobile device
  const isMobile = useMediaQuery("xs");
  const [loanAmount, setLoanAmount] = useState<string>("100000");
  const [interestRate, setInterestRate] = useState<string>("5");
  const [loanTerm, setLoanTerm] = useState<string>("12");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  
  const { schedule, calculateAmortizationSchedule } = useAmortizationSchedule();
  
  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm);
    
    if (principal > 0 && rate > 0 && months > 0) {
      const payment = (principal * rate) / (1 - Math.pow(1 + rate, -months));
      setMonthlyPayment(payment);
      
      // Calculate amortization schedule
      calculateAmortizationSchedule(principal, rate, months, payment);
    } else {
      setMonthlyPayment(null);
    }
  };
  
  return (
    <PremiumCheck featureKey="calculator">
      <ResponsiveContainer className="py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Kalkulačky</h1>
        
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 md:w-auto md:inline-flex">
            <TabsTrigger value="basic" className="flex items-center gap-2 text-sm md:text-base py-2 px-3 md:py-2 md:px-4">
              <CalculatorIcon className="h-4 w-4" />
              <span className={isMobile ? "hidden" : ""}>Základní</span>
            </TabsTrigger>
            <TabsTrigger value="scientific" className="flex items-center gap-2 text-sm md:text-base py-2 px-3 md:py-2 md:px-4">
              <Square className="h-4 w-4" />
              <span className={isMobile ? "hidden" : ""}>Vědecká</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2 text-sm md:text-base py-2 px-3 md:py-2 md:px-4">
              <CreditCard className="h-4 w-4" />
              <span className={isMobile ? "hidden" : ""}>Finanční</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2 text-sm md:text-base py-2 px-3 md:py-2 md:px-4">
              <TrendingUp className="h-4 w-4" />
              <span className={isMobile ? "hidden" : ""}>Daňová</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-4 md:mt-6">
            <BasicCalculator />
          </TabsContent>
          
          <TabsContent value="scientific" className="mt-4 md:mt-6">
            <ScientificCalculator />
          </TabsContent>
          
          <TabsContent value="financial" className="mt-4 md:mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Kalkulačka splátek půjčky</CardTitle>
                <CardDescription>Spočítejte si měsíční splátku vaší půjčky</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Výše půjčky (Kč)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Úroková sazba (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    min="0.01"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Doba splácení (měsíce)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    min="1"
                  />
                </div>
                
                <Button 
                  onClick={calculateMonthlyPayment}
                  className="w-full mt-2"
                >
                  Vypočítat
                </Button>
                
                {monthlyPayment !== null && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p className="text-center">
                      <span className="block text-sm text-muted-foreground mb-1">Měsíční splátka:</span>
                      <span className="text-2xl font-bold">{monthlyPayment.toFixed(2)} Kč</span>
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setShowAmortization(!showAmortization)}
                    >
                      {showAmortization ? 'Skrýt splátkový kalendář' : 'Zobrazit splátkový kalendář'}
                    </Button>
                    
                    {showAmortization && schedule.length > 0 && (
                      <div className="mt-4 overflow-hidden">
                        <AmortizationTable schedule={schedule} />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tax" className="mt-4 md:mt-6">
            <TaxCalculator />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default Calculator;

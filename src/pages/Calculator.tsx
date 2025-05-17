
import React from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import BasicCalculator from "@/components/calculator/BasicCalculator";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalculatorIcon, TrendingUp, BarChart3 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

const Calculator = () => {
  // Check if we're on a mobile device
  const isMobile = useMediaQuery("xs");
  
  return (
    <PremiumCheck featureKey="calculator">
      <ResponsiveContainer className="py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Kalkulačky</h1>
        
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="w-full grid grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="basic" className="flex items-center gap-2 text-sm md:text-base py-2 px-3 md:py-2 md:px-4">
              <CalculatorIcon className="h-4 w-4" />
              <span className={isMobile ? "hidden" : ""}>Základní</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2 text-sm md:text-base py-2 px-3 md:py-2 md:px-4">
              <TrendingUp className="h-4 w-4" />
              <span className={isMobile ? "hidden" : ""}>Daňová</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-4 md:mt-6">
            <BasicCalculator />
          </TabsContent>
          
          <TabsContent value="tax" className="mt-4 md:mt-6">
            <div className="flex flex-col space-y-6">
              <div className="p-4 md:p-8 bg-muted rounded-lg flex flex-col items-center justify-center text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Daňová kalkulačka</h3>
                <p className="text-muted-foreground">
                  Rozšířená daňová kalkulačka bude dostupná v příští aktualizaci aplikace.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default Calculator;

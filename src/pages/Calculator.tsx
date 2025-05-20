
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScientificCalculator from "@/components/calculator/ScientificCalculator";
import BasicCalculator from "@/components/calculator/BasicCalculator";
import TaxCalculator from "@/components/calculator/TaxCalculator";
import CrossBorderTaxCalculator from "@/components/calculator/CrossBorderTaxCalculator";
import { Calculator, BadgePercent, Calculator as CalcIcon, Brain } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useMediaQuery } from "@/hooks/use-media-query";

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const isMobile = useMediaQuery("xs");
  
  return (
    <PremiumCheck featureKey="calculators">
      <ResponsiveContainer className="py-4 sm:py-6">
        <Helmet>
          <title>Kalkulačky | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Kalkulačky</h1>
        <div className="mb-3 sm:mb-5">
          <p className="text-sm sm:text-base text-muted-foreground">
            Všechny kalkulačky, které potřebujete jako pendler pracující v Německu. Daňové kalkulačky, převod měn a více.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4">
          <TabsList className="bg-muted/60 p-0.5 h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger 
              value="basic" 
              className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs"
            >
              <CalcIcon className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span>Základní</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scientific" 
              className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs"
            >
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span>Vědecká</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tax" 
              className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs"
            >
              <BadgePercent className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span>Daňová</span>
            </TabsTrigger>
            <TabsTrigger 
              value="border" 
              className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs"
            >
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span>Přeshraniční</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicCalculator />
          </TabsContent>

          <TabsContent value="scientific">
            <ScientificCalculator />
          </TabsContent>

          <TabsContent value="tax">
            <TaxCalculator />
          </TabsContent>
          
          <TabsContent value="border">
            <CrossBorderTaxCalculator />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default CalculatorPage;

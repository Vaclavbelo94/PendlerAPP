
import React from 'react';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScientificCalculator from "@/components/calculator/ScientificCalculator";
import BasicCalculator from "@/components/calculator/BasicCalculator";
import TaxCalculator from "@/components/calculator/TaxCalculator";
import CrossBorderTaxCalculator from "@/components/calculator/CrossBorderTaxCalculator";
import { Calculator, BadgePercent, Calculator as CalcIcon, Brain } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";

const CalculatorPage = () => {
  return (
    <PremiumCheck featureKey="calculators">
      <div className="container py-6">
        <Helmet>
          <title>Kalkulačky | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Kalkulačky</h1>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Všechny kalkulačky, které potřebujete jako pendler pracující v Německu. Daňové kalkulačky, převod měn a více.
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <CalcIcon className="h-4 w-4" /> Základní kalkulačka
            </TabsTrigger>
            <TabsTrigger value="scientific" className="flex items-center gap-2">
              <Brain className="h-4 w-4" /> Vědecká kalkulačka
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4" /> Daňová kalkulačka
            </TabsTrigger>
            <TabsTrigger value="border" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Přeshraniční daňová kalkulačka
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
      </div>
    </PremiumCheck>
  );
};

export default CalculatorPage;

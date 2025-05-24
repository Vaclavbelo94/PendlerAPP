
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CalculatorIcon,
  PiggyBankIcon,
  TrendingUpIcon,
  FileTextIcon,
  FunctionSquareIcon
} from "lucide-react";

// Import existing components
import BasicCalculator from "@/components/calculator/BasicCalculator";
import TaxCalculator from "@/components/calculator/TaxCalculator";
import CrossBorderTaxCalculator from "@/components/calculator/CrossBorderTaxCalculator";
import AmortizationTable from "@/components/calculator/AmortizationTable";
import ScientificCalculator from "@/components/calculator/ScientificCalculator";

const Calculator = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const isMobile = useIsMobile();

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Kalkulačky</h1>
        <p className="text-muted-foreground">
          Užitečné kalkulátory pro práci i osobní finance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} ${isMobile ? 'max-w-full' : 'max-w-5xl'} h-auto`}>
          <TabsTrigger value="basic" className="flex flex-col items-center gap-1 py-3 px-4">
            <CalculatorIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Základní</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Běžné výpočty</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex flex-col items-center gap-1 py-3 px-4">
            <FileTextIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Daně</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Daňové výpočty</span>
          </TabsTrigger>
          <TabsTrigger value="crossborder" className="flex flex-col items-center gap-1 py-3 px-4">
            <TrendingUpIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Zahraniční</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Hraniční práce</span>
          </TabsTrigger>
          <TabsTrigger value="amortization" className="flex flex-col items-center gap-1 py-3 px-4">
            <PiggyBankIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Úvěry</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Splátkové tabulky</span>
          </TabsTrigger>
          <TabsTrigger value="scientific" className="flex flex-col items-center gap-1 py-3 px-4">
            <FunctionSquareIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Vědecká</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Pokročilé funkce</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <BasicCalculator />
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <TaxCalculator />
        </TabsContent>

        <TabsContent value="crossborder" className="space-y-6">
          <CrossBorderTaxCalculator />
        </TabsContent>

        <TabsContent value="amortization" className="space-y-6">
          <AmortizationTable />
        </TabsContent>

        <TabsContent value="scientific" className="space-y-6">
          <ScientificCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculator;

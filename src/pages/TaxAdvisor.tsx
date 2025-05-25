
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import PremiumCheck from '@/components/premium/PremiumCheck';
import {
  FileTextIcon,
  TrendingUpIcon,
  BookOpenIcon,
  CalculatorIcon
} from "lucide-react";

// Import existing components
import TaxOptimizer from "@/components/tax-advisor/TaxOptimizer";
import DocumentGenerator from "@/components/tax-advisor/DocumentGenerator";
import TaxReturnGuide from "@/components/tax-advisor/TaxReturnGuide";
import TaxCalculatorTab from "@/components/tax-advisor/TaxCalculatorTab";

const TaxAdvisor = () => {
  const [activeTab, setActiveTab] = useState("optimizer");
  const isMobile = useIsMobile();

  return (
    <PremiumCheck featureKey="tax-advisor">
      <div className="container py-6 md:py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daňový poradce</h1>
          <p className="text-muted-foreground">
            Optimalizujte své daně a spravujte daňové dokumenty
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} ${isMobile ? 'max-w-full' : 'max-w-4xl'} h-auto`}>
            <TabsTrigger value="optimizer" className="flex flex-col items-center gap-1 py-3 px-4">
              <TrendingUpIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Optimalizace</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Daňové tipy</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex flex-col items-center gap-1 py-3 px-4">
              <FileTextIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Dokumenty</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Generátor PDF</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex flex-col items-center gap-1 py-3 px-4">
              <BookOpenIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Průvodce</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Daňové přiznání</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex flex-col items-center gap-1 py-3 px-4">
              <CalculatorIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Kalkulátor</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Rychlé výpočty</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer" className="space-y-6">
            <TaxOptimizer />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentGenerator />
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <TaxReturnGuide />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <TaxCalculatorTab />
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TaxAdvisor;


import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import TaxReturnGuide from "@/components/tax-advisor/TaxReturnGuide";
import TaxOptimizer from "@/components/tax-advisor/TaxOptimizer";
import DocumentGenerator from "@/components/tax-advisor/DocumentGenerator";

const TaxAdvisor = () => {
  const navigate = useNavigate();

  return (
    <PremiumCheck featureKey="tax-advisor">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Daňový poradce</h1>
          <p className="text-muted-foreground">
            Komplexní nástroje pro správu daňových záležitostí v Německu pro přeshraniční pracovníky
          </p>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Průvodce daňovým přiznáním
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Optimalizace daní
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileSearch className="w-4 h-4" />
              Generátor dokumentů
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <TaxReturnGuide />
          </TabsContent>

          <TabsContent value="optimizer">
            <TaxOptimizer />
          </TabsContent>

          <TabsContent value="generator">
            <DocumentGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TaxAdvisor;


import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import PremiumCheck from '@/components/premium/PremiumCheck';
import TaxAdvisorNavigation from "@/components/tax-advisor/TaxAdvisorNavigation";

// Import existing components
import TaxOptimizer from "@/components/tax-advisor/TaxOptimizer";
import DocumentGenerator from "@/components/tax-advisor/DocumentGenerator";
import TaxReturnGuide from "@/components/tax-advisor/TaxReturnGuide";
import TaxCalculatorTab from "@/components/tax-advisor/TaxCalculatorTab";

const TaxAdvisor = () => {
  const [activeTab, setActiveTab] = useState("optimizer");

  const renderTabContent = () => {
    switch (activeTab) {
      case "optimizer":
        return <TaxOptimizer />;
      case "documents":
        return <DocumentGenerator />;
      case "guide":
        return <TaxReturnGuide />;
      case "calculator":
        return <TaxCalculatorTab />;
      default:
        return <TaxOptimizer />;
    }
  };

  return (
    <PremiumCheck featureKey="tax-advisor">
      <div className="container py-6 md:py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daňový poradce</h1>
          <p className="text-muted-foreground">
            Optimalizujte své daně a spravujte daňové dokumenty
          </p>
        </div>

        <TaxAdvisorNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </PremiumCheck>
  );
};

export default TaxAdvisor;

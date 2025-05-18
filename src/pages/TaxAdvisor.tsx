
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, FileSearch, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import TaxReturnGuide from "@/components/tax-advisor/TaxReturnGuide";
import TaxOptimizer from "@/components/tax-advisor/TaxOptimizer";
import DocumentGenerator from "@/components/tax-advisor/DocumentGenerator";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const TaxAdvisor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("guide");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <PremiumCheck featureKey="tax-advisor">
      <div className="container py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Daňový poradce</h1>
            <p className="text-muted-foreground max-w-3xl">
              Komplexní nástroje pro správu daňových záležitostí v Německu pro přeshraniční pracovníky.
              Získejte informace o daňovém přiznání, optimalizujte své daně a generujte potřebné dokumenty.
            </p>
          </div>
        </div>

        <Tabs 
          defaultValue="guide" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Průvodce
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Optimalizace
              </TabsTrigger>
              <TabsTrigger value="generator" className="flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                Generátor dokumentů
              </TabsTrigger>
            </TabsList>
            
            {user && (
              <div className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="text-sm"
                >
                  Spravovat osobní údaje
                </Button>
              </div>
            )}
          </div>
          
          <Separator className="mb-6" />

          <TabsContent value="guide">
            <TaxReturnGuide />
          </TabsContent>

          <TabsContent value="optimizer">
            <TaxOptimizer />
          </TabsContent>

          <TabsContent value="generator">
            <DocumentGenerator />
          </TabsContent>
          
          {/* Mobile profile button */}
          {user && activeTab === "generator" && (
            <div className="mt-6 flex sm:hidden">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/profile")}
              >
                Spravovat osobní údaje
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TaxAdvisor;

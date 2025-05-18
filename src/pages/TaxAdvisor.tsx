
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, FileSearch, ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import TaxReturnGuide from "@/components/tax-advisor/TaxReturnGuide";
import TaxOptimizer from "@/components/tax-advisor/TaxOptimizer";
import DocumentGenerator from "@/components/tax-advisor/DocumentGenerator";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const TaxAdvisor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("guide");
  const isMobile = useMediaQuery("xs");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <PremiumCheck featureKey="tax-advisor">
      <ResponsiveContainer className="py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zpět
            </Button>

            {isMobile && user && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:max-w-sm">
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-medium">Možnosti</h3>
                    <Button 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/profile");
                        setIsSheetOpen(false);
                      }}
                    >
                      Spravovat osobní údaje
                    </Button>
                    {/* Zde můžete přidat další možnosti */}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Daňový poradce</h1>
            <p className="text-muted-foreground max-w-3xl text-sm md:text-base">
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
          {/* Na mobilech používáme vertikální uspořádání záložek */}
          {isMobile ? (
            <TabsList className="flex mb-4 overflow-x-auto no-scrollbar">
              <TabsTrigger value="guide" className="flex-1 py-2 px-3">
                <div className="flex flex-col items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Průvodce</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="flex-1 py-2 px-3">
                <div className="flex flex-col items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  <span className="text-xs">Optimalizace</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="generator" className="flex-1 py-2 px-3">
                <div className="flex flex-col items-center gap-1">
                  <FileSearch className="w-4 h-4" />
                  <span className="text-xs">Generátor</span>
                </div>
              </TabsTrigger>
            </TabsList>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="text-sm"
                >
                  Spravovat osobní údaje
                </Button>
              )}
            </div>
          )}
          
          <Separator className="mb-4 md:mb-6" />

          <TabsContent value="guide" className="pt-2">
            <TaxReturnGuide />
          </TabsContent>

          <TabsContent value="optimizer" className="pt-2">
            <TaxOptimizer />
          </TabsContent>

          <TabsContent value="generator" className="pt-2">
            <DocumentGenerator />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default TaxAdvisor;

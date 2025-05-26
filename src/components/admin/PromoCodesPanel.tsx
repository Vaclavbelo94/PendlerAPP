import { useState, useEffect } from "react";
import { useStandardizedToast } from "@/hooks/useStandardizedToast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromoCodeDialog } from "./promoCode/PromoCodeDialog";
import { PromoCodesTable } from "./promoCode/PromoCodesTable";
import { EmptyState } from "./promoCode/EmptyState";
import { PromoCodeAnalyticsDashboard } from "./promoCode/analytics/PromoCodeAnalyticsDashboard";
import { PromoCode } from "./promoCode/types";
import {
  fetchPromoCodes,
  deletePromoCode,
  updatePromoCode,
  migratePromoCodesFromLocalStorage
} from "./promoCode/promoCodeService";

export const PromoCodesPanel = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");
  const { success: showSuccess, error: showError } = useStandardizedToast();

  useEffect(() => {
    const loadPromoCodesData = async () => {
      setIsLoading(true);
      try {
        // First check if we need to migrate data from localStorage
        const localData = localStorage.getItem("promoCodes");
        if (localData) {
          const migrated = await migratePromoCodesFromLocalStorage();
          if (migrated) {
            showSuccess("Úspěšně jsme přenesli vaše promo kódy");
          }
        }

        // Then load from Supabase
        const codes = await fetchPromoCodes();
        setPromoCodes(codes);
      } catch (error) {
        console.error("Chyba při načítání promo kódů:", error);
        showError("Nepodařilo se načíst promo kódy");
      } finally {
        setIsLoading(false);
      }
    };

    loadPromoCodesData();
  }, [showSuccess, showError]);

  const handleCreatePromoCode = (newCode: PromoCode) => {
    setPromoCodes(prevCodes => [newCode, ...prevCodes]);
  };

  const handleDeletePromoCode = async (id: string) => {
    const success = await deletePromoCode(id);
    if (success) {
      setPromoCodes(prevCodes => prevCodes.filter(code => code.id !== id));
      showSuccess("Promo kód byl úspěšně smazán");
    }
  };

  const resetUsageCount = async (id: string) => {
    const promoCode = promoCodes.find(code => code.id === id);
    if (!promoCode) return;

    const updatedCode = await updatePromoCode(id, { usedCount: 0 });
    if (updatedCode) {
      setPromoCodes(prevCodes =>
        prevCodes.map(code => (code.id === id ? updatedCode : code))
      );
      showSuccess("Počet použití byl resetován");
    }
  };

  const extendValidity = async (id: string) => {
    const promoCode = promoCodes.find(code => code.id === id);
    if (!promoCode) return;

    const newValidUntil = new Date();
    newValidUntil.setMonth(newValidUntil.getMonth() + 3); // Extend by 3 months

    const updatedCode = await updatePromoCode(id, { validUntil: newValidUntil.toISOString() });
    if (updatedCode) {
      setPromoCodes(prevCodes =>
        prevCodes.map(code => (code.id === id ? updatedCode : code))
      );
      showSuccess("Platnost promo kódu byla prodloužena");
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="manage">Správa kódů</TabsTrigger>
            <TabsTrigger value="analytics">Analytika</TabsTrigger>
          </TabsList>
          
          {activeTab === "manage" && (
            <Button onClick={() => setShowDialog(true)}>
              Vytvořit nový kód
            </Button>
          )}
        </div>

        <TabsContent value="manage" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Načítání promo kódů...</p>
              </div>
            </div>
          ) : promoCodes.length === 0 ? (
            <EmptyState onCreateClick={() => setShowDialog(true)} />
          ) : (
            <PromoCodesTable 
              promoCodes={promoCodes}
              onResetUsage={resetUsageCount}
              onExtendValidity={extendValidity}
              onDelete={handleDeletePromoCode}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <PromoCodeAnalyticsDashboard />
        </TabsContent>
      </Tabs>

      <PromoCodeDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        onCreatePromoCode={handleCreatePromoCode}
      />
    </div>
  );
};

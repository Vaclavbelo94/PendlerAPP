
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");
  const { success: showSuccess, error: showError } = useStandardizedToast();
  
  // Use ref to track if component is mounted and prevent multiple simultaneous loads
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);

  const loadPromoCodesData = useCallback(async () => {
    // Prevent multiple simultaneous loading attempts
    if (isLoadingRef.current || !isMountedRef.current) {
      console.log("Skipping load - already loading or component unmounted");
      return;
    }

    console.log("Starting to load promo codes...");
    isLoadingRef.current = true;
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      // First check if we need to migrate data from localStorage
      const localData = localStorage.getItem("promoCodes");
      if (localData && isMountedRef.current) {
        console.log("Found local promo codes data, attempting migration...");
        try {
          const migrated = await migratePromoCodesFromLocalStorage();
          if (migrated && isMountedRef.current) {
            showSuccess("Úspěšně jsme přenesli vaše promo kódy");
          }
        } catch (migrationError) {
          console.error("Migration failed:", migrationError);
          // Continue even if migration fails
        }
      }

      // Then load from Supabase
      if (!isMountedRef.current) return;
      
      console.log("Loading promo codes from Supabase...");
      const codes = await fetchPromoCodes();
      
      if (!isMountedRef.current) return;
      
      console.log("Loaded promo codes:", codes);
      setPromoCodes(codes);
      
      if (codes.length === 0) {
        console.log("No promo codes found in database");
      }
      
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error("Chyba při načítání promo kódů:", error);
      setLoadingError("Nepodařilo se načíst promo kódy z databáze");
      showError("Nepodařilo se načíst promo kódy");
      
      // Try to load from localStorage as fallback
      try {
        const localData = localStorage.getItem("promoCodes");
        if (localData && isMountedRef.current) {
          const localCodes = JSON.parse(localData);
          setPromoCodes(localCodes);
          showSuccess("Načteny promo kódy z lokálního úložiště");
        }
      } catch (localError) {
        console.error("Failed to load from localStorage:", localError);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, []); // Remove showSuccess and showError from dependencies

  useEffect(() => {
    isMountedRef.current = true;
    loadPromoCodesData();

    // Cleanup function
    return () => {
      console.log("PromoCodesPanel unmounting - cleaning up");
      isMountedRef.current = false;
    };
  }, [loadPromoCodesData]);

  const handleCreatePromoCode = useCallback((newCode: PromoCode) => {
    setPromoCodes(prevCodes => [newCode, ...prevCodes]);
  }, []);

  const handleDeletePromoCode = useCallback(async (id: string) => {
    const success = await deletePromoCode(id);
    if (success && isMountedRef.current) {
      setPromoCodes(prevCodes => prevCodes.filter(code => code.id !== id));
      showSuccess("Promo kód byl úspěšně smazán");
    }
  }, [showSuccess]);

  const resetUsageCount = useCallback(async (id: string) => {
    const promoCode = promoCodes.find(code => code.id === id);
    if (!promoCode) return;

    const updatedCode = await updatePromoCode(id, { usedCount: 0 });
    if (updatedCode && isMountedRef.current) {
      setPromoCodes(prevCodes =>
        prevCodes.map(code => (code.id === id ? updatedCode : code))
      );
      showSuccess("Počet použití byl resetován");
    }
  }, [promoCodes, showSuccess]);

  const extendValidity = useCallback(async (id: string) => {
    const promoCode = promoCodes.find(code => code.id === id);
    if (!promoCode) return;

    const newValidUntil = new Date();
    newValidUntil.setMonth(newValidUntil.getMonth() + 3); // Extend by 3 months

    const updatedCode = await updatePromoCode(id, { validUntil: newValidUntil.toISOString() });
    if (updatedCode && isMountedRef.current) {
      setPromoCodes(prevCodes =>
        prevCodes.map(code => (code.id === id ? updatedCode : code))
      );
      showSuccess("Platnost promo kódu byla prodloužena");
    }
  }, [promoCodes, showSuccess]);

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
          ) : loadingError ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-destructive mb-2">Chyba při načítání</h3>
                <p className="text-sm text-muted-foreground mb-4">{loadingError}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Zkusit znovu
                </Button>
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
          {activeTab === "analytics" && <PromoCodeAnalyticsDashboard />}
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

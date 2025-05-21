
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PromoCodeDialog } from "./promoCode/PromoCodeDialog";
import { PromoCodesTable } from "./promoCode/PromoCodesTable";
import { EmptyState } from "./promoCode/EmptyState";
import { PromoCode } from "./promoCode/types";
import { loadPromoCodes, savePromoCodes } from "./promoCode/promoCodeUtils";

export const PromoCodesPanel = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Načtení promo kódů z localStorage
    const fetchPromoCodes = () => {
      setIsLoading(true);
      try {
        const codes = loadPromoCodes();
        setPromoCodes(codes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoCodes();
  }, []);

  const handleCreatePromoCode = (newCode: PromoCode) => {
    const updatedCodes = [...promoCodes, newCode];
    savePromoCodes(updatedCodes);
    setPromoCodes(updatedCodes);
  };

  const deletePromoCode = (id: string) => {
    const updatedCodes = promoCodes.filter(code => code.id !== id);
    savePromoCodes(updatedCodes);
    setPromoCodes(updatedCodes);
    toast.success("Promo kód byl úspěšně smazán");
  };

  // Add functionality to reset usage count
  const resetUsageCount = (id: string) => {
    const updatedCodes = promoCodes.map(code => {
      if (code.id === id) {
        return {
          ...code,
          usedCount: 0
        };
      }
      return code;
    });
    savePromoCodes(updatedCodes);
    setPromoCodes(updatedCodes);
    toast.success("Počet použití byl resetován");
  };

  // Extended validity of a promo code
  const extendValidity = (id: string) => {
    const updatedCodes = promoCodes.map(code => {
      if (code.id === id) {
        const newValidUntil = new Date();
        newValidUntil.setMonth(newValidUntil.getMonth() + 3); // Extend by 3 months
        return {
          ...code,
          validUntil: newValidUntil.toISOString()
        };
      }
      return code;
    });
    savePromoCodes(updatedCodes);
    setPromoCodes(updatedCodes);
    toast.success("Platnost promo kódu byla prodloužena");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Aktivní promo kódy</h3>
        <Button onClick={() => setShowDialog(true)}>
          Vytvořit nový kód
        </Button>
      </div>

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
          onDelete={deletePromoCode}
        />
      )}

      <PromoCodeDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        onCreatePromoCode={handleCreatePromoCode}
      />
    </div>
  );
};

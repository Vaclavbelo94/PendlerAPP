
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Migrates promo codes from localStorage to Supabase
 */
export const migratePromoCodesFromLocalStorage = async (): Promise<boolean> => {
  try {
    // Get codes from localStorage
    const localCodes = JSON.parse(localStorage.getItem("promoCodes") || "[]");
    
    if (!localCodes.length) {
      return true; // No codes to migrate
    }
    
    // Format codes for Supabase
    const codesToInsert = localCodes.map((code: any) => ({
      code: code.code,
      discount: code.discount,
      duration: code.duration,
      valid_until: code.validUntil,
      used_count: code.usedCount,
      max_uses: code.maxUses
    }));
    
    // Insert into Supabase
    const { error } = await supabase
      .from('promo_codes')
      .insert(codesToInsert);
    
    if (error) {
      throw error;
    }
    
    // Clear localStorage after successful migration
    localStorage.removeItem("promoCodes");
    
    return true;
  } catch (error) {
    console.error("Chyba při migraci promo kódů:", error);
    toast.error("Nepodařilo se migrovat promo kódy z localStorage");
    return false;
  }
};

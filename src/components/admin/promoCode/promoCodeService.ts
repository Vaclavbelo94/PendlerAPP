
import { supabase } from "@/integrations/supabase/client";
import { PromoCode, PromoCodeDB } from "./types";
import { toast } from "sonner";

export const fetchPromoCodes = async (): Promise<PromoCode[]> => {
  try {
    // Use type assertion to handle the new table that's not yet in the generated types
    const { data, error } = await supabase
      .from('promo_codes' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as unknown as PromoCode[];
  } catch (error) {
    console.error("Chyba při načítání promo kódů:", error);
    toast.error("Nepodařilo se načíst promo kódy");
    return [];
  }
};

export const createPromoCode = async (promoCode: Omit<PromoCode, 'id' | 'usedCount' | 'created_at' | 'updated_at'>): Promise<PromoCode | null> => {
  try {
    // Use type assertion to handle the new table that's not yet in the generated types
    const { data, error } = await supabase
      .from('promo_codes' as any)
      .insert({
        code: promoCode.code,
        discount: promoCode.discount,
        duration: promoCode.duration,
        valid_until: promoCode.validUntil,
        used_count: 0,
        max_uses: promoCode.maxUses
      } as any)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform to our frontend type
    return mapDbToPromoCode(data as any);
  } catch (error) {
    console.error("Chyba při vytváření promo kódu:", error);
    toast.error("Nepodařilo se vytvořit promo kód");
    return null;
  }
};

export const updatePromoCode = async (id: string, updates: Partial<PromoCode>): Promise<PromoCode | null> => {
  try {
    // Format the data for the database
    const dbUpdates: Partial<any> = {};
    
    if (updates.discount !== undefined) dbUpdates.discount = updates.discount;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.validUntil !== undefined) dbUpdates.valid_until = updates.validUntil;
    if (updates.maxUses !== undefined) dbUpdates.max_uses = updates.maxUses;
    if (updates.usedCount !== undefined) dbUpdates.used_count = updates.usedCount;
    
    // Use type assertion to handle the new table that's not yet in the generated types
    const { data, error } = await supabase
      .from('promo_codes' as any)
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return mapDbToPromoCode(data as any);
  } catch (error) {
    console.error("Chyba při aktualizaci promo kódu:", error);
    toast.error("Nepodařilo se aktualizovat promo kód");
    return null;
  }
};

export const deletePromoCode = async (id: string): Promise<boolean> => {
  try {
    // Use type assertion to handle the new table that's not yet in the generated types
    const { error } = await supabase
      .from('promo_codes' as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Chyba při mazání promo kódu:", error);
    toast.error("Nepodařilo se smazat promo kód");
    return false;
  }
};

export const redeemPromoCode = async (userId: string, code: string): Promise<{
  success: boolean;
  promoCode?: PromoCode;
  message?: string;
}> => {
  try {
    // First, find the promo code
    // Use type assertion to handle the new table that's not yet in the generated types
    const { data: promoCodeData, error: promoCodeError } = await supabase
      .from('promo_codes' as any)
      .select('*')
      .ilike('code', code)
      .single();
    
    if (promoCodeError || !promoCodeData) {
      return { success: false, message: "Neplatný promo kód" };
    }
    
    const promoCode = mapDbToPromoCode(promoCodeData as any);
    
    // Check if code is expired
    if (new Date(promoCode.validUntil) < new Date()) {
      return { success: false, message: "Tento promo kód již vypršel" };
    }
    
    // Check if code has reached max uses
    if (promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
      return { success: false, message: "Tento promo kód byl již vyčerpán" };
    }
    
    // Check if user has already redeemed this code
    // Use type assertion to handle the new table that's not yet in the generated types
    const { data: existingRedemption, error: redemptionCheckError } = await supabase
      .from('promo_code_redemptions' as any)
      .select('id')
      .eq('user_id', userId)
      .eq('promo_code_id', promoCode.id);
    
    if (existingRedemption && existingRedemption.length > 0) {
      return { success: false, message: "Tento promo kód jste již použili" };
    }
    
    // Begin transaction - actually in Supabase JS we can't do proper transactions, so we'll do this in sequence
    // 1. Record the redemption
    // Use type assertion to handle the new table that's not yet in the generated types
    const { error: redemptionError } = await supabase
      .from('promo_code_redemptions' as any)
      .insert({
        user_id: userId,
        promo_code_id: promoCode.id
      } as any);
    
    if (redemptionError) {
      throw redemptionError;
    }
    
    // 2. Update the used count
    // Use type assertion to handle the new table that's not yet in the generated types
    const { error: updateError } = await supabase
      .from('promo_codes' as any)
      .update({ used_count: promoCode.usedCount + 1 })
      .eq('id', promoCode.id);
    
    if (updateError) {
      throw updateError;
    }
    
    // Return success with the redeemed promo code
    return { 
      success: true, 
      promoCode: { ...promoCode, usedCount: promoCode.usedCount + 1 }
    };
  } catch (error) {
    console.error("Chyba při uplatňování promo kódu:", error);
    return { success: false, message: "Nastala chyba při aktivaci promo kódu" };
  }
};

// Utility function to map from DB to our frontend type
export const mapDbToPromoCode = (data: any): PromoCode => {
  return {
    id: data.id,
    code: data.code,
    discount: data.discount,
    duration: data.duration,
    validUntil: data.valid_until,
    usedCount: data.used_count,
    maxUses: data.max_uses,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Import promo codes from localStorage to Supabase
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
    // Use type assertion to handle the new table that's not yet in the generated types
    const { error } = await supabase
      .from('promo_codes' as any)
      .insert(codesToInsert as any);
    
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

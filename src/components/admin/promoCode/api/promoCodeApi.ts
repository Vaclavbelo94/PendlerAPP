
import { supabase } from "@/integrations/supabase/client";
import { PromoCode, PromoCodeDB } from "../types";
import { mapDbToPromoCode } from "../utils/promoCodeMappers";
import { toast } from "sonner";

/**
 * Fetches all promo codes from the database
 */
export const fetchPromoCodes = async (): Promise<PromoCode[]> => {
  try {
    console.log("Fetching promo codes from database...");
    
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Database error:", error);
      throw error;
    }
    
    console.log("Raw promo codes data:", data);
    
    if (!data) {
      console.log("No promo codes found");
      return [];
    }
    
    const mappedData = data.map(mapDbToPromoCode);
    console.log("Mapped promo codes:", mappedData);
    
    return mappedData;
  } catch (error) {
    console.error("Chyba při načítání promo kódů:", error);
    // Don't show toast here - let the calling component handle user feedback
    throw error; // Re-throw to let caller handle the error
  }
};

/**
 * Creates a new promo code in the database
 */
export const createPromoCode = async (promoCode: Omit<PromoCode, 'id' | 'usedCount' | 'created_at' | 'updated_at'>): Promise<PromoCode | null> => {
  try {
    console.log("Creating new promo code:", promoCode);
    
    const { data, error } = await supabase
      .from('promo_codes')
      .insert({
        code: promoCode.code,
        discount: promoCode.discount,
        duration: promoCode.duration,
        valid_until: promoCode.validUntil,
        used_count: 0,
        max_uses: promoCode.maxUses
      })
      .select() as { data: PromoCodeDB[] | null, error: any };
    
    if (error) {
      console.error("Error creating promo code:", error);
      throw error;
    }
    
    console.log("Created promo code:", data);
    
    // Transform to our frontend type
    return data && data[0] ? mapDbToPromoCode(data[0]) : null;
  } catch (error) {
    console.error("Chyba při vytváření promo kódu:", error);
    toast.error("Nepodařilo se vytvořit promo kód");
    return null;
  }
};

/**
 * Updates an existing promo code in the database
 */
export const updatePromoCode = async (id: string, updates: Partial<PromoCode>): Promise<PromoCode | null> => {
  try {
    console.log("Updating promo code:", id, updates);
    
    // Format the data for the database
    const dbUpdates: Partial<PromoCodeDB> = {};
    
    if (updates.discount !== undefined) dbUpdates.discount = updates.discount;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.validUntil !== undefined) dbUpdates.valid_until = updates.validUntil;
    if (updates.maxUses !== undefined) dbUpdates.max_uses = updates.maxUses;
    if (updates.usedCount !== undefined) dbUpdates.used_count = updates.usedCount;
    
    const { data, error } = await supabase
      .from('promo_codes')
      .update(dbUpdates)
      .eq('id', id)
      .select() as { data: PromoCodeDB[] | null, error: any };
    
    if (error) {
      console.error("Error updating promo code:", error);
      throw error;
    }
    
    console.log("Updated promo code:", data);
    
    return data && data[0] ? mapDbToPromoCode(data[0]) : null;
  } catch (error) {
    console.error("Chyba při aktualizaci promo kódu:", error);
    toast.error("Nepodařilo se aktualizovat promo kód");
    return null;
  }
};

/**
 * Deletes a promo code from the database
 */
export const deletePromoCode = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting promo code:", id);
    
    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting promo code:", error);
      throw error;
    }
    
    console.log("Deleted promo code successfully");
    return true;
  } catch (error) {
    console.error("Chyba při mazání promo kódu:", error);
    toast.error("Nepodařilo se smazat promo kód");
    return false;
  }
};

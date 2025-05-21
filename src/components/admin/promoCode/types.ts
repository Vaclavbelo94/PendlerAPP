
import { Database } from "@/integrations/supabase/types";

// Type from Supabase
export type PromoCodeDB = Database['public']['Tables']['promo_codes']['Row'];
export type PromoCodeRedemptionDB = Database['public']['Tables']['promo_code_redemptions']['Row'];

// Frontend types for components
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  duration: number; // trvání v měsících
  validUntil: string;
  usedCount: number;
  maxUses: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface PromoCodeFormValues {
  code: string;
  discount: number;
  duration: number;
  maxUses: number | null;
}

export interface PromoCodeRedemption {
  id: string;
  userId: string;
  promoCodeId: string;
  redeemedAt: string;
}

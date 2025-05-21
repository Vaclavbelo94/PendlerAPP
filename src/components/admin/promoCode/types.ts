
import { Database } from "@/integrations/supabase/types";

// Mapování typů z Supabase DB na frontend typy
// Definice typů DB (protože nejsou v automaticky generovaných typech)
export interface PromoCodeDB {
  id: string;
  code: string;
  discount: number;
  duration: number;
  valid_until: string;
  used_count: number;
  max_uses: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface PromoCodeRedemptionDB {
  id: string;
  user_id: string;
  promo_code_id: string;
  redeemed_at: string;
}

// Frontend typy pro komponenty
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

// Type assertion helper for Supabase
export type SupabasePromoCodes = Database['public']['Tables']['promo_codes'];
export type SupabasePromoCodeRedemptions = Database['public']['Tables']['promo_code_redemptions'];

// Analytics types
export interface UsageOverTimeData {
  date: string;
  redemptions: number;
  created: number;
}

export interface DiscountDistributionData {
  discount: number;
  value: number;
}

export interface PromoCodeBreakdown extends PromoCode {
  redemptionRate: number;
}

export interface PromoCodeAnalytics {
  totalPromoCodes: number;
  totalRedemptions: number;
  activePromoCodes: number;
  averageDiscount: number;
  mostUsedCode: string;
  mostUsedCodeCount: number;
  discountTrend?: number;
  activeCodesTrend?: number;
  usageOverTime: UsageOverTimeData[];
  discountDistribution: DiscountDistributionData[];
  codeBreakdown: PromoCodeBreakdown[];
}

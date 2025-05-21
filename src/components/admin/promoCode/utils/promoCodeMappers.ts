
import { PromoCode, PromoCodeDB } from "../types";

/**
 * Utility function to map from DB format to our frontend type
 */
export const mapDbToPromoCode = (data: PromoCodeDB): PromoCode => {
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


// Re-export all functionality from the modular files
import { fetchPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from "./api/promoCodeApi";
import { redeemPromoCode } from "./api/redemptionApi";
import { mapDbToPromoCode } from "./utils/promoCodeMappers";
import { migratePromoCodesFromLocalStorage } from "./utils/localStorageMigration";

// Re-export everything to maintain the same public API
export {
  fetchPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  redeemPromoCode,
  mapDbToPromoCode,
  migratePromoCodesFromLocalStorage
};

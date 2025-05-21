
import { PromoCode } from "./types";
import { toast } from "sonner";

export const loadPromoCodes = (): PromoCode[] => {
  try {
    const storedCodes = JSON.parse(localStorage.getItem("promoCodes") || "[]");
    return storedCodes;
  } catch (error) {
    console.error("Chyba při načítání promo kódů:", error);
    toast.error("Nepodařilo se načíst promo kódy");
    return [];
  }
};

export const savePromoCodes = (codes: PromoCode[]): void => {
  localStorage.setItem("promoCodes", JSON.stringify(codes));
};

export const generateRandomCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "PROMO-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

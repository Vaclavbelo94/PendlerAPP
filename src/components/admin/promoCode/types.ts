
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  duration: number; // trvání v měsících
  validUntil: string;
  usedCount: number;
  maxUses: number | null;
}

export interface PromoCodeFormValues {
  code: string;
  discount: number;
  duration: number;
  maxUses: number | null;
}

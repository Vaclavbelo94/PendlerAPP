export interface PricingConfig {
  currency: string;
  monthlyPrice: number;
  yearlyPrice: number;
  savings: number; // percentage
}

/**
 * Centralized pricing configuration for all languages/currencies
 * 
 * To update prices, modify this configuration only.
 * All pricing pages (Premium, Pricing, FAQ) use this single source of truth.
 */
export const PRICING_CONFIG: Record<string, PricingConfig> = {
  cs: {
    currency: 'CZK',
    monthlyPrice: 100,
    yearlyPrice: 1000,
    savings: 17
  },
  de: {
    currency: 'EUR',
    monthlyPrice: 4,
    yearlyPrice: 40,
    savings: 17
  },
  pl: {
    currency: 'PLN',
    monthlyPrice: 17,
    yearlyPrice: 170,
    savings: 17
  }
};

/**
 * Get pricing configuration for a specific language
 * @param language - Language code (cs, de, pl)
 * @returns Pricing configuration for the specified language
 */
export const getPricing = (language: string): PricingConfig => {
  return PRICING_CONFIG[language] || PRICING_CONFIG.cs;
};

/**
 * Format price as string for display
 * @param price - Numeric price
 * @param currency - Currency code
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string): string => {
  return `${price} ${currency}`;
};

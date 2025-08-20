
import { useTranslation } from 'react-i18next';

// Currency conversion utilities
export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToEUR: number; // All rates relative to EUR
}

export const CURRENCIES: Record<string, CurrencyRate> = {
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateToEUR: 1
  },
  CZK: {
    code: 'CZK', 
    name: 'Czech Koruna',
    symbol: 'Kč',
    rateToEUR: 0.041 // Approximate rate: 1 EUR = ~24.4 CZK
  },
  PLN: {
    code: 'PLN',
    name: 'Polish Złoty', 
    symbol: 'zł',
    rateToEUR: 0.23 // Approximate rate: 1 EUR = ~4.3 PLN
  }
};

export const getDefaultCurrencyByLanguage = (language: string): string => {
  // All prices are now in EUR regardless of language
  return 'EUR';
};

export const convertPrice = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = CURRENCIES[fromCurrency]?.rateToEUR || 1;
  const toRate = CURRENCIES[toCurrency]?.rateToEUR || 1;
  
  // Convert to EUR first, then to target currency
  const eurAmount = amount * fromRate;
  const convertedAmount = eurAmount / toRate;
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

export const formatCurrencyWithSymbol = (
  amount: number,
  currency: string = 'EUR'
): string => {
  // Always format as EUR with € symbol
  return `${amount.toFixed(2)} €`;
};

export const getCurrencyList = (): CurrencyRate[] => {
  return Object.values(CURRENCIES);
};

// Updated hook - all prices now in EUR
export const useCurrencyFormatter = () => {
  const { i18n } = useTranslation();
  
  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '0 €';
    
    // Always format as EUR with localized number formatting
    return new Intl.NumberFormat(i18n.language === 'cs' ? 'cs-CZ' : 
                                i18n.language === 'pl' ? 'pl-PL' : 'de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  };

  const getCurrencySymbol = (): string => {
    return '€'; // Always EUR symbol
  };

  return { formatCurrency, getCurrencySymbol };
};

export const formatCurrencyStatic = (amount: number | string, language: string = 'cs'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0 €';
  
  // Always format as EUR with localized number formatting
  return new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 
                              language === 'pl' ? 'pl-PL' : 'de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(numAmount);
};


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
  switch (language) {
    case 'cs':
      return 'CZK';
    case 'pl':
      return 'PLN';
    case 'de':
    default:
      return 'EUR';
  }
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
  currency: string
): string => {
  const currencyInfo = CURRENCIES[currency];
  if (!currencyInfo) return `${amount} ${currency}`;
  
  // Format based on currency
  if (currency === 'CZK') {
    return `${Math.round(amount)} ${currencyInfo.symbol}`;
  } else {
    return `${amount.toFixed(2)} ${currencyInfo.symbol}`;
  }
};

export const getCurrencyList = (): CurrencyRate[] => {
  return Object.values(CURRENCIES);
};

// Legacy hooks - preserved for backward compatibility
export const useCurrencyFormatter = () => {
  const { i18n } = useTranslation();
  
  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '0';
    
    switch (i18n.language) {
      case 'de':
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR'
        }).format(numAmount);
        
      case 'pl':
        return new Intl.NumberFormat('pl-PL', {
          style: 'currency',
          currency: 'PLN'
        }).format(numAmount);
        
      case 'cs':
      default:
        return new Intl.NumberFormat('cs-CZ', {
          style: 'currency',
          currency: 'CZK'
        }).format(numAmount);
    }
  };

  const getCurrencySymbol = (): string => {
    switch (i18n.language) {
      case 'de':
        return '€';
      case 'pl':
        return 'zł';
      case 'cs':
      default:
        return 'Kč';
    }
  };

  return { formatCurrency, getCurrencySymbol };
};

export const formatCurrencyStatic = (amount: number | string, language: string = 'cs'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0';
  
  switch (language) {
    case 'de':
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(numAmount);
      
    case 'pl':
      return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
      }).format(numAmount);
      
    case 'cs':
    default:
      return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK'
      }).format(numAmount);
  }
};

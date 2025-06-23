
import { useTranslation } from 'react-i18next';

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

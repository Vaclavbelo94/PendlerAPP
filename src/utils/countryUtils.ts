
import { useTranslation } from 'react-i18next';

export interface CountryConfig {
  code: string;
  prefix: string;
  currency: string;
  currencySymbol: string;
}

export const getCountryConfig = (language: string): CountryConfig => {
  switch (language) {
    case 'cs':
      return {
        code: 'CZ',
        prefix: '+420',
        currency: 'CZK',
        currencySymbol: 'Kč'
      };
    case 'de':
      return {
        code: 'DE',
        prefix: '+49',
        currency: 'EUR',
        currencySymbol: '€'
      };
    case 'pl':
      return {
        code: 'PL',
        prefix: '+48',
        currency: 'PLN',
        currencySymbol: 'zł'
      };
    default:
      return {
        code: 'CZ',
        prefix: '+420',
        currency: 'CZK',
        currencySymbol: 'Kč'
      };
  }
};

export const formatPhoneNumber = (phone: string, language: string): string => {
  if (!phone) return '';
  
  const config = getCountryConfig(language);
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If phone already starts with country code, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Add country prefix if not present
  return `${config.prefix} ${cleanPhone}`;
};

export const getDriverDisplayName = (driver: any, t: any): string => {
  if (driver?.username && driver.username.trim()) {
    return driver.username;
  }
  return t('unknownDriver');
};


import { useTranslation } from 'react-i18next';

export interface CountryConfig {
  code: string;
  prefix: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
}

export const getCountryConfig = (language: string): CountryConfig => {
  switch (language) {
    case 'cs':
      return {
        code: 'CZ',
        prefix: '+420',
        currency: 'CZK',
        currencySymbol: 'Kč',
        locale: 'cs-CZ',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'HH:mm'
      };
    case 'de':
      return {
        code: 'DE',
        prefix: '+49',
        currency: 'EUR',
        currencySymbol: '€',
        locale: 'de-DE',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'HH:mm'
      };
    case 'pl':
      return {
        code: 'PL',
        prefix: '+48',
        currency: 'PLN',
        currencySymbol: 'zł',
        locale: 'pl-PL',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'HH:mm'
      };
    default:
      return {
        code: 'CZ',
        prefix: '+420',
        currency: 'CZK',
        currencySymbol: 'Kč',
        locale: 'cs-CZ',
        dateFormat: 'dd.MM.yyyy',
        timeFormat: 'HH:mm'
      };
  }
};

export const formatCurrency = (amount: number, language: string): string => {
  const config = getCountryConfig(language);
  
  if (amount === 0) return 'Zdarma'; // Will be translated in component
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: string | Date, language: string): string => {
  const config = getCountryConfig(language);
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(config.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
};

export const formatTime = (time: string, language: string): string => {
  const config = getCountryConfig(language);
  const [hours, minutes] = time.split(':');
  const timeObj = new Date();
  timeObj.setHours(parseInt(hours), parseInt(minutes));
  
  return new Intl.DateTimeFormat(config.locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(timeObj);
};

export const formatPhoneNumber = (phone: string, language: string): string => {
  if (!phone) return '';
  
  const config = getCountryConfig(language);
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (phone.startsWith('+')) {
    return phone;
  }
  
  return `${config.prefix} ${cleanPhone}`;
};

export const getDriverDisplayName = (driver: any, t: any): string => {
  if (driver?.username && driver.username.trim()) {
    return driver.username;
  }
  return t('unknownDriver');
};

export const detectCountryFromLanguage = (language: string): string => {
  const countryMap: Record<string, string> = {
    'cs': 'CZ',
    'de': 'DE', 
    'pl': 'PL'
  };
  
  return countryMap[language] || 'CZ';
};

export const getSupportedCurrencies = () => {
  return [
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' }
  ];
};

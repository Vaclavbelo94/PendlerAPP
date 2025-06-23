
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export type Language = 'cs' | 'de' | 'pl';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  
  const language = (i18n.language || 'cs') as Language;
  
  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  // Automatická detekce jazyka při prvním načtení
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.split('-')[0];
    
    // Pokud není uložený jazyk, zkusíme detekovat z prohlížeče
    if (!savedLanguage) {
      const supportedLanguages: Language[] = ['cs', 'de', 'pl'];
      const detectedLanguage = supportedLanguages.includes(browserLanguage as Language) 
        ? browserLanguage as Language 
        : 'cs'; // výchozí jazyk
      
      // Detekce na základě geolokace (pokud je dostupná)
      if (navigator.geolocation && !savedLanguage) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Přibližná detekce země na základě souřadnic
            let autoLanguage: Language = 'cs';
            
            // Německo (přibližné hranice)
            if (latitude >= 47.3 && latitude <= 55.1 && longitude >= 5.9 && longitude <= 15.0) {
              autoLanguage = 'de';
            }
            // Polsko (přibližné hranice)  
            else if (latitude >= 49.0 && latitude <= 54.8 && longitude >= 14.1 && longitude <= 24.1) {
              autoLanguage = 'pl';
            }
            // Česká republika (přibližné hranice)
            else if (latitude >= 48.5 && latitude <= 51.1 && longitude >= 12.1 && longitude <= 18.9) {
              autoLanguage = 'cs';
            }
            
            if (autoLanguage !== i18n.language && !localStorage.getItem('preferred-language')) {
              setLanguage(autoLanguage);
            }
          },
          () => {
            // Fallback na jazyk prohlížeče při chybě geolokace
            if (detectedLanguage !== i18n.language) {
              setLanguage(detectedLanguage);
            }
          },
          { timeout: 5000 }
        );
      } else if (detectedLanguage !== i18n.language) {
        setLanguage(detectedLanguage);
      }
    }
  }, [i18n.language]);

  return {
    language,
    setLanguage,
    t
  };
};


// Legacy compatibility - direct imports to avoid circular dependencies
import type { Language, LanguageInfo, Translations } from './i18n/types';
import { languages, defaultLanguage } from './i18n/languages';
import { getTranslation, useTranslation } from './i18n/index';

// Re-export from new modular structure
export type { Language, LanguageInfo, Translations };
export { languages, defaultLanguage, getTranslation, useTranslation };

// For backward compatibility, export old structure
export const translations = {
  cs: {
    // Common navigation
    dashboard: 'Dashboard',
    shifts: 'Směny',
    language: 'Jazyk',
    travel: 'Cestování',
    translator: 'Překladač',
    taxAdvisor: 'Daňový poradce',
    laws: 'Zákony',
    profile: 'Profil',
    settings: 'Nastavení',
    logout: 'Odhlásit se',
    login: 'Přihlásit se',
    register: 'Registrovat se',
    
    // Dashboard
    welcome: 'Vítejte',
    quickStats: 'Rychlé statistiky',
    recentActivity: 'Nedávná aktivita',
    
    // Language Learning
    vocabulary: 'Slovní zásoba',
    grammar: 'Gramatika',
    exercises: 'Cvičení',
    progress: 'Pokrok',
    
    // Common UI elements
    updated: 'Aktualizováno',
    readMore: 'Číst více',
    
    // Law section specific - using new structure
    germanLaws: 'Německé zákony',
    lawsGuide: 'Průvodce německými zákony',
    lawsDescription: 'Kompletní průvodce německými zákony pro zahraniční pracovníky',
    lawsDescriptionMobile: 'Průvodce německými zákony',
    backToLaws: 'Zpět na zákony',
    backToLawsList: 'Zpět na seznam zákonů',
    allLaws: 'Všechny zákony',
    allLawsDescription: 'Zobrazit všechny dostupné zákony a předpisy',
    
    // Law categories
    workLaw: 'Pracovní právo',
    workLawDescription: 'Zákony týkající se pracovních smluv a práv zaměstnanců',
    taxes: 'Daně',
    taxesDescription: 'Daňové zákony a předpisy pro zaměstnance',
    socialSecurity: 'Sociální zabezpečení',
    socialSecurityDescription: 'Systém sociálního zabezpečení a dávky',
    healthInsurance: 'Zdravotní pojištění',
    healthInsuranceDescription: 'Systém zdravotního pojištění a pokrytí',
    
    // Individual laws
    minimumWage: 'Minimální mzda',
    minimumWageDescription: 'Aktuální sazby minimální mzdy a pravidla pro zaměstnance',
    taxClasses: 'Daňové třídy',
    taxClassesDescription: 'Vysvětlení německých daňových tříd a jejich aplikace',
    healthInsuranceSystem: 'Systém zdravotního pojištění',
    healthInsuranceSystemDescription: 'Přehled německého systému zdravotního pojištění',
    workContract: 'Pracovní smlouva',
    workContractDescription: 'Základní informace o pracovních smlouvách a právech',
    taxReturn: 'Daňové přiznání',
    taxReturnDescription: 'Průvodce podáním daňového přiznání v Německu',
    pensionInsurance: 'Důchodové pojištění',
    pensionInsuranceDescription: 'Informace o německém systému důchodového pojištění',
    employeeProtection: 'Ochrana zaměstnanců',
    employeeProtectionDescription: 'Práva a ochrana zaměstnanců podle německého práva',
    childBenefits: 'Dětské dávky',
    childBenefitsDescription: 'Informace o dětských dávkách a rodinných příspěvcích',
    workingHours: 'Pracovní doba',
    workingHoursDescription: 'Pravidla pro pracovní dobu a přesčasy',
    minimumHolidays: 'Minimální dovolená',
    minimumHolidaysDescription: 'Zákonné nároky na dovolenou a volno',
    parentalAllowance: 'Rodičovský příspěvek',
    parentalAllowanceDescription: 'Informace o rodičovském příspěvku (Elterngeld)',
    legalAid: 'Právní pomoc',
    legalAidDescription: 'Možnosti bezplatné právní pomoci pro zahraniční pracovníky',
    
    // Common terms
    importantNotice: 'Důležité upozornění',
    orientationGuide: 'Tento průvodce slouží pouze k orientaci. Pro konkrétní právní rady se obraťte na odborníka.',
    
    // Additional missing translations
    noLawsFound: 'Nebyly nalezeny žádné zákony',
    tryChangeCategory: 'Zkuste změnit kategorii',
    lawsCount: 'zákonů',
  },
  
  de: {
    dashboard: 'Dashboard',
    shifts: 'Schichten',
    language: 'Sprache',
    travel: 'Reisen',
    translator: 'Übersetzer',
    taxAdvisor: 'Steuerberater',
    laws: 'Gesetze',
    profile: 'Profil',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    
    // Common UI elements
    updated: 'Aktualisiert',
    readMore: 'Mehr lesen',
    
    // Law section
    germanLaws: 'Deutsche Gesetze',
    lawsGuide: 'Leitfaden für deutsche Gesetze',
    lawsDescription: 'Vollständiger Leitfaden für deutsche Gesetze für ausländische Arbeitnehmer',
    allLaws: 'Alle Gesetze',
    allLawsDescription: 'Alle verfügbaren Gesetze und Vorschriften anzeigen',
    workLaw: 'Arbeitsrecht',
    workLawDescription: 'Gesetze zu Arbeitsverträgen und Arbeitnehmerrechten',
    taxes: 'Steuern',
    taxesDescription: 'Steuergesetze und Vorschriften für Arbeitnehmer',
    socialSecurity: 'Sozialversicherung',
    socialSecurityDescription: 'Sozialversicherungssystem und Leistungen',
    healthInsurance: 'Krankenversicherung',
    healthInsuranceDescription: 'Krankenversicherungssystem und Abdeckung',
  },
  
  pl: {
    dashboard: 'Panel',
    shifts: 'Zmiany',
    language: 'Język',
    travel: 'Podróże',
    translator: 'Tłumacz',
    taxAdvisor: 'Doradca podatkowy',
    laws: 'Prawo',
    profile: 'Profil',
    settings: 'Ustawienia',
    logout: 'Wyloguj',
    login: 'Zaloguj',
    register: 'Zarejestruj',
    
    // Common UI elements
    updated: 'Zaktualizowano',
    readMore: 'Czytaj więcej',
    
    // Law section
    germanLaws: 'Niemieckie prawo',
    lawsGuide: 'Przewodnik po niemieckim prawie',
    lawsDescription: 'Kompletny przewodnik po niemieckim prawie dla zagranicznych pracowników',
    allLaws: 'Wszystkie prawa',
    allLawsDescription: 'Pokaż wszystkie dostępne prawa i przepisy',
    workLaw: 'Prawo pracy',
    workLawDescription: 'Przepisy dotyczące umów o pracę i praw pracowników',
    taxes: 'Podatki',
    taxesDescription: 'Przepisy podatkowe dla pracowników',
    socialSecurity: 'Ubezpieczenia społeczne',
    socialSecurityDescription: 'System ubezpieczeń społecznych i świadczenia',
    healthInsurance: 'Ubezpieczenie zdrowotne',
    healthInsuranceDescription: 'System ubezpieczenia zdrowotnego i pokrycie',
  }
};

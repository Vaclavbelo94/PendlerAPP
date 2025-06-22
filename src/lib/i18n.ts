
// Legacy compatibility - re-export from new modular structure
export { Language, LanguageInfo, languages, defaultLanguage, getTranslation, useTranslation } from './i18n';
export type { Translations } from './i18n';

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
    
    // Laws section - using new structure
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
    updated: 'Aktualizováno',
    importantNotice: 'Důležité upozornění',
    orientationGuide: 'Tento průvodce slouží pouze k orientaci. Pro konkrétní právní rady se obraťte na odborníka.',
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
  }
};

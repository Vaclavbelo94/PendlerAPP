
import { workLawTranslations } from './workLaw';
import { taxesTranslations } from './taxes';
import { socialSecurityTranslations } from './socialSecurity';
import { healthInsuranceTranslations } from './healthInsurance';
import { legalAidTranslations } from './legalAid';

// Merge all law translations
export const lawsTranslations = {
  cs: {
    laws: {
      // Common translations
      backToLaws: 'Zpět na zákony',
      backToLawsList: 'Zpět na seznam zákonů', 
      updated: 'Aktualizováno',
      readMore: 'Číst více',
      importantNotice: 'Důležité upozornění',
      orientationGuide: 'Tento průvodce slouží pouze k orientaci. Pro konkrétní právní rady se obraťte na odborníka.',

      // Main navigation
      germanLaws: 'Německé zákony',
      lawsGuide: 'Průvodce německými zákony',
      lawsDescription: 'Kompletní průvodce německými zákony pro zahraniční pracovníky',
      lawsDescriptionMobile: 'Průvodce německými zákony',
      allLaws: 'Všechny zákony',
      allLawsDescription: 'Zobrazit všechny dostupné zákony a předpisy',

      // Categories
      workLaw: 'Pracovní právo',
      workLawDescription: 'Zákony týkající se pracovních smluv a práv zaměstnanců',
      taxes: 'Daně',
      taxesDescription: 'Daňové zákony a předpisy pro zaměstnance',
      socialSecurity: 'Sociální zabezpečení',
      socialSecurityDescription: 'Systém sociálního zabezpečení a dávky',
      healthInsurance: 'Zdravotní pojištění',
      healthInsuranceDescription: 'Systém zdravotního pojištění a pokrytí',

      // Individual law titles and descriptions
      minimumWage: 'Minimální mzda',
      minimumWageDescription: 'Aktuální sazby minimální mzdy a pravidla pro zaměstnance',
      workContract: 'Pracovní smlouva',
      workContractDescription: 'Základní informace o pracovních smlouvách a právech',
      workingHours: 'Pracovní doba',
      workingHoursDescription: 'Pravidla pro pracovní dobu a přesčasy',
      minimumHolidays: 'Minimální dovolená',
      minimumHolidaysDescription: 'Zákonné nároky na dovolenou a volno',
      employeeProtection: 'Ochrana zaměstnanců',
      employeeProtectionDescription: 'Práva a ochrana zaměstnanců podle německého práva',
      
      taxReturn: 'Daňové přiznání',
      taxReturnDescription: 'Průvodce podáním daňového přiznání v Německu',
      taxClasses: 'Daňové třídy',
      taxClassesDescription: 'Vysvětlení německých daňových tříd a jejich aplikace',
      
      pensionInsurance: 'Důchodové pojištění',
      pensionInsuranceDescription: 'Informace o německém systému důchodového pojištění',
      childBenefits: 'Dětské dávky',
      childBenefitsDescription: 'Informace o dětských dávkách a rodinných příspěvcích',
      parentalAllowance: 'Rodičovský příspěvek',
      parentalAllowanceDescription: 'Informace o rodičovském příspěvku (Elterngeld)',
      
      healthInsuranceSystem: 'Systém zdravotního pojištění',
      healthInsuranceSystemDescription: 'Přehled německého systému zdravotního pojištění pro zahraniční pracovníky',
      
      legalAid: 'Právní pomoc',
      legalAidDescription: 'Možnosti bezplatné a cenově dostupné právní pomoci pro zahraniční pracovníky',

      // Additional missing translations
      noLawsFound: 'Nebyly nalezeny žádné zákony',
      tryChangeCategory: 'Zkuste změnit kategorii',
      lawsCount: 'zákonů',
      lawNotFound: 'Zákon nebyl nalezen',
      overview: 'Přehled',
      keyPoints: 'Klíčové body',
      keyPoint1: 'První důležitý bod tohoto zákona',
      keyPoint2: 'Druhý důležitý bod tohoto zákona', 
      keyPoint3: 'Třetí důležitý bod tohoto zákona',
      legalRequirements: 'Právní požadavky',
      requirement1: 'První požadavek',
      requirementDesc1: 'Popis prvního požadavku',
      requirement2: 'Druhý požadavek',
      requirementDesc2: 'Popis druhého požadavku',
      resources: 'Zdroje',
      officialDocument: 'Oficiální dokument',
      additionalInfo: 'Dodatečné informace',

      // Merge all specific translations
      ...workLawTranslations.cs.laws,
      ...taxesTranslations.cs.laws,
      ...socialSecurityTranslations.cs.laws,
      ...healthInsuranceTranslations.cs.laws,
      ...legalAidTranslations.cs.laws,
    },
  },
  de: {
    laws: {
      // Common German translations
      backToLaws: 'Zurück zu Gesetzen',
      backToLawsList: 'Zurück zur Gesetzesliste',
      updated: 'Aktualisiert',
      readMore: 'Mehr lesen',
      importantNotice: 'Wichtiger Hinweis',
      orientationGuide: 'Diese Anleitung dient nur zur Orientierung. Für spezifische Rechtsberatung wenden Sie sich an einen Experten.',

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

      // Merge specific German translations
      ...workLawTranslations.de.laws,
      ...taxesTranslations.de.laws,
      ...socialSecurityTranslations.de.laws,
      ...healthInsuranceTranslations.de.laws,
      ...legalAidTranslations.de.laws,
    },
  },
  pl: {
    laws: {
      // Common Polish translations
      backToLaws: 'Powrót do praw',
      backToLawsList: 'Powrót do listy praw',
      updated: 'Zaktualizowano',
      readMore: 'Czytaj więcej',
      importantNotice: 'Ważna uwaga',
      orientationGuide: 'Ten przewodnik służy tylko do orientacji. W sprawie konkretnych porad prawnych skontaktuj się z ekspertem.',

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

      // Merge specific Polish translations
      ...workLawTranslations.pl.laws,
      ...taxesTranslations.pl.laws,
      ...socialSecurityTranslations.pl.laws,
      ...healthInsuranceTranslations.pl.laws,
      ...legalAidTranslations.pl.laws,
    },
  },
};

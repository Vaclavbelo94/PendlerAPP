
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
      work: 'Práce',
      tax: 'Daně',
      social: 'Sociální',
      health: 'Zdraví',
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

      // UI translations
      details: 'Detaily',
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
      lawsDescriptionMobile: 'Leitfaden für deutsche Gesetze',
      allLaws: 'Alle Gesetze',
      allLawsDescription: 'Alle verfügbaren Gesetze und Vorschriften anzeigen',
      
      work: 'Arbeit',
      tax: 'Steuern',
      social: 'Sozial',
      health: 'Gesundheit',
      workLaw: 'Arbeitsrecht',
      workLawDescription: 'Gesetze zu Arbeitsverträgen und Arbeitnehmerrechten',
      taxes: 'Steuern',
      taxesDescription: 'Steuergesetze und Vorschriften für Arbeitnehmer',
      socialSecurity: 'Sozialversicherung',
      socialSecurityDescription: 'Sozialversicherungssystem und Leistungen',
      healthInsurance: 'Krankenversicherung',
      healthInsuranceDescription: 'Krankenversicherungssystem und Abdeckung',
      legalAid: 'Rechtshilfe',
      legalAidDescription: 'Möglichkeiten kostenloser Rechtshilfe für ausländische Arbeitnehmer',

      // Individual law titles and descriptions
      minimumWage: 'Mindestlohn',
      minimumWageDescription: 'Aktuelle Mindestlohnsätze und Regeln für Arbeitnehmer',
      workContract: 'Arbeitsvertrag',
      workContractDescription: 'Grundlegende Informationen über Arbeitsverträge und Rechte',
      workingHours: 'Arbeitszeit',
      workingHoursDescription: 'Regeln für Arbeitszeit und Überstunden',
      minimumHolidays: 'Mindesturlaub',
      minimumHolidaysDescription: 'Gesetzliche Urlaubsansprüche und Freizeit',
      employeeProtection: 'Arbeitnehmerschutz',
      employeeProtectionDescription: 'Rechte und Schutz von Arbeitnehmern nach deutschem Recht',
      
      taxReturn: 'Steuererklärung',
      taxReturnDescription: 'Leitfaden zur Abgabe der Steuererklärung in Deutschland',
      taxClasses: 'Steuerklassen',
      taxClassesDescription: 'Erklärung der deutschen Steuerklassen und ihrer Anwendung',
      
      pensionInsurance: 'Rentenversicherung',
      pensionInsuranceDescription: 'Informationen über das deutsche Rentensystem',
      childBenefits: 'Kindergeld',
      childBenefitsDescription: 'Informationen über Kindergeld und Familienleistungen',
      parentalAllowance: 'Elterngeld',
      parentalAllowanceDescription: 'Informationen über Elterngeld für Eltern',
      
      healthInsuranceSystem: 'Krankenversicherungssystem',
      healthInsuranceSystemDescription: 'Überblick über das deutsche Krankenversicherungssystem für ausländische Arbeitnehmer',

      // UI translations
      details: 'Details',
      noLawsFound: 'Keine Gesetze gefunden',
      tryChangeCategory: 'Versuchen Sie, die Kategorie zu ändern',
      lawsCount: 'Gesetze',
      lawNotFound: 'Gesetz nicht gefunden',
      overview: 'Übersicht',
      keyPoints: 'Hauptpunkte',
      keyPoint1: 'Erster wichtiger Punkt dieses Gesetzes',
      keyPoint2: 'Zweiter wichtiger Punkt dieses Gesetzes',
      keyPoint3: 'Dritter wichtiger Punkt dieses Gesetzes',
      legalRequirements: 'Rechtliche Anforderungen',
      requirement1: 'Erste Anforderung',
      requirementDesc1: 'Beschreibung der ersten Anforderung',
      requirement2: 'Zweite Anforderung',
      requirementDesc2: 'Beschreibung der zweiten Anforderung',
      resources: 'Ressourcen',
      officialDocument: 'Offizielles Dokument',
      additionalInfo: 'Zusätzliche Informationen',

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
      lawsDescriptionMobile: 'Przewodnik po niemieckim prawie',
      allLaws: 'Wszystkie prawa',
      allLawsDescription: 'Pokaż wszystkie dostępne prawa i przepisy',
      
      work: 'Praca',
      tax: 'Podatki',
      social: 'Socjalne',
      health: 'Zdrowie',
      workLaw: 'Prawo pracy',
      workLawDescription: 'Przepisy dotyczące umów o pracę i praw pracowników',
      taxes: 'Podatki',
      taxesDescription: 'Przepisy podatkowe dla pracowników',
      socialSecurity: 'Ubezpieczenia społeczne',
      socialSecurityDescription: 'System ubezpieczeń społecznych i świadczenia',
      healthInsurance: 'Ubezpieczenie zdrowotne',
      healthInsuranceDescription: 'System ubezpieczenia zdrowotnego i pokrycie',
      legalAid: 'Pomoc prawna',
      legalAidDescription: 'Możliwości bezpłatnej pomocy prawnej dla zagranicznych pracowników',

      // Individual law titles and descriptions
      minimumWage: 'Płaca minimalna',
      minimumWageDescription: 'Aktualne stawki płacy minimalnej i zasady dla pracowników',
      workContract: 'Umowa o pracę',
      workContractDescription: 'Podstawowe informacje o umowach o pracę i prawach',
      workingHours: 'Czas pracy',
      workingHoursDescription: 'Zasady czasu pracy i nadgodzin',
      minimumHolidays: 'Minimalny urlop',
      minimumHolidaysDescription: 'Ustawowe prawa do urlopu i wolnego czasu',
      employeeProtection: 'Ochrona pracowników',
      employeeProtectionDescription: 'Prawa i ochrona pracowników według niemieckiego prawa',
      
      taxReturn: 'Zeznanie podatkowe',
      taxReturnDescription: 'Przewodnik po składaniu zeznania podatkowego w Niemczech',
      taxClasses: 'Klasy podatkowe',
      taxClassesDescription: 'Wyjaśnienie niemieckich klas podatkowych i ich zastosowania',
      
      pensionInsurance: 'Ubezpieczenie emerytalne',
      pensionInsuranceDescription: 'Informacje o niemieckim systemie emerytalnym',
      childBenefits: 'Zasiłek na dziecko',
      childBenefitsDescription: 'Informacje o zasiłku na dziecko i świadczeniach rodzinnych',
      parentalAllowance: 'Zasiłek rodzicielski',
      parentalAllowanceDescription: 'Informacje o zasiłku rodzicielskim (Elterngeld)',
      
      healthInsuranceSystem: 'System ubezpieczenia zdrowotnego',
      healthInsuranceSystemDescription: 'Przegląd niemieckiego systemu ubezpieczenia zdrowotnego dla zagranicznych pracowników',

      // UI translations
      details: 'Szczegóły',
      noLawsFound: 'Nie znaleziono praw',
      tryChangeCategory: 'Spróbuj zmienić kategorię',
      lawsCount: 'praw',
      lawNotFound: 'Prawo nie zostało znalezione',
      overview: 'Przegląd',
      keyPoints: 'Kluczowe punkty',
      keyPoint1: 'Pierwszy ważny punkt tego prawa',
      keyPoint2: 'Drugi ważny punkt tego prawa',
      keyPoint3: 'Trzeci ważny punkt tego prawa',
      legalRequirements: 'Wymagania prawne',
      requirement1: 'Pierwszy wymóg',
      requirementDesc1: 'Opis pierwszego wymogu',
      requirement2: 'Drugi wymóg',
      requirementDesc2: 'Opis drugiego wymogu',
      resources: 'Zasoby',
      officialDocument: 'Oficjalny dokument',
      additionalInfo: 'Dodatkowe informacje',

      // Merge specific Polish translations
      ...workLawTranslations.pl.laws,
      ...taxesTranslations.pl.laws,
      ...socialSecurityTranslations.pl.laws,
      ...healthInsuranceTranslations.pl.laws,
      ...legalAidTranslations.pl.laws,
    },
  },
};

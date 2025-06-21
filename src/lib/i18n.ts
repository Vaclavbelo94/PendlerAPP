export type Language = 'cs' | 'pl' | 'de';

export const translations = {
  cs: {
    welcome: 'Vítejte',
    dashboard: 'Nástěnka',
    laws: 'Zákony',
    shifts: 'Směny',
    calculator: 'Kalkulačka',
    profile: 'Profil',
    settings: 'Nastavení',
    language: 'Jazyk',
    logout: 'Odhlásit se',
    
    // Laws section translations
    lawsGuide: 'Průvodce německými zákony',
    germanLaws: 'Německé zákony',
    lawsDescription: 'Kompletní průvodce německými zákony pro zahraniční pracovníky. Najděte vše, co potřebujete vědět o pracovním právu, daních a sociálním zabezpečení.',
    lawsDescriptionMobile: 'Průvodce německými zákony pro zahraniční pracovníky',
    allLaws: 'Všechny zákony',
    allLawsDescription: 'Kompletní přehled všech zákonů',
    workLaw: 'Pracovní právo',
    workLawDescription: 'Pracovní smlouvy, ochrana zaměstnanců',
    taxes: 'Daně',
    taxesDescription: 'Daňové třídy, přiznání, odvody',
    socialSecurity: 'Sociální zabezpečení',
    socialSecurityDescription: 'Důchody, dávky, pojištění',
    healthInsurance: 'Zdravotní pojištění',
    healthInsuranceDescription: 'Systém zdravotního pojištění',
    updated: 'Aktualizováno',
    readMore: 'Číst více',
    noLawsFound: 'Žádné zákony nebyly nalezeny',
    tryChangeCategory: 'Zkuste změnit kategorii',
    lawsCount: 'zákonů',
    
    // Individual law translations
    minimumWage: 'Minimální mzda',
    minimumWageDescription: 'Aktuální výše minimální mzdy v Německu a podmínky',
    taxClasses: 'Daňové třídy',
    taxClassesDescription: 'Přehled daňových tříd a jejich aplikace',
    healthInsuranceSystem: 'Zdravotní pojištění',
    healthInsuranceSystemDescription: 'Systém zdravotního pojištění v Německu',
    workContract: 'Pracovní smlouva',
    workContractDescription: 'Náležitosti a typy pracovních smluv',
    taxReturn: 'Daňové přiznání',
    taxReturnDescription: 'Jak podat daňové přiznání v Německu',
    pensionInsurance: 'Důchodové pojištění',
    pensionInsuranceDescription: 'Německý důchodový systém pro pendlery',
    employeeProtection: 'Ochrana zaměstnanců',
    employeeProtectionDescription: 'Práva a ochrana zaměstnanců v Německu',
    childBenefits: 'Přídavky na děti',
    childBenefitsDescription: 'Kindergeld a další dávky pro rodiny',
    workingHours: 'Pracovní doba',
    workingHoursDescription: 'Zákonná úprava pracovní doby a přestávek',
    minimumHolidays: 'Minimální dovolená',
    minimumHolidaysDescription: 'Zákonný nárok na dovolenou v Německu',
    parentalAllowance: 'Rodičovský příspěvek',
    parentalAllowanceDescription: 'Elterngeld a podpora pro rodiče',
    legalAid: 'Právní pomoc',
    legalAidDescription: 'Možnosti právní pomoci pro zahraniční pracovníky',
    
    // Detailed content translations
    backToLaws: 'Zpět na Přehled zákonů',
    currentMinimumWage: 'Aktuální minimální mzda',
    whoIsEntitled: 'Kdo má nárok na minimální mzdu',
    exceptions: 'Výjimky z minimální mzdy',
    practicalInfo: 'Praktické informace',
    complianceControl: 'Kontrola dodržování',
    reportViolations: 'Kde nahlásit porušení',
    
    // Tax classes content
    taxClassesOverview: 'Přehled daňových tříd',
    howToChoose: 'Jak si vybrat správnou třídu',
    
    // Health insurance content
    typesOfInsurance: 'Typy zdravotního pojištění',
    insuranceContributions: 'Příspěvky na zdravotní pojištění',
    whatIsCovered: 'Co pokrývá zákonné pojištění',
    
    // Work contract content
    contractRequirements: 'Náležitosti pracovní smlouvy',
    probationPeriod: 'Zkušební doba',
    typesOfEmployment: 'Formy pracovního poměru',
    
    // Employee protection content
    basicRights: 'Základní práva zaměstnanců',
    dismissalProtection: 'Zákon o ochraně před propuštěním',
    workplaceSafety: 'Pracovní bezpečnost',
    antiDiscrimination: 'Ochrana před diskriminací',
    
    // Working hours content
    workingTimeAct: 'Zákon o pracovní době (ArbZG)',
    breaksAndRest: 'Přestávky a pauzy',
    nightWork: 'Noční práce a směnnost',
    sundayWork: 'Nedělní a sváteční práce',
    flexibleHours: 'Flexibilní pracovní doba',
    
    // Legal aid content
    freeLegalAid: 'Bezplatná právní pomoc',
    whereToGetHelp: 'Kde získat právní pomoc',
    laborLawAdvice: 'Pracovněprávní poradny',
    importantContacts: 'Důležité kontakty'
  },
  
  pl: {
    welcome: 'Witamy',
    dashboard: 'Panel',
    laws: 'Prawo',
    shifts: 'Zmiany',
    calculator: 'Kalkulator',
    profile: 'Profil',
    settings: 'Ustawienia',
    language: 'Język',
    logout: 'Wyloguj się',
    
    // Laws section translations
    lawsGuide: 'Przewodnik po niemieckim prawie',
    germanLaws: 'Niemieckie prawo',
    lawsDescription: 'Kompletny przewodnik po niemieckim prawie dla pracowników zagranicznych. Znajdź wszystko, co musisz wiedzieć o prawie pracy, podatkach i ubezpieczeniach społecznych.',
    lawsDescriptionMobile: 'Przewodnik po niemieckim prawie dla pracowników zagranicznych',
    allLaws: 'Wszystkie przepisy',
    allLawsDescription: 'Kompletny przegląd wszystkich przepisów',
    workLaw: 'Prawo pracy',
    workLawDescription: 'Umowy o pracę, ochrona pracowników',
    taxes: 'Podatki',
    taxesDescription: 'Klasy podatkowe, zeznania, odprowadzanie',
    socialSecurity: 'Ubezpieczenia społeczne',
    socialSecurityDescription: 'Emerytury, świadczenia, ubezpieczenia',
    healthInsurance: 'Ubezpieczenie zdrowotne',
    healthInsuranceDescription: 'System ubezpieczeń zdrowotnych',
    updated: 'Zaktualizowano',
    readMore: 'Czytaj więcej',
    noLawsFound: 'Nie znaleziono przepisów',
    tryChangeCategory: 'Spróbuj zmienić kategorię',
    lawsCount: 'przepisów',
    
    // Individual law translations
    minimumWage: 'Płaca minimalna',
    minimumWageDescription: 'Aktualna wysokość płacy minimalnej w Niemczech i warunki',
    taxClasses: 'Klasy podatkowe',
    taxClassesDescription: 'Przegląd klas podatkowych i ich zastosowanie',
    healthInsuranceSystem: 'Ubezpieczenie zdrowotne',
    healthInsuranceSystemDescription: 'System ubezpieczeń zdrowotnych w Niemczech',
    workContract: 'Umowa o pracę',
    workContractDescription: 'Elementy i rodzaje umów o pracę',
    taxReturn: 'Zeznanie podatkowe',
    taxReturnDescription: 'Jak złożyć zeznanie podatkowe w Niemczech',
    pensionInsurance: 'Ubezpieczenie emerytalne',
    pensionInsuranceDescription: 'Niemiecki system emerytalny dla dojeżdżających',
    employeeProtection: 'Ochrona pracowników',
    employeeProtectionDescription: 'Prawa i ochrona pracowników w Niemczech',
    childBenefits: 'Zasiłki na dzieci',
    childBenefitsDescription: 'Kindergeld i inne świadczenia dla rodzin',
    workingHours: 'Czas pracy',
    workingHoursDescription: 'Prawna regulacja czasu pracy i przerw',
    minimumHolidays: 'Minimalny urlop',
    minimumHolidaysDescription: 'Ustawowe prawo do urlopu w Niemczech',
    parentalAllowance: 'Zasiłek rodzicielski',
    parentalAllowanceDescription: 'Elterngeld i wsparcie dla rodziców',
    legalAid: 'Pomoc prawna',
    legalAidDescription: 'Możliwości pomocy prawnej dla pracowników zagranicznych',
    
    // Detailed content translations
    backToLaws: 'Powrót do Przeglądu przepisów',
    currentMinimumWage: 'Aktualna płaca minimalna',
    whoIsEntitled: 'Kto ma prawo do płacy minimalnej',
    exceptions: 'Wyjątki od płacy minimalnej',
    practicalInfo: 'Informacje praktyczne',
    complianceControl: 'Kontrola przestrzegania',
    reportViolations: 'Gdzie zgłaszać naruszenia',
    
    // Tax classes content
    taxClassesOverview: 'Przegląd klas podatkowych',
    howToChoose: 'Jak wybrać właściwą klasę',
    
    // Health insurance content
    typesOfInsurance: 'Rodzaje ubezpieczenia',
    insuranceContributions: 'Składki ubezpieczeniowe',
    whatIsCovered: 'Co obejmuje ubezpieczenie ustawowe',
    
    // Work contract content
    contractRequirements: 'Elementy umowy o pracę',
    probationPeriod: 'Okres próbny',
    typesOfEmployment: 'Formy zatrudnienia',
    
    // Employee protection content
    basicRights: 'Podstawowe prawa pracowników',
    dismissalProtection: 'Ustawa o ochronie przed zwolnieniem',
    workplaceSafety: 'Bezpieczeństwo pracy',
    antiDiscrimination: 'Ochrona przed dyskryminacją',
    
    // Working hours content
    workingTimeAct: 'Ustawa o czasie pracy (ArbZG)',
    breaksAndRest: 'Przerwy i odpoczynek',
    nightWork: 'Praca nocna i zmianowa',
    sundayWork: 'Praca w niedziele i święta',
    flexibleHours: 'Elastyczny czas pracy',
    
    // Legal aid content
    freeLegalAid: 'Bezpłatna pomoc prawna',
    whereToGetHelp: 'Gdzie uzyskać pomoc prawną',
    laborLawAdvice: 'Poradnie prawa pracy',
    importantContacts: 'Ważne kontakty'
  },
  
  de: {
    welcome: 'Willkommen',
    dashboard: 'Dashboard',
    laws: 'Gesetze',
    shifts: 'Schichten',
    calculator: 'Rechner',
    profile: 'Profil',
    settings: 'Einstellungen',
    language: 'Sprache',
    logout: 'Abmelden',
    
    // Laws section translations
    lawsGuide: 'Leitfaden für deutsche Gesetze',
    germanLaws: 'Deutsche Gesetze',
    lawsDescription: 'Vollständiger Leitfaden zu deutschen Gesetzen für ausländische Arbeitnehmer. Finden Sie alles, was Sie über Arbeitsrecht, Steuern und Sozialversicherung wissen müssen.',
    lawsDescriptionMobile: 'Leitfaden zu deutschen Gesetzen für ausländische Arbeitnehmer',
    allLaws: 'Alle Gesetze',
    allLawsDescription: 'Vollständige Übersicht aller Gesetze',
    workLaw: 'Arbeitsrecht',
    workLawDescription: 'Arbeitsverträge, Arbeitnehmerschutz',
    taxes: 'Steuern',
    taxesDescription: 'Steuerklassen, Erklärungen, Abgaben',
    socialSecurity: 'Sozialversicherung',
    socialSecurityDescription: 'Renten, Leistungen, Versicherungen',
    healthInsurance: 'Krankenversicherung',
    healthInsuranceDescription: 'Krankenversicherungssystem',
    updated: 'Aktualisiert',
    readMore: 'Weiterlesen',
    noLawsFound: 'Keine Gesetze gefunden',
    tryChangeCategory: 'Versuchen Sie eine andere Kategorie',
    lawsCount: 'Gesetze',
    
    // Individual law translations
    minimumWage: 'Mindestlohn',
    minimumWageDescription: 'Aktuelle Höhe des Mindestlohns in Deutschland und Bedingungen',
    taxClasses: 'Steuerklassen',
    taxClassesDescription: 'Übersicht der Steuerklassen und ihre Anwendung',
    healthInsuranceSystem: 'Krankenversicherung',
    healthInsuranceSystemDescription: 'Das Krankenversicherungssystem in Deutschland',
    workContract: 'Arbeitsvertrag',
    workContractDescription: 'Bestandteile und Arten von Arbeitsverträgen',
    taxReturn: 'Steuererklärung',
    taxReturnDescription: 'Wie man eine Steuererklärung in Deutschland abgibt',
    pensionInsurance: 'Rentenversicherung',
    pensionInsuranceDescription: 'Das deutsche Rentensystem für Pendler',
    employeeProtection: 'Arbeitnehmerschutz',
    employeeProtectionDescription: 'Rechte und Schutz von Arbeitnehmern in Deutschland',
    childBenefits: 'Kindergeld',
    childBenefitsDescription: 'Kindergeld und andere Leistungen für Familien',
    workingHours: 'Arbeitszeit',
    workingHoursDescription: 'Gesetzliche Regelung der Arbeitszeit und Pausen',
    minimumHolidays: 'Mindestunlaub',
    minimumHolidaysDescription: 'Gesetzlicher Anspruch auf Urlaub in Deutschland',
    parentalAllowance: 'Elterngeld',
    parentalAllowanceDescription: 'Elterngeld und Unterstützung für Eltern',
    legalAid: 'Rechtshilfe',
    legalAidDescription: 'Rechtshilfemöglichkeiten für ausländische Arbeitnehmer',
    
    // Detailed content translations
    backToLaws: 'Zurück zur Gesetzesübersicht',
    currentMinimumWage: 'Aktueller Mindestlohn',
    whoIsEntitled: 'Wer hat Anspruch auf Mindestlohn',
    exceptions: 'Ausnahmen vom Mindestlohn',
    practicalInfo: 'Praktische Informationen',
    complianceControl: 'Einhaltungskontrolle',
    reportViolations: 'Wo Verstöße melden',
    
    // Tax classes content
    taxClassesOverview: 'Übersicht der Steuerklassen',
    howToChoose: 'Wie man die richtige Klasse wählt',
    
    // Health insurance content
    typesOfInsurance: 'Versicherungsarten',
    insuranceContributions: 'Versicherungsbeiträge',
    whatIsCovered: 'Was die gesetzliche Versicherung abdeckt',
    
    // Work contract content
    contractRequirements: 'Bestandteile des Arbeitsvertrags',
    probationPeriod: 'Probezeit',
    typesOfEmployment: 'Beschäftigungsformen',
    
    // Employee protection content
    basicRights: 'Grundrechte der Arbeitnehmer',
    dismissalProtection: 'Kündigungsschutzgesetz',
    workplaceSafety: 'Arbeitsschutz',
    antiDiscrimination: 'Schutz vor Diskriminierung',
    
    // Working hours content
    workingTimeAct: 'Arbeitszeitgesetz (ArbZG)',
    breaksAndRest: 'Pausen und Ruhezeiten',
    nightWork: 'Nachtarbeit und Schichtarbeit',
    sundayWork: 'Sonn- und Feiertagsarbeit',
    flexibleHours: 'Flexible Arbeitszeit',
    
    // Legal aid content
    freeLegalAid: 'Kostenlose Rechtshilfe',
    whereToGetHelp: 'Wo man Rechtshilfe bekommt',
    laborLawAdvice: 'Arbeitsrechtsberatung',
    importantContacts: 'Wichtige Kontakte'
  }
};

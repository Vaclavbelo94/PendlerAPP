
export type Language = 'cs' | 'pl' | 'de';

export const languages = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export const translations = {
  cs: {
    // Základní
    loading: 'Načítání...',
    error: 'Chyba',
    success: 'Úspěch',
    warning: 'Varování',
    info: 'Informace',
    
    // Navigace
    dashboard: 'Dashboard',
    shifts: 'Směny',
    vehicle: 'Vozidlo',
    translator: 'Překladač',
    taxAdvisor: 'Daňový poradce',
    travel: 'Cestování',
    laws: 'Zákony',
    premium: 'Premium',
    profile: 'Profil',
    settings: 'Nastavení',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Ochrana osobních údajů',
    terms: 'Podmínky',
    cookies: 'Cookies',
    
    // Obecné akce
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
    add: 'Přidat',
    close: 'Zavřít',
    back: 'Zpět',
    next: 'Další',
    previous: 'Předchozí',
    submit: 'Odeslat',
    confirm: 'Potvrdit',
    download: 'Stáhnout',
    upload: 'Nahrát',
    
    // Přihlášení a registrace
    login: 'Přihlášení',
    register: 'Registrace',
    logout: 'Odhlásit se',
    email: 'E-mail',
    password: 'Heslo',
    confirmPassword: 'Potvrdit heslo',
    forgotPassword: 'Zapomenuté heslo',
    rememberMe: 'Zapamatovat si mě',
    
    // Dashboard
    welcome: 'Vítejte',
    welcomeUser: 'Vítejte, {username}!',
    welcomeDescription: 'Zde najdete přehled všech důležitých informací a funkcí.',
    overview: 'Přehled',
    statistics: 'Statistiky',
    recentActivity: 'Nedávná aktivita',
    
    // Směny
    addShift: 'Přidat směnu',
    editShift: 'Upravit směnu',
    deleteShift: 'Smazat směnu',
    shiftType: 'Typ směny',
    startTime: 'Začátek',
    endTime: 'Konec',
    
    // Vozidlo
    vehicleInfo: 'Informace o vozidle',
    fuelConsumption: 'Spotřeba paliva',
    maintenance: 'Údržba',
    
    // Překladač
    translateText: 'Přeložit text',
    sourceLanguage: 'Zdrojový jazyk',
    targetLanguage: 'Cílový jazyk',
    translation: 'Překlad',
    
    // Daňový poradce
    taxAdvisorDescription: 'Pomoc s daňovými povinnostmi v Německu',
    taxCalculator: 'Daňová kalkulačka',
    taxDocuments: 'Daňové dokumenty',
    
    // Kontakt
    contactTitle: 'Kontaktujte nás',
    contactSubtitle: 'Máte otázky? Rádi vám pomůžeme.',
    contactInfo: 'Kontaktní informace',
    contactEmail: 'E-mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adresa',
    contactFormTitle: 'Napište nám',
    contactName: 'Jméno',
    contactNamePlaceholder: 'Vaše jméno',
    contactMessage: 'Zpráva',
    contactMessagePlaceholder: 'Vaše zpráva...',
    contactResponseTime: 'Odpovíme do 24 hodin',
    contactWorkingHours: 'Po-Pá 9:00-17:00',
    
    // Footer
    'footer.appName': 'Pendlerův Pomocník',
    'footer.features': 'Funkce',
    'footer.aboutUs': 'O nás',
    'footer.allRightsReserved': 'Všechna práva vyhrazena',
    
    // Priorita
    priority: 'Priorita',
    highPriority: 'Vysoká priorita',
    mediumPriority: 'Střední priorita',
    lowPriority: 'Nízká priorita',
    
    // Ostatní
    user: 'uživatel',
    name: 'Jméno',
    description: 'Popis',
    date: 'Datum',
    time: 'Čas',
    status: 'Stav',
    active: 'Aktivní',
    inactive: 'Neaktivní',
    
    // Premium
    newUserTips: 'Tipy pro nové uživatele',
    liveTraining: 'Živá školení a workshopy',
    knowledgeBase: 'Rozsáhlá databáze znalostí',
    notifications: 'Personalizované notifikace',
    showFaqHelp: 'Zobrazit FAQ a nápovědu',
    premiumBenefits: 'Premium výhody',
    advancedFeatures: 'Pokročilé funkce a nástroje',
    allLanguageExercises: 'Všechna jazyková cvičení',
    exportData: 'Export dat a reportů',
    activatePremium: 'Aktivovat Premium',
    
    // Formuláře
    firstName: 'Křestní jméno',
    lastName: 'Příjmení',
    phone: 'Telefon',
    address: 'Adresa',
    city: 'Město',
    zipCode: 'PSČ',
    country: 'Země',
    
    // Chybové zprávy
    requiredField: 'Toto pole je povinné',
    invalidEmail: 'Neplatná e-mailová adresa',
    passwordTooShort: 'Heslo musí mít alespoň 6 znaků',
    passwordsDoNotMatch: 'Hesla se neshodují',
    
    // Úspěšné zprávy
    dataSaved: 'Data byla úspěšně uložena',
    profileUpdated: 'Profil byl aktualizován',
    emailSent: 'E-mail byl odeslán',
    
    // Daňové
    taxReturnGuide: {
      title: 'Průvodce daňovým přiznáním',
      overviewTitle: 'Postup podání daňového přiznání',
      needHelp: 'Potřebujete pomoc?',
      needHelpDescription: 'Kontaktujte našeho daňového poradce',
      requiredDocuments: 'Požadované dokumenty',
      importantDeadlines: 'Důležité termíny',
      deadlineWarning: 'Nezapomeňte na včasné podání daňového přiznání',
      documentExamples: 'Příklady dokumentů',
      documentExamplesDescription: 'Podívejte se na vzorové dokumenty',
      steps: {
        prepareDocuments: {
          title: 'Příprava dokumentů',
          content: 'Shromážděte všechny potřebné daňové dokumenty'
        },
        createElsterAccount: {
          title: 'Vytvoření ELSTER účtu',
          content: 'Zaregistrujte se v systému ELSTER'
        },
        fillForms: {
          title: 'Vyplnění formulářů',
          content: 'Vyplňte příslušné daňové formuláře'
        },
        submitReturn: {
          title: 'Podání přiznání',
          content: 'Odešlete daňové přiznání elektronicky'
        },
        checkDecision: {
          title: 'Kontrola rozhodnutí',
          content: 'Zkontrolujte rozhodnutí finančního úřadu'
        }
      },
      deadlines: {
        standard: {
          title: 'Standardní termín',
          date: '31. července',
          description: 'Pro podání bez daňového poradce'
        },
        extended: {
          title: 'Prodloužený termín',
          date: '28. února následujícího roku',
          description: 'S pomocí daňového poradce'
        },
        late: {
          title: 'Opožděné podání',
          fee: 'Pokuta od 25 EUR měsíčně',
          description: 'Za každý započatý měsíc zpoždění'
        }
      },
      documents: {
        lohnsteuerbescheinigung: 'Potvrzení o srážkové dani od zaměstnavatele',
        pendlerpauschale: 'Doklady o dojíždění do práce',
        werbungskosten: 'Výdaje související s povoláním',
        sonderausgaben: 'Zvláštní výdaje (pojištění, dary)',
        aussergewoehnlicheBelastungen: 'Mimořádné zatížení (léčebné výdaje)'
      }
    },
    
    deadlines: 'Termíny',
    documents: 'Dokumenty',
    showExamples: 'Zobrazit příklady',
    
    // Kalkulačky
    taxCalculators: 'Daňové kalkulačky',
    quickCalculations: 'Rychlé výpočty daní a odvodů',
    germanCalculator: 'Německá kalkulačka',
    calculatorDescription: 'Výpočet daní podle aktuálních sazeb',
    calculationHistory: 'Historie výpočtů',
    loggedInSaves: 'Výpočty se automaticky ukládají',
    notLoggedInNoSave: 'Přihlaste se pro uložení výpočtů',
    optimizationTips: 'Tipy pro optimalizaci',
    germanTaxCalculator2024: 'Německá daňová kalkulačka 2024',
    currentRates: 'Aktuální sazby',
    
    // Nové překlady pro dokumenty
    documentExamples: {
      title: 'Příklady dokumentů',
      description: 'Vzorové dokumenty pro různé situace',
      types: {
        taxReturn: 'Daňové přiznání',
        commuterCertificate: 'Potvrzení o dojíždění',
        taxReductionApplication: 'Žádost o snížení daně',
        workToolsCertificate: 'Potvrzení o pracovních pomůckách'
      },
      sampleNotes: {
        developer: 'Vzorové poznámky pro vývojáře pracujícího v Německu'
      }
    },
    
    employer: 'Zaměstnavatel',
    income: 'Příjem',
    commuting: 'Dojíždění',
    preview: 'Náhled',
    documentPreview: 'Náhled dokumentu',
    personalData: 'Osobní údaje',
    workData: 'Pracovní údaje',
    taxId: 'Daňové číslo',
    dateOfBirth: 'Datum narození',
    annualIncome: 'Roční příjem',
    commuteDistance: 'Vzdálenost dojíždění',
    workDays: 'Pracovní dny',
    notes: 'Poznámky',
    downloadThisExample: 'Stáhnout tento příklad',
    closePreview: 'Zavřít náhled'
  },
  
  pl: {
    // Podstawowe
    loading: 'Ładowanie...',
    error: 'Błąd',
    success: 'Sukces',
    warning: 'Ostrzeżenie',
    info: 'Informacja',
    
    // Nawigacja
    dashboard: 'Panel',
    shifts: 'Zmiany',
    vehicle: 'Pojazd',
    translator: 'Tłumacz',
    taxAdvisor: 'Doradca podatkowy',
    travel: 'Podróże',
    laws: 'Prawo',
    premium: 'Premium',
    profile: 'Profil',
    settings: 'Ustawienia',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Ochrona danych',
    terms: 'Warunki',
    cookies: 'Cookies',
    
    // Ogólne akcje
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    add: 'Dodaj',
    close: 'Zamknij',
    back: 'Wstecz',
    next: 'Dalej',
    previous: 'Poprzedni',
    submit: 'Wyślij',
    confirm: 'Potwierdź',
    download: 'Pobierz',
    upload: 'Prześlij',
    
    // Logowanie i rejestracja
    login: 'Logowanie',
    register: 'Rejestracja',
    logout: 'Wyloguj się',
    email: 'E-mail',
    password: 'Hasło',
    confirmPassword: 'Potwierdź hasło',
    forgotPassword: 'Zapomniałeś hasła',
    rememberMe: 'Zapamiętaj mnie',
    
    // Dashboard
    welcome: 'Witamy',
    welcomeUser: 'Witamy, {username}!',
    welcomeDescription: 'Tutaj znajdziesz przegląd wszystkich ważnych informacji i funkcji.',
    overview: 'Przegląd',
    statistics: 'Statystyki',
    recentActivity: 'Ostatnia aktywność',
    
    // Zmiany
    addShift: 'Dodaj zmianę',
    editShift: 'Edytuj zmianę',
    deleteShift: 'Usuń zmianę',
    shiftType: 'Typ zmiany',
    startTime: 'Początek',
    endTime: 'Koniec',
    
    // Pojazd
    vehicleInfo: 'Informacje o pojeździe',
    fuelConsumption: 'Zużycie paliwa',
    maintenance: 'Konserwacja',
    
    // Tłumacz
    translateText: 'Przetłumacz tekst',
    sourceLanguage: 'Język źródłowy',
    targetLanguage: 'Język docelowy',
    translation: 'Tłumaczenie',
    
    // Doradca podatkowy
    taxAdvisorDescription: 'Pomoc w sprawach podatkowych w Niemczech',
    taxCalculator: 'Kalkulator podatkowy',
    taxDocuments: 'Dokumenty podatkowe',
    
    // Kontakt
    contactTitle: 'Skontaktuj się z nami',
    contactSubtitle: 'Masz pytania? Chętnie pomożemy.',
    contactInfo: 'Informacje kontaktowe',
    contactEmail: 'E-mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adres',
    contactFormTitle: 'Napisz do nas',
    contactName: 'Imię',
    contactNamePlaceholder: 'Twoje imię',
    contactMessage: 'Wiadomość',
    contactMessagePlaceholder: 'Twoja wiadomość...',
    contactResponseTime: 'Odpowiemy w ciągu 24 godzin',
    contactWorkingHours: 'Pn-Pt 9:00-17:00',
    
    // Footer
    'footer.appName': 'Pomocnik Pracownika',
    'footer.features': 'Funkcje',
    'footer.aboutUs': 'O nas',
    'footer.allRightsReserved': 'Wszystkie prawa zastrzeżone',
    
    // Priorytet
    priority: 'Priorytet',
    highPriority: 'Wysoki priorytet',
    mediumPriority: 'Średni priorytet',
    lowPriority: 'Niski priorytet',
    
    // Inne
    user: 'użytkownik',
    name: 'Imię',
    description: 'Opis',
    date: 'Data',
    time: 'Czas',
    status: 'Status',
    active: 'Aktywny',
    inactive: 'Nieaktywny',
    
    // Premium
    newUserTips: 'Wskazówki dla nowych użytkowników',
    liveTraining: 'Szkolenia na żywo i warsztaty',
    knowledgeBase: 'Obszerna baza wiedzy',
    notifications: 'Spersonalizowane powiadomienia',
    showFaqHelp: 'Pokaż FAQ i pomoc',
    premiumBenefits: 'Korzyści Premium',
    advancedFeatures: 'Zaawansowane funkcje i narzędzia',
    allLanguageExercises: 'Wszystkie ćwiczenia językowe',
    exportData: 'Eksport danych i raportów',
    activatePremium: 'Aktywuj Premium',
    
    // Formularze
    firstName: 'Imię',
    lastName: 'Nazwisko',
    phone: 'Telefon',
    address: 'Adres',
    city: 'Miasto',
    zipCode: 'Kod pocztowy',
    country: 'Kraj',
    
    // Komunikaty błędów
    requiredField: 'To pole jest wymagane',
    invalidEmail: 'Nieprawidłowy adres e-mail',
    passwordTooShort: 'Hasło musi mieć co najmniej 6 znaków',
    passwordsDoNotMatch: 'Hasła nie pasują do siebie',
    
    // Komunikaty sukcesu
    dataSaved: 'Dane zostały pomyślnie zapisane',
    profileUpdated: 'Profil został zaktualizowany',
    emailSent: 'E-mail został wysłany',
    
    // Podatkowe
    taxReturnGuide: {
      title: 'Przewodnik po zeznaniu podatkowym',
      overviewTitle: 'Procedura składania zeznania podatkowego',
      needHelp: 'Potrzebujesz pomocy?',
      needHelpDescription: 'Skontaktuj się z naszym doradcą podatkowym',
      requiredDocuments: 'Wymagane dokumenty',
      importantDeadlines: 'Ważne terminy',
      deadlineWarning: 'Pamiętaj o terminowym złożeniu zeznania podatkowego',
      documentExamples: 'Przykłady dokumentów',
      documentExamplesDescription: 'Zobacz przykładowe dokumenty',
      steps: {
        prepareDocuments: {
          title: 'Przygotowanie dokumentów',
          content: 'Zbierz wszystkie potrzebne dokumenty podatkowe'
        },
        createElsterAccount: {
          title: 'Utworzenie konta ELSTER',
          content: 'Zarejestruj się w systemie ELSTER'
        },
        fillForms: {
          title: 'Wypełnienie formularzy',
          content: 'Wypełnij odpowiednie formularze podatkowe'
        },
        submitReturn: {
          title: 'Złożenie zeznania',
          content: 'Wyślij zeznanie podatkowe elektronicznie'
        },
        checkDecision: {
          title: 'Sprawdzenie decyzji',
          content: 'Sprawdź decyzję urzędu skarbowego'
        }
      },
      deadlines: {
        standard: {
          title: 'Standardowy termin',
          date: '31 lipca',
          description: 'Dla składania bez doradcy podatkowego'
        },
        extended: {
          title: 'Przedłużony termin',
          date: '28 lutego następnego roku',
          description: 'Z pomocą doradcy podatkowego'
        },
        late: {
          title: 'Spóźnione złożenie',
          fee: 'Kara od 25 EUR miesięcznie',
          description: 'Za każdy rozpoczęty miesiąc opóźnienia'
        }
      },
      documents: {
        lohnsteuerbescheinigung: 'Zaświadczenie o podatku od wynagrodzenia od pracodawcy',
        pendlerpauschale: 'Dokumenty dotyczące dojazdów do pracy',
        werbungskosten: 'Wydatki związane z wykonywaniem zawodu',
        sonderausgaben: 'Wydatki specjalne (ubezpieczenia, darowizny)',
        aussergewoehnlicheBelastungen: 'Nadzwyczajne obciążenia (wydatki na leczenie)'
      }
    },
    
    deadlines: 'Terminy',
    documents: 'Dokumenty',
    showExamples: 'Pokaż przykłady',
    
    // Kalkulatory
    taxCalculators: 'Kalkulatory podatkowe',
    quickCalculations: 'Szybkie obliczenia podatków i składek',
    germanCalculator: 'Kalkulator niemiecki',
    calculatorDescription: 'Obliczenie podatków według aktualnych stawek',
    calculationHistory: 'Historia obliczeń',
    loggedInSaves: 'Obliczenia są automatycznie zapisywane',
    notLoggedInNoSave: 'Zaloguj się, aby zapisać obliczenia',
    optimizationTips: 'Wskazówki optymalizacji',
    germanTaxCalculator2024: 'Niemiecki kalkulator podatkowy 2024',
    currentRates: 'Aktualne stawki',
    
    // Nowe tłumaczenia dla dokumentów
    documentExamples: {
      title: 'Przykłady dokumentów',
      description: 'Przykładowe dokumenty dla różnych sytuacji',
      types: {
        taxReturn: 'Zeznanie podatkowe',
        commuterCertificate: 'Zaświadczenie o dojazdach',
        taxReductionApplication: 'Wniosek o obniżenie podatku',
        workToolsCertificate: 'Zaświadczenie o narzędziach pracy'
      },
      sampleNotes: {
        developer: 'Przykładowe notatki dla programisty pracującego w Niemczech'
      }
    },
    
    employer: 'Pracodawca',
    income: 'Dochód',
    commuting: 'Dojazdy',
    preview: 'Podgląd',
    documentPreview: 'Podgląd dokumentu',
    personalData: 'Dane osobowe',
    workData: 'Dane pracy',
    taxId: 'Numer podatkowy',
    dateOfBirth: 'Data urodzenia',
    annualIncome: 'Roczny dochód',
    commuteDistance: 'Odległość dojazdu',
    workDays: 'Dni robocze',
    notes: 'Notatki',
    downloadThisExample: 'Pobierz ten przykład',
    closePreview: 'Zamknij podgląd'
  },
  
  de: {
    // Grundlagen
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    warning: 'Warnung',
    info: 'Information',
    
    // Navigation
    dashboard: 'Dashboard',
    shifts: 'Schichten',
    vehicle: 'Fahrzeug',
    translator: 'Übersetzer',
    taxAdvisor: 'Steuerberater',
    travel: 'Reisen',
    laws: 'Gesetze',
    premium: 'Premium',
    profile: 'Profil',
    settings: 'Einstellungen',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Datenschutz',
    terms: 'Bedingungen',
    cookies: 'Cookies',
    
    // Allgemeine Aktionen
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    close: 'Schließen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    submit: 'Absenden',
    confirm: 'Bestätigen',
    download: 'Herunterladen',
    upload: 'Hochladen',
    
    // Anmeldung und Registrierung
    login: 'Anmeldung',
    register: 'Registrierung',
    logout: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    forgotPassword: 'Passwort vergessen',
    rememberMe: 'Angemeldet bleiben',
    
    // Dashboard
    welcome: 'Willkommen',
    welcomeUser: 'Willkommen, {username}!',
    welcomeDescription: 'Hier finden Sie eine Übersicht aller wichtigen Informationen und Funktionen.',
    overview: 'Übersicht',
    statistics: 'Statistiken',
    recentActivity: 'Letzte Aktivität',
    
    // Schichten
    addShift: 'Schicht hinzufügen',
    editShift: 'Schicht bearbeiten',
    deleteShift: 'Schicht löschen',
    shiftType: 'Schichttyp',
    startTime: 'Beginn',
    endTime: 'Ende',
    
    // Fahrzeug
    vehicleInfo: 'Fahrzeuginformationen',
    fuelConsumption: 'Kraftstoffverbrauch',
    maintenance: 'Wartung',
    
    // Übersetzer
    translateText: 'Text übersetzen',
    sourceLanguage: 'Quellsprache',
    targetLanguage: 'Zielsprache',
    translation: 'Übersetzung',
    
    // Steuerberater
    taxAdvisorDescription: 'Hilfe bei Steuerpflichten in Deutschland',
    taxCalculator: 'Steuerrechner',
    taxDocuments: 'Steuerdokumente',
    
    // Kontakt
    contactTitle: 'Kontaktieren Sie uns',
    contactSubtitle: 'Haben Sie Fragen? Wir helfen gerne.',
    contactInfo: 'Kontaktinformationen',
    contactEmail: 'E-Mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adresse',
    contactFormTitle: 'Schreiben Sie uns',
    contactName: 'Name',
    contactNamePlaceholder: 'Ihr Name',
    contactMessage: 'Nachricht',
    contactMessagePlaceholder: 'Ihre Nachricht...',
    contactResponseTime: 'Wir antworten innerhalb von 24 Stunden',
    contactWorkingHours: 'Mo-Fr 9:00-17:00',
    
    // Footer
    'footer.appName': 'Pendler Helfer',
    'footer.features': 'Funktionen',
    'footer.aboutUs': 'Über uns',
    'footer.allRightsReserved': 'Alle Rechte vorbehalten',
    
    // Priorität
    priority: 'Priorität',
    highPriority: 'Hohe Priorität',
    mediumPriority: 'Mittlere Priorität',
    lowPriority: 'Niedrige Priorität',
    
    // Sonstiges
    user: 'Benutzer',
    name: 'Name',
    description: 'Beschreibung',
    date: 'Datum',
    time: 'Zeit',
    status: 'Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    
    // Premium
    newUserTips: 'Tipps für neue Benutzer',
    liveTraining: 'Live-Schulungen und Workshops',
    knowledgeBase: 'Umfangreiche Wissensdatenbank',
    notifications: 'Personalisierte Benachrichtigungen',
    showFaqHelp: 'FAQ und Hilfe anzeigen',
    premiumBenefits: 'Premium-Vorteile',
    advancedFeatures: 'Erweiterte Funktionen und Tools',
    allLanguageExercises: 'Alle Sprachübungen',
    exportData: 'Datenexport und Berichte',
    activatePremium: 'Premium aktivieren',
    
    // Formulare
    firstName: 'Vorname',
    lastName: 'Nachname',
    phone: 'Telefon',
    address: 'Adresse',
    city: 'Stadt',
    zipCode: 'Postleitzahl',
    country: 'Land',
    
    // Fehlermeldungen
    requiredField: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Ung‧ültige E-Mail-Adresse',
    passwordTooShort: 'Passwort muss mindestens 6 Zeichen haben',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
    
    // Erfolgsmeldungen
    dataSaved: 'Daten wurden erfolgreich gespeichert',
    profileUpdated: 'Profil wurde aktualisiert',
    emailSent: 'E-Mail wurde gesendet',
    
    // Steuerlich
    taxReturnGuide: {
      title: 'Steuererklärung Leitfaden',
      overviewTitle: 'Verfahren zur Abgabe der Steuererklärung',
      needHelp: 'Brauchen Sie Hilfe?',
      needHelpDescription: 'Kontaktieren Sie unseren Steuerberater',
      requiredDocuments: 'Erforderliche Dokumente',
      importantDeadlines: 'Wichtige Termine',
      deadlineWarning: 'Vergessen Sie nicht die rechtzeitige Abgabe der Steuererklärung',
      documentExamples: 'Dokumentbeispiele',
      documentExamplesDescription: 'Sehen Sie sich Musterdokumente an',
      steps: {
        prepareDocuments: {
          title: 'Dokumentenvorbereitung',
          content: 'Sammeln Sie alle erforderlichen Steuerdokumente'
        },
        createElsterAccount: {
          title: 'ELSTER-Konto erstellen',
          content: 'Registrieren Sie sich im ELSTER-System'
        },
        fillForms: {
          title: 'Formulare ausfüllen',
          content: 'Füllen Sie die entsprechenden Steuerformulare aus'
        },
        submitReturn: {
          title: 'Erklärung abgeben',
          content: 'Senden Sie die Steuererklärung elektronisch'
        },
        checkDecision: {
          title: 'Bescheid prüfen',
          content: 'Prüfen Sie den Bescheid des Finanzamts'
        }
      },
      deadlines: {
        standard: {
          title: 'Standardfrist',
          date: '31. Juli',
          description: 'Für Abgabe ohne Steuerberater'
        },
        extended: {
          title: 'Verlängerte Frist',
          date: '28. Februar des Folgejahres',
          description: 'Mit Hilfe eines Steuerberaters'
        },
        late: {
          title: 'Verspätete Abgabe',
          fee: 'Strafe ab 25 EUR monatlich',
          description: 'Für jeden angefangenen Monat Verspätung'
        }
      },
      documents: {
        lohnsteuerbescheinigung: 'Lohnsteuerbescheinigung vom Arbeitgeber',
        pendlerpauschale: 'Belege für Fahrten zur Arbeit',
        werbungskosten: 'Berufsbedingte Ausgaben',
        sonderausgaben: 'Sonderausgaben (Versicherungen, Spenden)',
        aussergewoehnlicheBelastungen: 'Außergewöhnliche Belastungen (Behandlungskosten)'
      }
    },
    
    deadlines: 'Termine',
    documents: 'Dokumente',
    showExamples: 'Beispiele anzeigen',
    
    // Rechner
    taxCalculators: 'Steuerrechner',
    quickCalculations: 'Schnelle Berechnungen von Steuern und Abgaben',
    germanCalculator: 'Deutscher Rechner',
    calculatorDescription: 'Berechnung von Steuern nach aktuellen Sätzen',
    calculationHistory: 'Berechnungshistorie',
    loggedInSaves: 'Berechnungen werden automatisch gespeichert',
    notLoggedInNoSave: 'Melden Sie sich an, um Berechnungen zu speichern',
    optimizationTips: 'Optimierungstipps',
    germanTaxCalculator2024: 'Deutscher Steuerrechner 2024',
    currentRates: 'Aktuelle Sätze',
    
    // Neue Übersetzungen für Dokumente
    documentExamples: {
      title: 'Dokumentbeispiele',
      description: 'Musterdokumente für verschiedene Situationen',
      types: {
        taxReturn: 'Steuererklärung',
        commuterCertificate: 'Pendlerbescheinigung',
        taxReductionApplication: 'Antrag auf Steuerermäßigung',
        workToolsCertificate: 'Arbeitsmittelbescheinigung'
      },
      sampleNotes: {
        developer: 'Beispielnotizen für einen in Deutschland arbeitenden Entwickler'
      }
    },
    
    employer: 'Arbeitgeber',
    income: 'Einkommen',
    commuting: 'Pendeln',
    preview: 'Vorschau',
    documentPreview: 'Dokumentvorschau',
    personalData: 'Persönliche Daten',
    workData: 'Arbeitsdaten',
    taxId: 'Steuernummer',
    dateOfBirth: 'Geburtsdatum',
    annualIncome: 'Jahreseinkommen',
    commuteDistance: 'Pendelentfernung',
    workDays: 'Arbeitstage',
    notes: 'Notizen',
    downloadThisExample: 'Dieses Beispiel herunterladen',
    closePreview: 'Vorschau schließen'
  }
};

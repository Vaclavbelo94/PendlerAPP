
export const languages = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
] as const;

export type Language = typeof languages[number]['code'];

export const translations = {
  cs: {
    // Navigation & Auth
    home: 'Domů',
    dashboard: 'Přehled',
    germanLessons: 'Němčina',
    translator: 'Překladač',
    taxAdvisor: 'Daňový poradce',
    shifts: 'Směny',
    vehicle: 'Vozidlo',
    travel: 'Cesta',
    laws: 'Zákony',
    settings: 'Nastavení',
    premium: 'Premium',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Ochrana soukromí',
    terms: 'Podmínky použití',
    admin: 'Administrace',
    profile: 'Profil',
    login: 'Přihlášení',
    register: 'Registrace',
    logout: 'Odhlášení',
    
    // Common
    loading: 'Načítání...',
    email: 'E-mail',
    password: 'Heslo',
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
    close: 'Zavřít',
    
    // Auth
    loginTitle: 'Přihlášení do účtu',
    loginDescription: 'Vítejte zpět! Přihlaste se do svého účtu.',
    signInWithGoogle: 'Přihlásit se s Google',
    orContinueWith: 'nebo pokračujte s',
    forgotPassword: 'Zapomenuté heslo?',
    dontHaveAccount: 'Nemáte účet?',
    alreadyHaveAccount: 'Již máte účet?',
    
    // Register
    registerTitle: 'Vytvořit nový účet',
    registerDescription: 'Začněte svou cestu s PendlerApp',
    registerWithGoogle: 'Registrovat se s Google',
    registerWithEmail: 'nebo se registrujte e-mailem',
    registerUsername: 'Uživatelské jméno',
    registerUsernamePlaceholder: 'Zadejte uživatelské jméno',
    registerPasswordMinLength: 'Minimálně 6 znaků',
    registerConfirmPassword: 'Potvrdit heslo',
    registerConfirmPasswordPlaceholder: 'Potvrďte své heslo',
    registerCreating: 'Vytvářím účet...',
    registerCreateAccount: 'Vytvořit účet',
    
    // Contact
    contactTitle: 'Kontaktujte nás',
    contactSubtitle: 'Máte dotazy? Rádi vám pomůžeme a odpovíme na všechny vaše otázky.',
    contactInfo: 'Kontaktní informace',
    contactEmail: 'E-mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adresa',
    contactResponseTime: 'Odpovídáme do 24 hodin',
    contactWorkingHours: 'Po-Pá 9:00-17:00',
    contactFormTitle: 'Napište nám zprávu',
    contactName: 'Jméno',
    contactNamePlaceholder: 'Vaše jméno',
    contactMessage: 'Zpráva',
    contactMessagePlaceholder: 'Napište nám svou zprávu...',
    contactSending: 'Odesílám...',
    contactSend: 'Odeslat zprávu',
    
    // Terms
    termsTitle: 'Podmínky použití',
    termsIntro: 'Tyto podmínky upravují používání aplikace PendlerApp a souvisejících služeb.',
    
    // Footer
    footer: {
      appName: 'PendlerApp',
      description: 'Komplexní řešení pro pendlery - správa směn, výuka němčiny a daňové poradenství.',
      allRightsReserved: 'Všechna práva vyhrazena',
      features: 'Funkce',
      aboutUs: 'O nás',
      germanLessons: 'Lekce němčiny',
      lawsOverview: 'Přehled zákonů',
      vehicleManagement: 'Správa vozidla',
      shiftPlanning: 'Plánování směn',
      aboutProject: 'O projektu',
      frequentQuestions: 'Časté otázky',
      website: 'Webové stránky',
      termsOfUse: 'Podmínky použití',
      privacyProtection: 'Ochrana soukromí'
    },
    
    // Terms detailed
    'terms.introTitle': 'Úvod a souhlas s podmínkami',
    'terms.agreement': 'Používáním naší aplikace souhlasíte s těmito podmínkami použití.',
    'terms.registrationTitle': 'Registrace a uživatelský účet',
    'terms.registrationDesc': 'Pro využívání některých funkcí aplikace je nutná registrace.',
    'terms.userResponsibility': 'Uživatel je odpovědný za správnost poskytnutých údajů.',
    'terms.accountTermination': 'Účet může být ukončen při porušení těchto podmínek.',
    'terms.rightsTitle': 'Práva a povinnosti uživatelů',
    'terms.userCommits': 'Uživatel se zavazuje:',
    'terms.noHarm': 'Nepoškozovat fungování aplikace',
    'terms.noIllegalContent': 'Nezveřejňovat nezákonný obsah',
    'terms.noSpam': 'Nerozesílat spam',
    'terms.noTampering': 'Nemanipulovat s daty aplikace',
    'terms.noAutomation': 'Nepoužívat automatizované nástroje',
    'terms.liabilityTitle': 'Omezení odpovědnosti',
    'terms.informationNature': 'Informace v aplikaci mají pouze informativní charakter.',
    'terms.userContentLiability': 'Neneseme odpovědnost za obsah vytvořený uživateli.',
    'terms.thirdPartyLinks': 'Neručíme za obsah odkazovaných stránek třetích stran.',
    'terms.availabilityTitle': 'Dostupnost služby',
    'terms.noGuarantee': 'Nezaručujeme nepřetržitou dostupnost aplikace.',
    'terms.serviceChanges': 'Vyhrazujeme si právo na změny ve službě.',
    'terms.privacyTitle': 'Ochrana osobních údajů',
    'terms.privacyReference': 'Zpracování osobních údajů se řídí našimi zásadami ochrany soukromí.',
    'terms.finalTitle': 'Závěrečná ustanovení',
    'terms.czechLaw': 'Tyto podmínky se řídí českým právem.',
    'terms.termsChanges': 'Podmínky mohou být změněny s předchozím upozorněním.',
    'terms.effectiveDate': 'Tyto podmínky jsou účinné od 1.5.2025.',
    
    // Privacy
    privacyTitle: 'Ochrana osobních údajů',
    privacyIntro: 'Respektujeme vaše soukromí a chráníme vaše osobní údaje v souladu s GDPR.',
    
    // Hero section
    heroTitle: 'Váš spolehlivý pomocník pro práci v Německu',
    heroSubtitle: 'Spravujte směny, učte se němčinu a optimalizujte daně - vše na jednom místě'
  },
  
  de: {
    // Navigation & Auth
    home: 'Startseite',
    dashboard: 'Übersicht',
    germanLessons: 'Deutsch lernen',
    translator: 'Übersetzer',
    taxAdvisor: 'Steuerberater',
    shifts: 'Schichten',
    vehicle: 'Fahrzeug',
    travel: 'Reise',
    laws: 'Gesetze',
    settings: 'Einstellungen',
    premium: 'Premium',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    admin: 'Administration',
    profile: 'Profil',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    
    // Common
    loading: 'Wird geladen...',
    email: 'E-Mail',
    password: 'Passwort',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',
    
    // Auth
    loginTitle: 'In Ihr Konto einloggen',
    loginDescription: 'Willkommen zurück! Melden Sie sich in Ihrem Konto an.',
    signInWithGoogle: 'Mit Google anmelden',
    orContinueWith: 'oder fortfahren mit',
    forgotPassword: 'Passwort vergessen?',
    dontHaveAccount: 'Haben Sie kein Konto?',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    
    // Register
    registerTitle: 'Neues Konto erstellen',
    registerDescription: 'Beginnen Sie Ihre Reise mit PendlerApp',
    registerWithGoogle: 'Mit Google registrieren',
    registerWithEmail: 'oder mit E-Mail registrieren',
    registerUsername: 'Benutzername',
    registerUsernamePlaceholder: 'Geben Sie Ihren Benutzernamen ein',
    registerPasswordMinLength: 'Mindestens 6 Zeichen',
    registerConfirmPassword: 'Passwort bestätigen',
    registerConfirmPasswordPlaceholder: 'Bestätigen Sie Ihr Passwort',
    registerCreating: 'Konto wird erstellt...',
    registerCreateAccount: 'Konto erstellen',
    
    // Contact
    contactTitle: 'Kontaktieren Sie uns',
    contactSubtitle: 'Haben Sie Fragen? Wir helfen Ihnen gerne und beantworten alle Ihre Fragen.',
    contactInfo: 'Kontaktinformationen',
    contactEmail: 'E-Mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adresse',
    contactResponseTime: 'Wir antworten innerhalb von 24 Stunden',
    contactWorkingHours: 'Mo-Fr 9:00-17:00',
    contactFormTitle: 'Schreiben Sie uns eine Nachricht',
    contactName: 'Name',
    contactNamePlaceholder: 'Ihr Name',
    contactMessage: 'Nachricht',
    contactMessagePlaceholder: 'Schreiben Sie uns Ihre Nachricht...',
    contactSending: 'Wird gesendet...',
    contactSend: 'Nachricht senden',
    
    // Terms
    termsTitle: 'Nutzungsbedingungen',
    termsIntro: 'Diese Bedingungen regeln die Nutzung der PendlerApp und verwandter Dienste.',
    
    // Footer
    footer: {
      appName: 'PendlerApp',
      description: 'Komplettlösung für Pendler - Schichtenverwaltung, Deutsch lernen und Steuerberatung.',
      allRightsReserved: 'Alle Rechte vorbehalten',
      features: 'Funktionen',
      aboutUs: 'Über uns',
      germanLessons: 'Deutsch-Lektionen',
      lawsOverview: 'Gesetzesübersicht',
      vehicleManagement: 'Fahrzeugverwaltung',
      shiftPlanning: 'Schichtplanung',
      aboutProject: 'Über das Projekt',
      frequentQuestions: 'Häufige Fragen',
      website: 'Webseite',
      termsOfUse: 'Nutzungsbedingungen',
      privacyProtection: 'Datenschutz'
    },
    
    // Terms detailed
    'terms.introTitle': 'Einführung und Zustimmung zu den Bedingungen',
    'terms.agreement': 'Durch die Nutzung unserer App stimmen Sie diesen Nutzungsbedingungen zu.',
    'terms.registrationTitle': 'Registrierung und Benutzerkonto',
    'terms.registrationDesc': 'Für die Nutzung einiger App-Funktionen ist eine Registrierung erforderlich.',
    'terms.userResponsibility': 'Der Benutzer ist für die Richtigkeit der bereitgestellten Daten verantwortlich.',
    'terms.accountTermination': 'Das Konto kann bei Verletzung dieser Bedingungen gekündigt werden.',
    'terms.rightsTitle': 'Rechte und Pflichten der Benutzer',
    'terms.userCommits': 'Der Benutzer verpflichtet sich:',
    'terms.noHarm': 'Das Funktionieren der App nicht zu beeinträchtigen',
    'terms.noIllegalContent': 'Keine illegalen Inhalte zu veröffentlichen',
    'terms.noSpam': 'Keinen Spam zu versenden',
    'terms.noTampering': 'App-Daten nicht zu manipulieren',
    'terms.noAutomation': 'Keine automatisierten Tools zu verwenden',
    'terms.liabilityTitle': 'Haftungsbeschränkung',
    'terms.informationNature': 'Informationen in der App haben nur informativen Charakter.',
    'terms.userContentLiability': 'Wir übernehmen keine Verantwortung für von Benutzern erstellte Inhalte.',
    'terms.thirdPartyLinks': 'Wir übernehmen keine Garantie für Inhalte verlinkter Drittseiten.',
    'terms.availabilityTitle': 'Verfügbarkeit des Dienstes',
    'terms.noGuarantee': 'Wir garantieren keine ununterbrochene Verfügbarkeit der App.',
    'terms.serviceChanges': 'Wir behalten uns das Recht auf Änderungen am Service vor.',
    'terms.privacyTitle': 'Schutz persönlicher Daten',
    'terms.privacyReference': 'Die Verarbeitung persönlicher Daten richtet sich nach unseren Datenschutzrichtlinien.',
    'terms.finalTitle': 'Schlussbestimmungen',
    'terms.czechLaw': 'Diese Bedingungen unterliegen deutschem Recht.',
    'terms.termsChanges': 'Die Bedingungen können mit vorheriger Ankündigung geändert werden.',
    'terms.effectiveDate': 'Diese Bedingungen sind ab dem 1.5.2025 wirksam.',
    
    // Privacy
    privacyTitle: 'Datenschutz',
    privacyIntro: 'Wir respektieren Ihre Privatsphäre und schützen Ihre persönlichen Daten gemäß DSGVO.',
    
    // Hero section
    heroTitle: 'Ihr zuverlässiger Helfer für die Arbeit in Deutschland',
    heroSubtitle: 'Verwalten Sie Schichten, lernen Sie Deutsch und optimieren Sie Steuern - alles an einem Ort'
  },
  
  pl: {
    // Navigation & Auth
    home: 'Strona główna',
    dashboard: 'Przegląd',
    germanLessons: 'Nauka niemieckiego',
    translator: 'Tłumacz',
    taxAdvisor: 'Doradca podatkowy',
    shifts: 'Zmiany',
    vehicle: 'Pojazd',
    travel: 'Podróż',
    laws: 'Prawo',
    settings: 'Ustawienia',
    premium: 'Premium',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Prywatność',
    terms: 'Warunki użytkowania',
    admin: 'Administracja',
    profile: 'Profil',
    login: 'Logowanie',
    register: 'Rejestracja',
    logout: 'Wyloguj',
    
    // Common
    loading: 'Ładowanie...',
    email: 'E-mail',
    password: 'Hasło',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    close: 'Zamknij',
    
    // Auth
    loginTitle: 'Zaloguj się do konta',
    loginDescription: 'Witamy ponownie! Zaloguj się do swojego konta.',
    signInWithGoogle: 'Zaloguj się przez Google',
    orContinueWith: 'lub kontynuuj z',
    forgotPassword: 'Zapomniałeś hasła?',
    dontHaveAccount: 'Nie masz konta?',
    alreadyHaveAccount: 'Masz już konto?',
    
    // Register
    registerTitle: 'Utwórz nowe konto',
    registerDescription: 'Rozpocznij swoją podróż z PendlerApp',
    registerWithGoogle: 'Zarejestruj się przez Google',
    registerWithEmail: 'lub zarejestruj się e-mailem',
    registerUsername: 'Nazwa użytkownika',
    registerUsernamePlaceholder: 'Wprowadź nazwę użytkownika',
    registerPasswordMinLength: 'Minimum 6 znaków',
    registerConfirmPassword: 'Potwierdź hasło',
    registerConfirmPasswordPlaceholder: 'Potwierdź swoje hasło',
    registerCreating: 'Tworzenie konta...',
    registerCreateAccount: 'Utwórz konto',
    
    // Contact
    contactTitle: 'Skontaktuj się z nami',
    contactSubtitle: 'Masz pytania? Chętnie pomożemy i odpowiemy na wszystkie Twoje pytania.',
    contactInfo: 'Informacje kontaktowe',
    contactEmail: 'E-mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adres',
    contactResponseTime: 'Odpowiadamy w ciągu 24 godzin',
    contactWorkingHours: 'Pn-Pt 9:00-17:00',
    contactFormTitle: 'Napisz do nas wiadomość',
    contactName: 'Imię',
    contactNamePlaceholder: 'Twoje imię',
    contactMessage: 'Wiadomość',
    contactMessagePlaceholder: 'Napisz do nas swoją wiadomość...',
    contactSending: 'Wysyłanie...',
    contactSend: 'Wyślij wiadomość',
    
    // Terms
    termsTitle: 'Warunki użytkowania',
    termsIntro: 'Te warunki regulują korzystanie z aplikacji PendlerApp i powiązanych usług.',
    
    // Footer
    footer: {
      appName: 'PendlerApp',
      description: 'Kompleksowe rozwiązanie dla dojeżdżających - zarządzanie zmianami, nauka niemieckiego i doradztwo podatkowe.',
      allRightsReserved: 'Wszelkie prawa zastrzeżone',
      features: 'Funkcje',
      aboutUs: 'O nas',
      germanLessons: 'Lekcje niemieckiego',
      lawsOverview: 'Przegląd prawa',
      vehicleManagement: 'Zarządzanie pojazdem',
      shiftPlanning: 'Planowanie zmian',
      aboutProject: 'O projekcie',
      frequentQuestions: 'Często zadawane pytania',
      website: 'Strona internetowa',
      termsOfUse: 'Warunki użytkowania',
      privacyProtection: 'Ochrona prywatności'
    },
    
    // Terms detailed
    'terms.introTitle': 'Wstęp i zgoda na warunki',
    'terms.agreement': 'Korzystając z naszej aplikacji, zgadzasz się na te warunki użytkowania.',
    'terms.registrationTitle': 'Rejestracja i konto użytkownika',
    'terms.registrationDesc': 'Do korzystania z niektórych funkcji aplikacji wymagana jest rejestracja.',
    'terms.userResponsibility': 'Użytkownik jest odpowiedzialny za poprawność podanych danych.',
    'terms.accountTermination': 'Konto może zostać zamknięte w przypadku naruszenia tych warunków.',
    'terms.rightsTitle': 'Prawa i obowiązki użytkowników',
    'terms.userCommits': 'Użytkownik zobowiązuje się:',
    'terms.noHarm': 'Nie szkodzić działaniu aplikacji',
    'terms.noIllegalContent': 'Nie publikować nielegalnych treści',
    'terms.noSpam': 'Nie wysyłać spamu',
    'terms.noTampering': 'Nie manipulować danymi aplikacji',
    'terms.noAutomation': 'Nie używać zautomatyzowanych narzędzi',
    'terms.liabilityTitle': 'Ograniczenie odpowiedzialności',
    'terms.informationNature': 'Informacje w aplikacji mają charakter wyłącznie informacyjny.',
    'terms.userContentLiability': 'Nie ponosimy odpowiedzialności za treści tworzone przez użytkowników.',
    'terms.thirdPartyLinks': 'Nie gwarantujemy treści linkowanych stron trzecich.',
    'terms.availabilityTitle': 'Dostępność usługi',
    'terms.noGuarantee': 'Nie gwarantujemy nieprzerwnej dostępności aplikacji.',
    'terms.serviceChanges': 'Zastrzegamy sobie prawo do zmian w usłudze.',
    'terms.privacyTitle': 'Ochrona danych osobowych',
    'terms.privacyReference': 'Przetwarzanie danych osobowych podlega naszej polityce prywatności.',
    'terms.finalTitle': 'Postanowienia końcowe',
    'terms.czechLaw': 'Te warunki podlegają prawu polskiemu.',
    'terms.termsChanges': 'Warunki mogą zostać zmienione z wcześniejszym powiadomieniem.',
    'terms.effectiveDate': 'Te warunki obowiązują od 1.5.2025.',
    
    // Privacy
    privacyTitle: 'Ochrona prywatności',
    privacyIntro: 'Szanujemy Twoją prywatność i chronimy Twoje dane osobowe zgodnie z RODO.',
    
    // Hero section
    heroTitle: 'Twój niezawodny pomocnik do pracy w Niemczech',
    heroSubtitle: 'Zarządzaj zmianami, ucz się niemieckiego i optymalizuj podatki - wszystko w jednym miejscu'
  }
};

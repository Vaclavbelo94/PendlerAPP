export type Language = 'cs' | 'de' | 'pl';

export const languages = {
  cs: { name: 'Čeština', flag: '🇨🇿' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  pl: { name: 'Polski', flag: '🇵🇱' }
};

export const translations = {
  cs: {
    // Navigation
    home: 'Domů',
    dashboard: 'Dashboard',
    germanLessons: 'Výuka němčiny',
    translator: 'Překladač',
    taxAdvisor: 'Daňový poradce',
    shifts: 'Směny',
    vehicle: 'Vozidlo',
    travel: 'Plánování cest',
    laws: 'Zákony',
    settings: 'Nastavení',
    premium: 'Premium',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Ochrana údajů',
    terms: 'Podmínky',
    admin: 'Administrace',
    profile: 'Profil',
    
    // Auth
    login: 'Přihlášení',
    register: 'Registrace',
    logout: 'Odhlásit se',
    email: 'Email',
    password: 'Heslo',
    confirmPassword: 'Potvrdit heslo',
    forgotPassword: 'Zapomenuté heslo?',
    dontHaveAccount: 'Nemáte účet?',
    alreadyHaveAccount: 'Již máte účet?',
    signInWithGoogle: 'Přihlásit se přes Google',
    orContinueWith: 'nebo pokračujte s',
    loading: 'Načítání...',
    
    // Common
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
    add: 'Přidat',
    update: 'Aktualizovat',
    search: 'Hledat',
    filter: 'Filtrovat',
    export: 'Exportovat',
    import: 'Importovat',
    
    // Hero section
    heroTitle: 'Váš digitální průvodce pro práci v Německu',
    heroSubtitle: 'Komplexní řešení pro české a polské pendlery - od němčiny po daňové poradenství',
    
    // Contact page
    contactTitle: 'Kontaktujte nás',
    contactSubtitle: 'Máte dotaz nebo návrh? Neváhejte nás kontaktovat. Odpovídáme obvykle do 24 hodin.',
    contactInfo: 'Kontaktní informace',
    contactEmail: 'Email',
    contactPhone: 'Telefon',
    contactAddress: 'Adresa',
    contactResponseTime: 'Odpovídáme do 24 hodin',
    contactWorkingHours: 'Po-Pá: 9:00 - 17:00',
    contactFormTitle: 'Napište nám',
    contactName: 'Jméno',
    contactMessage: 'Zpráva',
    contactNamePlaceholder: 'Vaše jméno',
    contactEmailPlaceholder: 'vas@email.cz',
    contactMessagePlaceholder: 'Vaše zpráva...',
    contactSending: 'Odesílání...',
    contactSend: 'Odeslat zprávu',
    
    // Register page
    registerTitle: 'Registrace',
    registerDescription: 'Vytvořte si nový účet a začněte využívat všechny funkce',
    registerWithGoogle: 'Registrovat se pomocí Google',
    registerWithEmail: 'Nebo s emailem',
    registerUsername: 'Uživatelské jméno (volitelné)',
    registerUsernamePlaceholder: 'Vaše uživatelské jméno',
    registerPasswordMinLength: 'Alespoň 6 znaků',
    registerConfirmPassword: 'Potvrďte heslo',
    registerConfirmPasswordPlaceholder: 'Zadejte heslo znovu',
    registerCreateAccount: 'Vytvořit účet',
    registerCreating: 'Registrování...',
    
    // Privacy page
    privacyTitle: 'Ochrana osobních údajů',
    privacyIntro: 'Dbáme na ochranu vašich osobních údajů a respektujeme vaše soukromí.',
    
    // Terms page
    termsTitle: 'Podmínky použití',
    termsIntro: 'Tyto podmínky upravují používání aplikace PendlerApp.'
  },
  
  de: {
    // Navigation
    home: 'Startseite',
    dashboard: 'Dashboard',
    germanLessons: 'Deutschunterricht',
    translator: 'Übersetzer',
    taxAdvisor: 'Steuerberater',
    shifts: 'Schichten',
    vehicle: 'Fahrzeug',
    travel: 'Reiseplanung',
    laws: 'Gesetze',
    settings: 'Einstellungen',
    premium: 'Premium',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    admin: 'Administration',
    profile: 'Profil',
    
    // Auth
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    forgotPassword: 'Passwort vergessen?',
    dontHaveAccount: 'Noch kein Konto?',
    alreadyHaveAccount: 'Bereits ein Konto?',
    signInWithGoogle: 'Mit Google anmelden',
    orContinueWith: 'oder fortfahren mit',
    loading: 'Laden...',
    
    // Common
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    update: 'Aktualisieren',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    import: 'Importieren',
    
    // Hero section
    heroTitle: 'Ihr digitaler Begleiter für die Arbeit in Deutschland',
    heroSubtitle: 'Komplettlösung für tschechische und polnische Pendler - von Deutsch bis Steuerberatung',
    
    // Contact page
    contactTitle: 'Kontaktieren Sie uns',
    contactSubtitle: 'Haben Sie eine Frage oder einen Vorschlag? Zögern Sie nicht, uns zu kontaktieren. Wir antworten normalerweise innerhalb von 24 Stunden.',
    contactInfo: 'Kontaktinformationen',
    contactEmail: 'E-Mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adresse',
    contactResponseTime: 'Antwort innerhalb von 24 Stunden',
    contactWorkingHours: 'Mo-Fr: 9:00 - 17:00',
    contactFormTitle: 'Schreiben Sie uns',
    contactName: 'Name',
    contactMessage: 'Nachricht',
    contactNamePlaceholder: 'Ihr Name',
    contactEmailPlaceholder: 'ihre@email.de',
    contactMessagePlaceholder: 'Ihre Nachricht...',
    contactSending: 'Senden...',
    contactSend: 'Nachricht senden',
    
    // Register page
    registerTitle: 'Registrierung',
    registerDescription: 'Erstellen Sie ein neues Konto und nutzen Sie alle Funktionen',
    registerWithGoogle: 'Mit Google registrieren',
    registerWithEmail: 'Oder mit E-Mail',
    registerUsername: 'Benutzername (optional)',
    registerUsernamePlaceholder: 'Ihr Benutzername',
    registerPasswordMinLength: 'Mindestens 6 Zeichen',
    registerConfirmPassword: 'Passwort bestätigen',
    registerConfirmPasswordPlaceholder: 'Passwort erneut eingeben',
    registerCreateAccount: 'Konto erstellen',
    registerCreating: 'Registrierung...',
    
    // Privacy page
    privacyTitle: 'Datenschutz',
    privacyIntro: 'Wir achten auf den Schutz Ihrer persönlichen Daten und respektieren Ihre Privatsphäre.',
    
    // Terms page
    termsTitle: 'Nutzungsbedingungen',
    termsIntro: 'Diese Bedingungen regeln die Nutzung der PendlerApp-Anwendung.'
  },
  
  pl: {
    // Navigation
    home: 'Strona główna',
    dashboard: 'Panel główny',
    germanLessons: 'Nauka niemieckiego',
    translator: 'Tłumacz',
    taxAdvisor: 'Doradca podatkowy',
    shifts: 'Zmiany',
    vehicle: 'Pojazd',
    travel: 'Planowanie podróży',
    laws: 'Prawo',
    settings: 'Ustawienia',
    premium: 'Premium',
    contact: 'Kontakt',
    faq: 'FAQ',
    privacy: 'Ochrona danych',
    terms: 'Regulamin',
    admin: 'Administracja',
    profile: 'Profil',
    
    // Auth
    login: 'Logowanie',
    register: 'Rejestracja',
    logout: 'Wyloguj się',
    email: 'E-mail',
    password: 'Hasło',
    confirmPassword: 'Potwierdź hasło',
    forgotPassword: 'Zapomniałeś hasła?',
    dontHaveAccount: 'Nie masz konta?',
    alreadyHaveAccount: 'Masz już konto?',
    signInWithGoogle: 'Zaloguj się przez Google',
    orContinueWith: 'lub kontynuuj z',
    loading: 'Ładowanie...',
    
    // Common
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    add: 'Dodaj',
    update: 'Aktualizuj',
    search: 'Szukaj',
    filter: 'Filtruj',
    export: 'Eksportuj',
    import: 'Importuj',
    
    // Hero section
    heroTitle: 'Twój cyfrowy przewodnik do pracy w Niemczech',
    heroSubtitle: 'Kompleksowe rozwiązanie dla czeskich i polskich pracowników - od niemieckiego po doradztwo podatkowe',
    
    // Contact page
    contactTitle: 'Skontaktuj się z nami',
    contactSubtitle: 'Masz pytanie lub sugestię? Nie wahaj się z nami skontaktować. Zwykle odpowiadamy w ciągu 24 godzin.',
    contactInfo: 'Informacje kontaktowe',
    contactEmail: 'E-mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adres',
    contactResponseTime: 'Odpowiadamy w ciągu 24 godzin',
    contactWorkingHours: 'Pn-Pt: 9:00 - 17:00',
    contactFormTitle: 'Napisz do nas',
    contactName: 'Imię',
    contactMessage: 'Wiadomość',
    contactNamePlaceholder: 'Twoje imię',
    contactEmailPlaceholder: 'twoj@email.pl',
    contactMessagePlaceholder: 'Twoja wiadomość...',
    contactSending: 'Wysyłanie...',
    contactSend: 'Wyślij wiadomość',
    
    // Register page
    registerTitle: 'Rejestracja',
    registerDescription: 'Utwórz nowe konto i zacznij korzystać ze wszystkich funkcji',
    registerWithGoogle: 'Zarejestruj się przez Google',
    registerWithEmail: 'Lub z e-mailem',
    registerUsername: 'Nazwa użytkownika (opcjonalnie)',
    registerUsernamePlaceholder: 'Twoja nazwa użytkownika',
    registerPasswordMinLength: 'Co najmniej 6 znaków',
    registerConfirmPassword: 'Potwierdź hasło',
    registerConfirmPasswordPlaceholder: 'Wprowadź hasło ponownie',
    registerCreateAccount: 'Utwórz konto',
    registerCreating: 'Rejestrowanie...',
    
    // Privacy page
    privacyTitle: 'Ochrona danych osobowych',
    privacyIntro: 'Dbamy o ochronę Twoich danych osobowych i szanujemy Twoją prywatność.',
    
    // Terms page
    termsTitle: 'Regulamin',
    termsIntro: 'Niniejszy regulamin określa zasady korzystania z aplikacji PendlerApp.'
  }
};

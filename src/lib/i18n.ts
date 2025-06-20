
export type Language = 'cs' | 'de' | 'pl' | 'en';

export interface Translations {
  cs: Record<string, string>;
  de: Record<string, string>;
  pl: Record<string, string>;
  en: Record<string, string>;
}

export const languages = [
  { code: 'cs' as Language, name: 'Čeština', flag: '🇨🇿' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl' as Language, name: 'Polski', flag: '🇵🇱' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
];

export const translations: Translations = {
  cs: {
    // App General
    appName: 'PendlerApp',
    heroTitle: 'Váš průvodce pendlerováním',
    heroSubtitle: 'Kompletní řešení pro pracovníky dojíždějící do zahraničí',
    heroAction: 'Začít zdarma',
    
    // Navigation
    features: 'Funkce',
    aboutUs: 'O nás',
    contact: 'Kontakt',
    settings: 'Nastavení',
    premium: 'Premium',
    profile: 'Profil',
    faq: 'FAQ',
    privacy: 'Ochrana osobních údajů',
    terms: 'Podmínky použití',
    cookies: 'Cookies',
    
    // Dashboard
    dashboard: 'Přehled',
    shifts: 'Směny',
    vehicle: 'Vozidlo',
    translator: 'Překladač',
    taxAdvisor: 'Daňový poradce',
    travel: 'Cestování',
    laws: 'Zákony',
    
    // Authentication
    login: 'Přihlášení',
    logout: 'Odhlásit se',
    email: 'E-mail',
    password: 'Heslo',
    
    // Registration
    registerTitle: 'Vytvořit účet',
    registerDescription: 'Vytvořte si účet a začněte využívat všechny funkce aplikace',
    registerUsername: 'Uživatelské jméno',
    registerUsernamePlaceholder: 'Zadejte uživatelské jméno',
    registerPasswordMinLength: 'Heslo (min. 6 znaků)',
    registerConfirmPassword: 'Potvrdit heslo',
    registerConfirmPasswordPlaceholder: 'Potvrďte heslo',
    registerWithGoogle: 'Registrovat se přes Google',
    registerWithEmail: 'nebo se registrujte e-mailem',
    registerCreating: 'Vytváří se...',
    registerCreateAccount: 'Vytvořit účet',
    alreadyHaveAccount: 'Již máte účet?',
    
    // Registration Messages
    passwordsDoNotMatch: 'Hesla se neshodují',
    passwordTooShort: 'Heslo musí mít alespoň 6 znaků',
    insufficientStorage: 'Nedostatek místa v úložišti',
    insufficientStorageDescription: 'Vyčistěte prosím úložiště prohlížeče',
    registerCheckDataRetry: 'Zkontrolujte zadané údaje a zkuste to znovu',
    userAlreadyExists: 'Uživatel s tímto e-mailem již existuje',
    invalidEmailFormat: 'Neplatný formát e-mailu',
    passwordRequirementsNotMet: 'Heslo nesplňuje požadavky',
    browserStorageProblem: 'Problém s úložištěm prohlížeče',
    registrationFailed: 'Registrace se nezdařila',
    accountCreatedSuccessfully: 'Účet byl úspěšně vytvořen',
    nowYouCanLogin: 'Nyní se můžete přihlásit',
    accountCreatedWithPremium: 'Účet vytvořen s Premium funkcemi',
    promoCodeActivated: 'Propagační kód {code} byl aktivován',
    unknownErrorOccurred: 'Došlo k neznámé chybě',
    browserStorageInsufficientSpace: 'Nedostatek místa v úložišti prohlížeče',
    registrationError: 'Chyba při registraci',
    googleRegistrationFailed: 'Registrace přes Google se nezdařila',
    loading: 'Načítání...',
    browserStorageFull: 'Úložiště prohlížeče je plné. Klikněte pro vyčištění starých dat.',
    cleanStorage: 'Vyčistit úložiště',
    storageCleanedUp: 'Úložiště bylo vyčištěno',
    
    // Contact
    contactTitle: 'Kontaktujte nás',
    contactSubtitle: 'Máte otázky nebo potřebujete pomoc? Rádi vám pomůžeme!',
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
    contactMessagePlaceholder: 'Popište váš dotaz nebo problém...',
    contactSending: 'Odesílání...',
    contactSend: 'Odeslat zprávu',
    
    // Footer
    footerAppName: 'PendlerApp',
    footerAllRightsReserved: 'Všechna práva vyhrazena'
  },
  de: {
    // App General
    appName: 'PendlerApp',
    heroTitle: 'Ihr Pendler-Begleiter',
    heroSubtitle: 'Komplettlösung für Grenzgänger und Pendler',
    heroAction: 'Kostenlos starten',
    
    // Navigation
    features: 'Funktionen',
    aboutUs: 'Über uns',
    contact: 'Kontakt',
    settings: 'Einstellungen',
    premium: 'Premium',
    profile: 'Profil',
    faq: 'FAQ',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    cookies: 'Cookies',
    
    // Dashboard
    dashboard: 'Übersicht',
    shifts: 'Schichten',
    vehicle: 'Fahrzeug',
    translator: 'Übersetzer',
    taxAdvisor: 'Steuerberater',
    travel: 'Reisen',
    laws: 'Gesetze',
    
    // Authentication
    login: 'Anmelden',
    logout: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    
    // Registration
    registerTitle: 'Konto erstellen',
    registerDescription: 'Erstellen Sie ein Konto und nutzen Sie alle App-Funktionen',
    registerUsername: 'Benutzername',
    registerUsernamePlaceholder: 'Benutzername eingeben',
    registerPasswordMinLength: 'Passwort (min. 6 Zeichen)',
    registerConfirmPassword: 'Passwort bestätigen',
    registerConfirmPasswordPlaceholder: 'Passwort bestätigen',
    registerWithGoogle: 'Mit Google registrieren',
    registerWithEmail: 'oder per E-Mail registrieren',
    registerCreating: 'Wird erstellt...',
    registerCreateAccount: 'Konto erstellen',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    
    // Registration Messages
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
    passwordTooShort: 'Passwort muss mindestens 6 Zeichen haben',
    insufficientStorage: 'Unzureichender Speicherplatz',
    insufficientStorageDescription: 'Bitte Browser-Speicher leeren',
    registerCheckDataRetry: 'Überprüfen Sie die Daten und versuchen Sie es erneut',
    userAlreadyExists: 'Benutzer mit dieser E-Mail existiert bereits',
    invalidEmailFormat: 'Ungültiges E-Mail-Format',
    passwordRequirementsNotMet: 'Passwort erfüllt nicht die Anforderungen',
    browserStorageProblem: 'Browser-Speicher-Problem',
    registrationFailed: 'Registrierung fehlgeschlagen',
    accountCreatedSuccessfully: 'Konto erfolgreich erstellt',
    nowYouCanLogin: 'Sie können sich jetzt anmelden',
    accountCreatedWithPremium: 'Konto mit Premium-Funktionen erstellt',
    promoCodeActivated: 'Promo-Code {code} wurde aktiviert',
    unknownErrorOccurred: 'Unbekannter Fehler aufgetreten',
    browserStorageInsufficientSpace: 'Unzureichender Browser-Speicherplatz',
    registrationError: 'Registrierungsfehler',
    googleRegistrationFailed: 'Google-Registrierung fehlgeschlagen',
    loading: 'Laden...',
    browserStorageFull: 'Browser-Speicher ist voll. Klicken Sie zum Löschen alter Daten.',
    cleanStorage: 'Speicher leeren',
    storageCleanedUp: 'Speicher wurde geleert',
    
    // Contact
    contactTitle: 'Kontaktieren Sie uns',
    contactSubtitle: 'Haben Sie Fragen oder brauchen Hilfe? Wir helfen Ihnen gerne!',
    contactInfo: 'Kontaktinformationen',
    contactEmail: 'E-Mail',
    contactPhone: 'Telefon',
    contactAddress: 'Adresse',
    contactResponseTime: 'Antwort innerhalb von 24 Stunden',
    contactWorkingHours: 'Mo-Fr 9:00-17:00',
    contactFormTitle: 'Schreiben Sie uns eine Nachricht',
    contactName: 'Name',
    contactNamePlaceholder: 'Ihr Name',
    contactMessage: 'Nachricht',
    contactMessagePlaceholder: 'Beschreiben Sie Ihre Frage oder Ihr Problem...',
    contactSending: 'Wird gesendet...',
    contactSend: 'Nachricht senden',
    
    // Footer
    footerAppName: 'PendlerApp',
    footerAllRightsReserved: 'Alle Rechte vorbehalten'
  },
  pl: {
    // App General
    appName: 'PendlerApp',
    heroTitle: 'Twój przewodnik po pracy za granicą',
    heroSubtitle: 'Kompleksowe rozwiązanie dla pracowników dojeżdżających',
    heroAction: 'Rozpocznij za darmo',
    
    // Navigation
    features: 'Funkcje',
    aboutUs: 'O nas',
    contact: 'Kontakt',
    settings: 'Ustawienia',
    premium: 'Premium',
    profile: 'Profil',
    faq: 'FAQ',
    privacy: 'Prywatność',
    terms: 'Warunki użytkowania',
    cookies: 'Cookies',
    
    // Dashboard
    dashboard: 'Przegląd',
    shifts: 'Zmiany',
    vehicle: 'Pojazd',
    translator: 'Tłumacz',
    taxAdvisor: 'Doradca podatkowy',
    travel: 'Podróże',
    laws: 'Prawo',
    
    // Authentication
    login: 'Logowanie',
    logout: 'Wyloguj się',
    email: 'E-mail',
    password: 'Hasło',
    
    // Registration
    registerTitle: 'Utwórz konto',
    registerDescription: 'Utwórz konto i korzystaj ze wszystkich funkcji aplikacji',
    registerUsername: 'Nazwa użytkownika',
    registerUsernamePlaceholder: 'Wprowadź nazwę użytkownika',
    registerPasswordMinLength: 'Hasło (min. 6 znaków)',
    registerConfirmPassword: 'Potwierdź hasło',
    registerConfirmPasswordPlaceholder: 'Potwierdź hasło',
    registerWithGoogle: 'Zarejestruj się przez Google',
    registerWithEmail: 'lub zarejestruj się e-mailem',
    registerCreating: 'Tworzenie...',
    registerCreateAccount: 'Utwórz konto',
    alreadyHaveAccount: 'Masz już konto?',
    
    // Registration Messages
    passwordsDoNotMatch: 'Hasła nie pasują do siebie',
    passwordTooShort: 'Hasło musi mieć co najmniej 6 znaków',
    insufficientStorage: 'Niewystarczająca ilość miejsca',
    insufficientStorageDescription: 'Proszę wyczyścić pamięć przeglądarki',
    registerCheckDataRetry: 'Sprawdź dane i spróbuj ponownie',
    userAlreadyExists: 'Użytkownik z tym e-mailem już istnieje',
    invalidEmailFormat: 'Nieprawidłowy format e-maila',
    passwordRequirementsNotMet: 'Hasło nie spełnia wymagań',
    browserStorageProblem: 'Problem z pamięcią przeglądarki',
    registrationFailed: 'Rejestracja nie powiodła się',
    accountCreatedSuccessfully: 'Konto zostało pomyślnie utworzone',
    nowYouCanLogin: 'Teraz możesz się zalogować',
    accountCreatedWithPremium: 'Konto utworzone z funkcjami Premium',
    promoCodeActivated: 'Kod promocyjny {code} został aktywowany',
    unknownErrorOccurred: 'Wystąpił nieznany błąd',
    browserStorageInsufficientSpace: 'Niewystarczająca ilość miejsca w przeglądarce',
    registrationError: 'Błąd rejestracji',
    googleRegistrationFailed: 'Rejestracja przez Google nie powiodła się',
    loading: 'Ładowanie...',
    browserStorageFull: 'Pamięć przeglądarki jest pełna. Kliknij, aby wyczyścić stare dane.',
    cleanStorage: 'Wyczyść pamięć',
    storageCleanedUp: 'Pamięć została wyczyszczona',
    
    // Contact
    contactTitle: 'Skontaktuj się z nami',
    contactSubtitle: 'Masz pytania lub potrzebujesz pomocy? Chętnie pomożemy!',
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
    contactMessagePlaceholder: 'Opisz swoje pytanie lub problem...',
    contactSending: 'Wysyłanie...',
    contactSend: 'Wyślij wiadomość',
    
    // Footer
    footerAppName: 'PendlerApp',
    footerAllRightsReserved: 'Wszelkie prawa zastrzeżone'
  },
  en: {
    // App General
    appName: 'PendlerApp',
    heroTitle: 'Your Commuter Companion',
    heroSubtitle: 'Complete solution for cross-border workers',
    heroAction: 'Start for free',
    
    // Navigation
    features: 'Features',
    aboutUs: 'About Us',
    contact: 'Contact',
    settings: 'Settings',
    premium: 'Premium',
    profile: 'Profile',
    faq: 'FAQ',
    privacy: 'Privacy',
    terms: 'Terms of Use',
    cookies: 'Cookies',
    
    // Dashboard
    dashboard: 'Dashboard',
    shifts: 'Shifts',
    vehicle: 'Vehicle',
    translator: 'Translator',
    taxAdvisor: 'Tax Advisor',
    travel: 'Travel',
    laws: 'Laws',
    
    // Authentication
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    
    // Registration
    registerTitle: 'Create Account',
    registerDescription: 'Create an account and use all app features',
    registerUsername: 'Username',
    registerUsernamePlaceholder: 'Enter username',
    registerPasswordMinLength: 'Password (min. 6 characters)',
    registerConfirmPassword: 'Confirm Password',
    registerConfirmPasswordPlaceholder: 'Confirm password',
    registerWithGoogle: 'Register with Google',
    registerWithEmail: 'or register with email',
    registerCreating: 'Creating...',
    registerCreateAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    
    // Registration Messages
    passwordsDoNotMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    insufficientStorage: 'Insufficient storage space',
    insufficientStorageDescription: 'Please clear browser storage',
    registerCheckDataRetry: 'Check the data and try again',
    userAlreadyExists: 'User with this email already exists',
    invalidEmailFormat: 'Invalid email format',
    passwordRequirementsNotMet: 'Password does not meet requirements',
    browserStorageProblem: 'Browser storage problem',
    registrationFailed: 'Registration failed',
    accountCreatedSuccessfully: 'Account created successfully',
    nowYouCanLogin: 'You can now log in',
    accountCreatedWithPremium: 'Account created with Premium features',
    promoCodeActivated: 'Promo code {code} has been activated',
    unknownErrorOccurred: 'Unknown error occurred',
    browserStorageInsufficientSpace: 'Insufficient browser storage space',
    registrationError: 'Registration error',
    googleRegistrationFailed: 'Google registration failed',
    loading: 'Loading...',
    browserStorageFull: 'Browser storage is full. Click to clear old data.',
    cleanStorage: 'Clear Storage',
    storageCleanedUp: 'Storage has been cleared',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'Have questions or need help? We are happy to help!',
    contactInfo: 'Contact Information',
    contactEmail: 'Email',
    contactPhone: 'Phone',
    contactAddress: 'Address',
    contactResponseTime: 'We respond within 24 hours',
    contactWorkingHours: 'Mon-Fri 9:00-17:00',
    contactFormTitle: 'Send us a message',
    contactName: 'Name',
    contactNamePlaceholder: 'Your name',
    contactMessage: 'Message',
    contactMessagePlaceholder: 'Describe your question or problem...',
    contactSending: 'Sending...',
    contactSend: 'Send Message',
    
    // Footer
    footerAppName: 'PendlerApp',
    footerAllRightsReserved: 'All rights reserved'
  }
};

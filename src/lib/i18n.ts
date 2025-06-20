
export type Language = 'cs' | 'pl' | 'de';

export const languages = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
] as const;

export const translations = {
  cs: {
    // Navigace
    dashboard: 'Dashboard',
    shifts: 'Směny',
    translator: 'Překladač',
    travel: 'Cestování',
    taxAdvisor: 'Daňový poradce',
    vocabulary: 'Jazykové nástroje',
    laws: 'Zákony',
    profile: 'Profil',
    settings: 'Nastavení',
    vehicles: 'Vozidla',
    vehicle: 'Vozidlo',
    premium: 'Premium',
    admin: 'Admin',
    
    // Běžné akce
    save: 'Uložit',
    cancel: 'Zrušit',
    edit: 'Upravit',
    delete: 'Smazat',
    add: 'Přidat',
    search: 'Hledat',
    loading: 'Načítání...',
    error: 'Chyba',
    success: 'Úspěch',
    confirm: 'Potvrdit',
    close: 'Zavřít',
    open: 'Otevřít',
    select: 'Vybrat',
    
    // Autentifikace
    welcome: 'Vítejte',
    logout: 'Odhlásit',
    login: 'Přihlásit',
    register: 'Registrovat',
    email: 'E-mail',
    password: 'Heslo',
    username: 'Uživatelské jméno',
    
    // Překladač
    translateFrom: 'Přeložit z',
    translateTo: 'Přeložit do',
    enterTextToTranslate: 'Zadejte text k překladu',
    translation: 'Překlad',
    history: 'Historie',
    clearHistory: 'Vymazat historii',
    
    // Formuláře
    required: 'Povinné pole',
    optional: 'Nepovinné',
    invalidEmail: 'Neplatný e-mail',
    tooShort: 'Příliš krátké',
    tooLong: 'Příliš dlouhé',
    
    // Zprávy
    saveSuccess: 'Úspěšně uloženo',
    saveError: 'Chyba při ukládání',
    deleteSuccess: 'Úspěšně smazáno',
    deleteError: 'Chyba při mazání',
    
    // Footer
    footer: {
      appName: 'PendlerApp',
      allRightsReserved: 'Všechna práva vyhrazena',
      features: 'Funkce',
      aboutUs: 'O nás',
      contact: 'Kontakt'
    },
    
    // Obecné
    home: 'Domů',
    back: 'Zpět',
    next: 'Další',
    previous: 'Předchozí',
    heroSubtitle: 'Aplikace pro pendlery pracující v zahraničí',
    
    // Stránky
    contact: 'Kontakt',
    privacy: 'Ochrana osobních údajů',
    terms: 'Podmínky použití',
    cookies: 'Cookies',
    faq: 'Časté otázky'
  },
  
  pl: {
    // Navigacja
    dashboard: 'Panel główny',
    shifts: 'Zmiany',
    translator: 'Tłumacz',
    travel: 'Podróże',
    taxAdvisor: 'Doradca podatkowy',
    vocabulary: 'Narzędzia językowe',
    laws: 'Prawo',
    profile: 'Profil',
    settings: 'Ustawienia',
    vehicles: 'Pojazdy',
    vehicle: 'Pojazd',
    premium: 'Premium',
    admin: 'Admin',
    
    // Częste akcje
    save: 'Zapisz',
    cancel: 'Anuluj',
    edit: 'Edytuj',
    delete: 'Usuń',
    add: 'Dodaj',
    search: 'Szukaj',
    loading: 'Ładowanie...',
    error: 'Błąd',
    success: 'Sukces',
    confirm: 'Potwierdź',
    close: 'Zamknij',
    open: 'Otwórz',
    select: 'Wybierz',
    
    // Autoryzacja
    welcome: 'Witamy',
    logout: 'Wyloguj',
    login: 'Zaloguj',
    register: 'Zarejestruj',
    email: 'E-mail',
    password: 'Hasło',
    username: 'Nazwa użytkownika',
    
    // Tłumacz
    translateFrom: 'Tłumacz z',
    translateTo: 'Tłumacz na',
    enterTextToTranslate: 'Wprowadź tekst do tłumaczenia',
    translation: 'Tłumaczenie',
    history: 'Historia',
    clearHistory: 'Wyczyść historię',
    
    // Formularze
    required: 'Pole wymagane',
    optional: 'Opcjonalne',
    invalidEmail: 'Nieprawidłowy e-mail',
    tooShort: 'Za krótkie',
    tooLong: 'Za długie',
    
    // Komunikaty
    saveSuccess: 'Pomyślnie zapisano',
    saveError: 'Błąd podczas zapisywania',
    deleteSuccess: 'Pomyślnie usunięto',
    deleteError: 'Błąd podczas usuwania',
    
    // Stopka
    footer: {
      appName: 'PendlerApp',
      allRightsReserved: 'Wszelkie prawa zastrzeżone',
      features: 'Funkcje',
      aboutUs: 'O nas',
      contact: 'Kontakt'
    },
    
    // Ogólne
    home: 'Dom',
    back: 'Wstecz',
    next: 'Dalej',
    previous: 'Poprzedni',
    heroSubtitle: 'Aplikacja dla pracowników za granicą',
    
    // Strony
    contact: 'Kontakt',
    privacy: 'Polityka prywatności',
    terms: 'Warunki użytkowania',
    cookies: 'Cookies',
    faq: 'Często zadawane pytania'
  },
  
  de: {
    // Navigation
    dashboard: 'Dashboard',
    shifts: 'Schichten',
    translator: 'Übersetzer',
    travel: 'Reisen',
    taxAdvisor: 'Steuerberater',
    vocabulary: 'Sprachtools',
    laws: 'Gesetze',
    profile: 'Profil',
    settings: 'Einstellungen',
    vehicles: 'Fahrzeuge',
    vehicle: 'Fahrzeug',
    premium: 'Premium',
    admin: 'Admin',
    
    // Häufige Aktionen
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    add: 'Hinzufügen',
    search: 'Suchen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolgreich',
    confirm: 'Bestätigen',
    close: 'Schließen',
    open: 'Öffnen',
    select: 'Auswählen',
    
    // Authentifizierung
    welcome: 'Willkommen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    username: 'Benutzername',
    
    // Übersetzer
    translateFrom: 'Übersetzen von',
    translateTo: 'Übersetzen zu',
    enterTextToTranslate: 'Text zum Übersetzen eingeben',
    translation: 'Übersetzung',
    history: 'Verlauf',
    clearHistory: 'Verlauf löschen',
    
    // Formulare
    required: 'Pflichtfeld',
    optional: 'Optional',
    invalidEmail: 'Ungültige E-Mail',
    tooShort: 'Zu kurz',
    tooLong: 'Zu lang',
    
    // Nachrichten
    saveSuccess: 'Erfolgreich gespeichert',
    saveError: 'Fehler beim Speichern',
    deleteSuccess: 'Erfolgreich gelöscht',
    deleteError: 'Fehler beim Löschen',
    
    // Fußzeile
    footer: {
      appName: 'PendlerApp',
      allRightsReserved: 'Alle Rechte vorbehalten',
      features: 'Funktionen',
      aboutUs: 'Über uns',
      contact: 'Kontakt'
    },
    
    // Allgemein
    home: 'Startseite',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    heroSubtitle: 'App für Grenzgänger',
    
    // Seiten
    contact: 'Kontakt',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    cookies: 'Cookies',
    faq: 'Häufig gestellte Fragen'
  }
} as const;

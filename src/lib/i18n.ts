
export type Language = 'cs' | 'pl' | 'de';

export const languages = {
  cs: { name: 'Čeština', flag: '🇨🇿' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  de: { name: 'Deutsch', flag: '🇩🇪' }
} as const;

export const translations = {
  cs: {
    // Navigation
    home: 'Domů',
    dashboard: 'Dashboard',
    shifts: 'Směny',
    calculator: 'Kalkulačky',
    translator: 'Překladač',
    vehicle: 'Vozidlo',
    taxAdvisor: 'Daňový poradce',
    travel: 'Cestování',
    laws: 'Zákony',
    premium: 'Premium',
    profile: 'Profil',
    settings: 'Nastavení',
    admin: 'Admin',
    
    // Common
    login: 'Přihlásit se',
    register: 'Registrovat se',
    logout: 'Odhlásit se',
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
    add: 'Přidat',
    loading: 'Načítání...',
    error: 'Chyba',
    success: 'Úspěch',
    
    // Hero section
    heroTitle: 'Pendlerův Pomocník',
    heroSubtitle: 'Váš spolehlivý průvodce pro práci v zahraničí',
    heroDescription: 'Komplexní řešení pro české, polské a německé pracovníky. Správa směn, daní, vozidel a všeho co potřebujete.',
    getStarted: 'Začít zdarma',
    learnMore: 'Zjistit více'
  },
  pl: {
    // Navigation
    home: 'Strona główna',
    dashboard: 'Panel',
    shifts: 'Zmiany',
    calculator: 'Kalkulatory',
    translator: 'Tłumacz',
    vehicle: 'Pojazd',
    taxAdvisor: 'Doradca podatkowy',
    travel: 'Podróże',
    laws: 'Prawo',
    premium: 'Premium',
    profile: 'Profil',
    settings: 'Ustawienia',
    admin: 'Admin',
    
    // Common
    login: 'Zaloguj się',
    register: 'Zarejestruj się',
    logout: 'Wyloguj się',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    add: 'Dodaj',
    loading: 'Ładowanie...',
    error: 'Błąd',
    success: 'Sukces',
    
    // Hero section
    heroTitle: 'Pomocnik Pendlera',
    heroSubtitle: 'Twój niezawodny przewodnik do pracy za granicą',
    heroDescription: 'Kompleksowe rozwiązanie dla czeskich, polskich i niemieckich pracowników. Zarządzanie zmianami, podatkami, pojazdami i wszystkim czego potrzebujesz.',
    getStarted: 'Zacznij za darmo',
    learnMore: 'Dowiedz się więcej'
  },
  de: {
    // Navigation
    home: 'Startseite',
    dashboard: 'Dashboard',
    shifts: 'Schichten',
    calculator: 'Rechner',
    translator: 'Übersetzer',
    vehicle: 'Fahrzeug',
    taxAdvisor: 'Steuerberater',
    travel: 'Reisen',
    laws: 'Gesetze',
    premium: 'Premium',
    profile: 'Profil',
    settings: 'Einstellungen',
    admin: 'Admin',
    
    // Common
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    
    // Hero section
    heroTitle: 'Pendler-Helfer',
    heroSubtitle: 'Ihr zuverlässiger Begleiter für die Arbeit im Ausland',
    heroDescription: 'Umfassende Lösung für tschechische, polnische und deutsche Arbeiter. Schichtverwaltung, Steuern, Fahrzeuge und alles was Sie brauchen.',
    getStarted: 'Kostenlos starten',
    learnMore: 'Mehr erfahren'
  }
} as const;

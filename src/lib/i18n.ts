
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
    
    // Běžné fráze
    save: 'Uložit',
    cancel: 'Zrušit',
    edit: 'Upravit',
    delete: 'Smazat',
    add: 'Přidat',
    search: 'Hledat',
    loading: 'Načítání...',
    error: 'Chyba',
    success: 'Úspěch',
    
    // Překladač
    translateFrom: 'Přeložit z',
    translateTo: 'Přeložit do',
    enterTextToTranslate: 'Zadejte text k překladu',
    translation: 'Překlad',
    history: 'Historie',
    clearHistory: 'Vymazat historii',
    
    // Obecné
    welcome: 'Vítejte',
    logout: 'Odhlásit',
    login: 'Přihlásit',
    register: 'Registrovat'
  },
  pl: {
    // Navigace
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
    
    // Běžné fráze
    save: 'Zapisz',
    cancel: 'Anuluj',
    edit: 'Edytuj',
    delete: 'Usuń',
    add: 'Dodaj',
    search: 'Szukaj',
    loading: 'Ładowanie...',
    error: 'Błąd',
    success: 'Sukces',
    
    // Překladač
    translateFrom: 'Tłumacz z',
    translateTo: 'Tłumacz na',
    enterTextToTranslate: 'Wprowadź tekst do tłumaczenia',
    translation: 'Tłumaczenie',
    history: 'Historia',
    clearHistory: 'Wyczyść historię',
    
    // Obecné
    welcome: 'Witamy',
    logout: 'Wyloguj',
    login: 'Zaloguj',
    register: 'Zarejestruj'
  },
  de: {
    // Navigace
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
    
    // Běžné fráze
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    add: 'Hinzufügen',
    search: 'Suchen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolgreich',
    
    // Překladač
    translateFrom: 'Übersetzen von',
    translateTo: 'Übersetzen zu',
    enterTextToTranslate: 'Text zum Übersetzen eingeben',
    translation: 'Übersetzung',
    history: 'Verlauf',
    clearHistory: 'Verlauf löschen',
    
    // Obecné
    welcome: 'Willkommen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren'
  }
} as const;

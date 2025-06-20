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
    termsIntro: 'Tyto podmínky upravují používání aplikace PendlerApp.',
    
    // Terms detailed content
    terms: {
      introTitle: 'Úvodní ustanovení',
      agreement: 'Používáním aplikace vyjadřujete souhlas s těmito podmínkami. Pokud s podmínkami nesouhlasíte, není možné aplikaci používat.',
      registrationTitle: 'Registrace a uživatelský účet',
      registrationDesc: 'Pro plné využití funkcí aplikace je nutná registrace. Při registraci je uživatel povinen uvést pravdivé a úplné údaje.',
      userResponsibility: 'Uživatel je povinen chránit své přihlašovací údaje před zneužitím a nese odpovědnost za veškeré aktivity provedené pod jeho účtem.',
      accountTermination: 'Provozovatel si vyhrazuje právo zrušit uživatelský účet, který porušuje tyto podmínky použití.',
      rightsTitle: 'Práva a povinnosti uživatele',
      userCommits: 'Uživatel se zavazuje:',
      noHarm: 'Nepoužívat aplikaci způsobem, který by mohl poškodit, znepřístupnit, přetížit nebo zhoršit její funkčnost',
      noIllegalContent: 'Nenahrávat do aplikace obsah, který porušuje právní předpisy nebo práva třetích osob',
      noSpam: 'Nešířit prostřednictvím aplikace nevyžádaná sdělení (spam)',
      noTampering: 'Nezasahovat do technického provedení aplikace',
      noAutomation: 'Nepoužívat automatizované systémy pro přístup k aplikaci',
      liabilityTitle: 'Omezení odpovědnosti',
      informationNature: 'Informace poskytované v aplikaci mají pouze informativní charakter a nejsou právním poradenstvím. Provozovatel nenese odpovědnost za případné škody vzniklé v důsledku použití těchto informací.',
      userContentLiability: 'Provozovatel neodpovídá za obsah vložený do aplikace uživateli (například nabídky spolujízdy).',
      thirdPartyLinks: 'Aplikace může obsahovat odkazy na webové stránky třetích stran. Provozovatel neodpovídá za obsah těchto stránek.',
      availabilityTitle: 'Dostupnost služby',
      noGuarantee: 'Provozovatel nezaručuje nepřetržitou dostupnost aplikace. V případě technických problémů nebo údržby může být funkčnost aplikace dočasně omezena.',
      serviceChanges: 'Provozovatel si vyhrazuje právo změnit nebo ukončit provoz aplikace nebo její části bez předchozího upozornění.',
      privacyTitle: 'Ochrana osobních údajů',
      privacyReference: 'Zpracování osobních údajů uživatelů se řídí zásadami ochrany osobních údajů, které jsou dostupné v sekci „Ochrana soukromí".',
      finalTitle: 'Závěrečná ustanovení',
      czechLaw: 'Tyto podmínky použití se řídí právním řádem České republiky.',
      termsChanges: 'Provozovatel si vyhrazuje právo tyto podmínky použití kdykoliv změnit. O změnách bude uživatele informovat prostřednictvím aplikace.',
      effectiveDate: 'Tyto podmínky použití jsou platné a účinné od 1.5.2025.'
    },
    
    // Footer
    footer: {
      appName: 'Pendlerův Pomocník',
      description: 'Komplexní průvodce a pomocník pro české pendlery pracující v Německu. Usnadňujeme každodenní život a překonáváme jazykové i administrativní výzvy.',
      features: 'Funkce',
      germanLessons: 'Výuka němčiny',
      lawsOverview: 'Přehled zákonů',
      vehicleManagement: 'Správa vozidla',
      shiftPlanning: 'Plánování směn',
      aboutUs: 'O nás',
      aboutProject: 'O projektu',
      frequentQuestions: 'Časté otázky',
      allRightsReserved: 'Všechna práva vyhrazena',
      termsOfUse: 'Podmínky použití',
      privacyProtection: 'Ochrana soukromí',
      website: 'Web'
    }
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
    termsIntro: 'Diese Bedingungen regeln die Nutzung der PendlerApp-Anwendung.',
    
    // Terms detailed content
    terms: {
      introTitle: 'Einleitende Bestimmungen',
      agreement: 'Durch die Nutzung der Anwendung stimmen Sie diesen Bedingungen zu. Wenn Sie mit den Bedingungen nicht einverstanden sind, ist die Nutzung der Anwendung nicht möglich.',
      registrationTitle: 'Registrierung und Benutzerkonto',
      registrationDesc: 'Für die vollständige Nutzung der Anwendungsfunktionen ist eine Registrierung erforderlich. Bei der Registrierung ist der Benutzer verpflichtet, wahrheitsgemäße und vollständige Angaben zu machen.',
      userResponsibility: 'Der Benutzer ist verpflichtet, seine Anmeldedaten vor Missbrauch zu schützen und trägt die Verantwortung für alle unter seinem Konto durchgeführten Aktivitäten.',
      accountTermination: 'Der Betreiber behält sich das Recht vor, ein Benutzerkonto zu kündigen, das gegen diese Nutzungsbedingungen verstößt.',
      rightsTitle: 'Rechte und Pflichten des Benutzers',
      userCommits: 'Der Benutzer verpflichtet sich:',
      noHarm: 'Die Anwendung nicht in einer Weise zu nutzen, die ihre Funktionalität beschädigen, unzugänglich machen, überlasten oder verschlechtern könnte',
      noIllegalContent: 'Keine Inhalte in die Anwendung hochzuladen, die gegen Rechtsvorschriften oder Rechte Dritter verstoßen',
      noSpam: 'Über die Anwendung keine unerwünschten Nachrichten (Spam) zu verbreiten',
      noTampering: 'Nicht in die technische Umsetzung der Anwendung einzugreifen',
      noAutomation: 'Keine automatisierten Systeme für den Zugriff auf die Anwendung zu verwenden',
      liabilityTitle: 'Haftungsbeschränkung',
      informationNature: 'Die in der Anwendung bereitgestellten Informationen haben nur informativen Charakter und stellen keine Rechtsberatung dar. Der Betreiber übernimmt keine Verantwortung für eventuelle Schäden, die durch die Verwendung dieser Informationen entstehen.',
      userContentLiability: 'Der Betreiber ist nicht verantwortlich für Inhalte, die von Benutzern in die Anwendung eingefügt werden (z.B. Mitfahrgelegenheiten).',
      thirdPartyLinks: 'Die Anwendung kann Links zu Websites Dritter enthalten. Der Betreiber ist nicht verantwortlich für den Inhalt dieser Seiten.',
      availabilityTitle: 'Verfügbarkeit des Dienstes',
      noGuarantee: 'Der Betreiber garantiert nicht die ununterbrochene Verfügbarkeit der Anwendung. Bei technischen Problemen oder Wartung kann die Funktionalität der Anwendung vorübergehend eingeschränkt sein.',
      serviceChanges: 'Der Betreiber behält sich das Recht vor, den Betrieb der Anwendung oder Teile davon ohne vorherige Ankündigung zu ändern oder einzustellen.',
      privacyTitle: 'Schutz personenbezogener Daten',
      privacyReference: 'Die Verarbeitung personenbezogener Daten der Benutzer unterliegt den Datenschutzrichtlinien, die im Abschnitt „Datenschutz" verfügbar sind.',
      finalTitle: 'Schlussbestimmungen',
      czechLaw: 'Diese Nutzungsbedingungen unterliegen dem Recht der Tschechischen Republik.',
      termsChanges: 'Der Betreiber behält sich das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Über Änderungen wird der Benutzer über die Anwendung informiert.',
      effectiveDate: 'Diese Nutzungsbedingungen sind gültig und wirksam ab dem 1.5.2025.'
    },
    
    // Footer
    footer: {
      appName: 'Pendler-Assistent',
      description: 'Umfassender Leitfaden und Assistent für tschechische Pendler, die in Deutschland arbeiten. Wir erleichtern das tägliche Leben und überwinden sprachliche und administrative Herausforderungen.',
      features: 'Funktionen',
      germanLessons: 'Deutschunterricht',
      lawsOverview: 'Gesetze Übersicht',
      vehicleManagement: 'Fahrzeugverwaltung',
      shiftPlanning: 'Schichtplanung',
      aboutUs: 'Über uns',
      aboutProject: 'Über das Projekt',
      frequentQuestions: 'Häufige Fragen',
      allRightsReserved: 'Alle Rechte vorbehalten',
      termsOfUse: 'Nutzungsbedingungen',
      privacyProtection: 'Datenschutz',
      website: 'Website'
    }
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
    termsIntro: 'Niniejszy regulamin określa zasady korzystania z aplikacji PendlerApp.',
    
    // Terms detailed content
    terms: {
      introTitle: 'Postanowienia wstępne',
      agreement: 'Korzystając z aplikacji wyrażasz zgodę na niniejszy regulamin. Jeśli nie zgadzasz się z regulaminem, nie możesz korzystać z aplikacji.',
      registrationTitle: 'Rejestracja i konto użytkownika',
      registrationDesc: 'Dla pełnego wykorzystania funkcji aplikacji wymagana jest rejestracja. Podczas rejestracji użytkownik zobowiązany jest podać prawdziwe i kompletne dane.',
      userResponsibility: 'Użytkownik zobowiązany jest chronić swoje dane logowania przed nadużyciem i ponosi odpowiedzialność za wszystkie działania wykonane na jego koncie.',
      accountTermination: 'Operator zastrzega sobie prawo do usunięcia konta użytkownika, które narusza niniejszy regulamin.',
      rightsTitle: 'Prawa i obowiązki użytkownika',
      userCommits: 'Użytkownik zobowiązuje się:',
      noHarm: 'Nie używać aplikacji w sposób, który mógłby uszkodzić, uniemożliwić dostęp, przeciążyć lub pogorszyć jej funkcjonalność',
      noIllegalContent: 'Nie przesyłać do aplikacji treści naruszających przepisy prawne lub prawa osób trzecich',
      noSpam: 'Nie rozpowszechniać za pośrednictwem aplikacji niechcianych wiadomości (spam)',
      noTampering: 'Nie ingerować w techniczne wykonanie aplikacji',
      noAutomation: 'Nie używać zautomatyzowanych systemów dostępu do aplikacji',
      liabilityTitle: 'Ograniczenie odpowiedzialności',
      informationNature: 'Informacje dostarczone w aplikacji mają charakter wyłącznie informacyjny i nie stanowią porady prawnej. Operator nie ponosi odpowiedzialności za ewentualne szkody powstałe w wyniku korzystania z tych informacji.',
      userContentLiability: 'Operator nie odpowiada za treści wstawione do aplikacji przez użytkowników (np. oferty wspólnych przejazdów).',
      thirdPartyLinks: 'Aplikacja może zawierać linki do stron internetowych osób trzecich. Operator nie odpowiada za treść tych stron.',
      availabilityTitle: 'Dostępność usługi',
      noGuarantee: 'Operator nie gwarantuje nieprzerwanej dostępności aplikacji. W przypadku problemów technicznych lub konserwacji funkcjonalność aplikacji może być tymczasowo ograniczona.',
      serviceChanges: 'Operator zastrzega sobie prawo do zmiany lub zakończenia działania aplikacji lub jej części bez wcześniejszego powiadomienia.',
      privacyTitle: 'Ochrona danych osobowych',
      privacyReference: 'Przetwarzanie danych osobowych użytkowników podlega zasadom ochrony danych osobowych dostępnym w sekcji „Ochrona prywatności".',
      finalTitle: 'Postanowienia końcowe',
      czechLaw: 'Niniejszy regulamin podlega prawu Republiki Czeskiej.',
      termsChanges: 'Operator zastrzega sobie prawo do zmiany niniejszego regulaminu w każdym czasie. O zmianach użytkownik zostanie poinformowany za pośrednictwem aplikacji.',
      effectiveDate: 'Niniejszy regulamin obowiązuje od 1.5.2025.'
    },
    
    // Footer
    footer: {
      appName: 'Asystent Pendlera',
      description: 'Kompleksowy przewodnik i asystent dla czeskich pracowników dojeżdżających do Niemiec. Ułatwiamy codzienne życie i pokonujemy wyzwania językowe i administracyjne.',
      features: 'Funkcje',
      germanLessons: 'Nauka niemieckiego',
      lawsOverview: 'Przegląd praw',
      vehicleManagement: 'Zarządzanie pojazdem',
      shiftPlanning: 'Planowanie zmian',
      aboutUs: 'O nas',
      aboutProject: 'O projekcie',
      frequentQuestions: 'Często zadawane pytania',
      allRightsReserved: 'Wszelkie prawa zastrzeżone',
      termsOfUse: 'Regulamin',
      privacyProtection: 'Ochrona prywatności',
      website: 'Strona internetowa'
    }
  }
};

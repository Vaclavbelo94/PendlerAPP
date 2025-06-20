
// Utilita pro audit překladů
export interface TranslationAuditResult {
  missingKeys: string[];
  unusedKeys: string[];
  componentsWithHardcodedText: string[];
}

// Klíče, které jsou momentálně používané v aplikaci
export const USED_TRANSLATION_KEYS = [
  // Navigace
  'dashboard', 'shifts', 'translator', 'travel', 'taxAdvisor', 'vocabulary', 
  'laws', 'profile', 'settings', 'vehicles', 'vehicle', 'premium', 'admin',
  
  // Akce
  'save', 'cancel', 'edit', 'delete', 'add', 'search', 'loading', 'error', 
  'success', 'confirm', 'close', 'open', 'select',
  
  // Autentifikace
  'welcome', 'logout', 'login', 'register', 'email', 'password', 'username',
  
  // Překladač
  'translateFrom', 'translateTo', 'enterTextToTranslate', 'translation', 
  'history', 'clearHistory',
  
  // Formuláře
  'required', 'optional', 'invalidEmail', 'tooShort', 'tooLong',
  
  // Zprávy
  'saveSuccess', 'saveError', 'deleteSuccess', 'deleteError',
  
  // Obecné
  'home', 'back', 'next', 'previous', 'heroSubtitle',
  
  // Stránky
  'contact', 'privacy', 'terms', 'cookies', 'faq',
  
  // Footer
  'footer.appName', 'footer.allRightsReserved', 'footer.features', 
  'footer.aboutUs', 'footer.contact'
];

// Komponenty, které potřebují být aktualizovány pro používání t() funkce
export const COMPONENTS_NEEDING_TRANSLATION = [
  'src/components/modern/ModernNavbar.tsx',
  'src/components/modern/ModernFooter.tsx',
  'src/components/settings/LanguageSettings.tsx',
  'src/components/layouts/NavbarPatch.tsx'
];

export const auditTranslations = (): TranslationAuditResult => {
  return {
    missingKeys: [
      // Identifikované chybějící klíče budou přidány postupně
    ],
    unusedKeys: [
      // Budou identifikovány klíče, které už se nepoužívají
    ],
    componentsWithHardcodedText: COMPONENTS_NEEDING_TRANSLATION
  };
};

// Helper funkce pro vývojáře
export const logMissingTranslation = (key: string, language: string) => {
  console.warn(`🌐 Missing translation: "${key}" for language: ${language}`);
};

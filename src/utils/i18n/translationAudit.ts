
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
  'success', 'confirm', 'close', 'open', 'select', 'saving', 'reset',
  
  // Autentifikace
  'welcome', 'logout', 'login', 'register', 'email', 'password', 'username',
  'loginRequired',
  
  // Překladač
  'translateFrom', 'translateTo', 'enterTextToTranslate', 'translation', 
  'history', 'clearHistory', 'czech', 'german', 'english',
  
  // Formuláře
  'required', 'optional', 'invalidEmail', 'tooShort', 'tooLong',
  'personalInfo', 'displayName', 'aboutMe', 'residence', 'website',
  'enterYourName', 'writeSomethingAboutYourself', 'locationPlaceholder',
  
  // Nastavení
  'preferences', 'preferredLanguage', 'selectLanguage', 'notificationSettings',
  'emailNotifications', 'shiftNotifications', 'languageReminders',
  'receiveImportantEmailNotifications', 'receiveShiftStartNotifications',
  'receiveVocabularyReminders', 'settingsSaved', 'settingsError', 'settingsReset',
  'basicSettings', 'autoSave', 'compactMode', 'autoRefresh', 'defaultView',
  'generalAppSettings', 'autoSaveDesc', 'compactModeDesc', 'autoRefreshDesc',
  'selectDefaultPage', 'saveSettings',
  
  // Synchronizace
  'dataSync', 'syncSettingsBetweenDevices', 'backgroundSync', 'syncNotifications',
  'autoSyncWhenInactive', 'showSyncStatusNotifications', 'lastSync',
  'active', 'inactive', 'syncing', 'synchronize', 'never', 'unknown',
  
  // Zprávy
  'saveSuccess', 'saveError', 'deleteSuccess', 'deleteError',
  
  // Obecné
  'home', 'back', 'next', 'previous', 'heroSubtitle', 'heroTitle', 'heroDescription',
  'getStarted', 'activeUsers', 'shiftsManaged', 'countries',
  
  // Stránky
  'contact', 'privacy', 'terms', 'cookies', 'faq',
  
  // Footer
  'footer.appName', 'footer.allRightsReserved', 'footer.features', 
  'footer.aboutUs', 'footer.contact',

  // Dashboard
  'welcomeUser', 'welcomeDescription', 'newUserTips', 'liveTraining',
  'knowledgeBase', 'notifications', 'showFaqHelp', 'premiumBenefits',
  'advancedFeatures', 'allLanguageExercises', 'exportData', 'activatePremium',
  'currentShift', 'time', 'location', 'progress', 'weeklyOverview',
  'hoursWorked', 'plannedHours', 'estimatedEarnings', 'shiftsCompleted',
  'quickActions', 'addShift', 'addShiftDescription', 'taxAdvisorDescription',
  'translatorDescription', 'vehicleDescription', 'upcomingShifts',
  'tomorrow', 'friday', 'regular', 'overtime', 'viewAllShifts',

  // Dokumenty
  'addDocument', 'enterNewDocumentDetails', 'documentName', 'documentType',
  'selectDocumentType', 'technicalCertificate', 'insurance', 'stk',
  'emissionControl', 'purchaseContract', 'serviceBook', 'other',
  'expirationDate', 'notes', 'additionalInformation', 'documentSavedSuccessfully',
  'errorSavingDocument'
];

// Komponenty, které potřebují být aktualizovány pro používání t() funkce
export const COMPONENTS_NEEDING_TRANSLATION = [
  // Tyto komponenty byly již refaktorovány
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

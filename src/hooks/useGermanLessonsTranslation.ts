import { useState, useEffect, useCallback } from 'react';

type Language = 'cs' | 'en' | 'de' | 'sk';

interface LessonsTranslations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const lessonsTranslations: LessonsTranslations = {
  // Page headers
  'lessons.title': {
    cs: 'Praktické lekce němčiny',
    en: 'Practical German Lessons',
    de: 'Praktische Deutschstunden',
    sk: 'Praktické lekcie nemčiny'
  },
  'lessons.subtitle': {
    cs: 'Naučte se základní německé fráze pro práci v balíkovém centru',
    en: 'Learn basic German phrases for working in a package center',
    de: 'Lernen Sie grundlegende deutsche Phrasen für die Arbeit im Paketzentrum',
    sk: 'Naučte sa základné nemecké frázy pre prácu v balíkovom centre'
  },
  
  // Navigation
  'nav.firstDay': {
    cs: 'První den',
    en: 'First Day',
    de: 'Erster Tag',
    sk: 'Prvý deň'
  },
  'nav.dailyCommunication': {
    cs: 'Každodenní komunikace',
    en: 'Daily Communication',
    de: 'Tägliche Kommunikation',
    sk: 'Každodenná komunikácia'
  },
  'nav.technicalTerms': {
    cs: 'Technické termíny',
    en: 'Technical Terms',
    de: 'Technische Begriffe',
    sk: 'Technické termíny'
  },
  'nav.shiftWork': {
    cs: 'Směnová práce',
    en: 'Shift Work',
    de: 'Schichtarbeit',
    sk: 'Zmenová práca'
  },
  'nav.workEvaluation': {
    cs: 'Hodnocení práce',
    en: 'Work Evaluation',
    de: 'Arbeitsbeurteilung',
    sk: 'Hodnotenie práce'
  },
  'nav.numbersTime': {
    cs: 'Čísla a čas',
    en: 'Numbers & Time',
    de: 'Zahlen & Zeit',
    sk: 'Čísla a čas'
  },
  'nav.problemsHelp': {
    cs: 'Problémy a pomoc',
    en: 'Problems & Help',
    de: 'Probleme & Hilfe',
    sk: 'Problémy a pomoc'
  },
  'nav.endOfShift': {
    cs: 'Konec směny',
    en: 'End of Shift',
    de: 'Schichtende',
    sk: 'Koniec zmeny'
  },
  
  // Actions
  'action.playAudio': {
    cs: 'Přehrát zvuk',
    en: 'Play Audio',
    de: 'Audio abspielen',
    sk: 'Prehrať zvuk'
  },
  'action.slowSpeech': {
    cs: 'Pomalé tempo',
    en: 'Slow Speed',
    de: 'Langsame Geschwindigkeit',
    sk: 'Pomalé tempo'
  },
  'action.normalSpeech': {
    cs: 'Normální tempo',
    en: 'Normal Speed',
    de: 'Normale Geschwindigkeit',
    sk: 'Normálne tempo'
  },
  'action.search': {
    cs: 'Hledat fráze',
    en: 'Search phrases',
    de: 'Phrasen suchen',
    sk: 'Hľadať frázy'
  },
  'action.addToFavorites': {
    cs: 'Přidat k oblíbeným',
    en: 'Add to favorites',
    de: 'Zu Favoriten hinzufügen',
    sk: 'Pridať k obľúbeným'
  },
  'action.removeFromFavorites': {
    cs: 'Odebrat z oblíbených',
    en: 'Remove from favorites',
    de: 'Aus Favoriten entfernen',
    sk: 'Odstrániť z obľúbených'
  },
  
  // Search and filters
  'search.placeholder': {
    cs: 'Hledat fráze...',
    en: 'Search phrases...',
    de: 'Phrasen suchen...',
    sk: 'Hľadať frázy...'
  },
  'filter.all': {
    cs: 'Všechny',
    en: 'All',
    de: 'Alle',
    sk: 'Všetky'
  },
  'filter.critical': {
    cs: 'Klíčové',
    en: 'Critical',
    de: 'Kritisch',
    sk: 'Kľúčové'
  },
  'filter.important': {
    cs: 'Důležité',
    en: 'Important',
    de: 'Wichtig',
    sk: 'Dôležité'
  },
  'filter.useful': {
    cs: 'Užitečné',
    en: 'Useful',
    de: 'Nützlich',
    sk: 'Užitočné'
  },
  
  // Instructions
  'instruction.tapToPlay': {
    cs: 'Klepněte pro přehrání',
    en: 'Tap to play',
    de: 'Tippen zum Abspielen',
    sk: 'Klepnite pre prehranie'
  },
  'instruction.phonetic': {
    cs: 'Fonetický zápis',
    en: 'Phonetic notation',
    de: 'Phonetische Notation',
    sk: 'Fonetický zápis'
  },
  'instruction.favorites': {
    cs: 'Oblíbené fráze',
    en: 'Favorite phrases',
    de: 'Lieblingsphrases',
    sk: 'Obľúbené frázy'
  },
  
  // Tips and help
  'tip.learning': {
    cs: 'Tip pro efektivní učení',
    en: 'Tip for effective learning',
    de: 'Tipp für effektives Lernen',
    sk: 'Tip na efektívne učenie'
  },
  'tip.description': {
    cs: 'Používejte fráze aktivně v práci. Opakujte si je každý den a nebojte se chyb.',
    en: 'Use phrases actively at work. Repeat them every day and don\'t be afraid of mistakes.',
    de: 'Verwenden Sie Phrasen aktiv bei der Arbeit. Wiederholen Sie sie jeden Tag und haben Sie keine Angst vor Fehlern.',
    sk: 'Používajte frázy aktívne v práci. Opakujte si ich každý deň a nebojte sa chýb.'
  },
  
  // Audio status
  'audio.loading': {
    cs: 'Načítám audio...',
    en: 'Loading audio...',
    de: 'Audio wird geladen...',
    sk: 'Načítavam audio...'
  },
  'audio.error': {
    cs: 'Chyba přehrávání',
    en: 'Playback error',
    de: 'Wiedergabefehler',
    sk: 'Chyba prehrávania'
  },
  'audio.notSupported': {
    cs: 'Audio není podporováno',
    en: 'Audio not supported',
    de: 'Audio nicht unterstützt',
    sk: 'Audio nie je podporované'
  },
  
  // Progress and stats
  'stats.phrasesLearned': {
    cs: 'frází naučeno',
    en: 'phrases learned',
    de: 'Phrasen gelernt',
    sk: 'fráz naučených'
  },
  'stats.timeSpent': {
    cs: 'minut stráveno učením',
    en: 'minutes spent learning',
    de: 'Minuten mit Lernen verbracht',
    sk: 'minút strávených učením'
  },
  'stats.totalPhrases': {
    cs: 'celkem frází',
    en: 'total phrases',
    de: 'Phrasen insgesamt',
    sk: 'celkom fráz'
  }
};

export const useGermanLessonsTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('cs');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app_language') as Language;
    if (savedLanguage && ['cs', 'en', 'de', 'sk'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('app_language', language);
  }, []);
  
  const t = useCallback((key: string, fallback?: string): string => {
    const translation = lessonsTranslations[key];
    if (translation && translation[currentLanguage]) {
      return translation[currentLanguage];
    }
    
    if (translation && translation.cs) {
      return translation.cs;
    }
    
    return fallback || key;
  }, [currentLanguage]);
  
  return {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' }
    ] as const
  };
};

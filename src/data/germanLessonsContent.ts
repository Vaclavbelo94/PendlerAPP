
// Obsah německých lekcí pro zaměstnance balíkového centra

export interface LessonVocabularyItem {
  german: string;
  czech: string;
  polish?: string;
  example: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  importance: 'critical' | 'important' | 'useful';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // v minutách
  vocabulary: LessonVocabularyItem[];
  phrases: {
    german: string;
    czech: string;
    polish?: string;
    situation: string;
    importance: 'critical' | 'important' | 'useful';
  }[];
  practicalTips: string[];
  culturalNotes?: string[];
}

// Lekce 1: Základní pozdravy a představení
export const lesson1: Lesson = {
  id: 'lesson-1',
  title: 'Základní pozdravy a představení',
  description: 'Naučte se základní pozdravy a jak se představit kolegům a nadřízeným v práci',
  category: 'Základy komunikace',
  difficulty: 'beginner',
  estimatedTime: 15,
  vocabulary: [
    {
      german: 'Guten Morgen',
      czech: 'Dobré ráno',
      polish: 'Dzień dobry',
      example: 'Guten Morgen, Herr Schmidt! Ich bin bereit für die Arbeit.',
      category: 'Pozdravy',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'Guten Tag',
      czech: 'Dobrý den',
      polish: 'Dzień dobry',
      example: 'Guten Tag! Ich bin der neue Mitarbeiter.',
      category: 'Pozdravy',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'Auf Wiedersehen',
      czech: 'Na shledanou',
      polish: 'Do widzenia',
      example: 'Auf Wiedersehen! Bis morgen um 6 Uhr.',
      category: 'Pozdravy',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'Ich heiße',
      czech: 'Jmenuji se',
      polish: 'Nazywam się',
      example: 'Hallo, ich heiße Pavel und komme aus Tschechien.',
      category: 'Představení',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'Ich arbeite hier',
      czech: 'Pracuji zde',
      polish: 'Pracuję tutaj',
      example: 'Ich arbeite hier seit einer Woche im Paketzentrum.',
      category: 'Představení',
      difficulty: 'beginner',
      importance: 'important'
    }
  ],
  phrases: [
    {
      german: 'Entschuldigung, ich verstehe nicht',
      czech: 'Promiňte, nerozumím',
      polish: 'Przepraszam, nie rozumiem',
      situation: 'Když nerozumíte pokynům',
      importance: 'critical'
    },
    {
      german: 'Können Sie das wiederholen?',
      czech: 'Můžete to zopakovat?',
      polish: 'Czy może Pan/Pani powtórzyć?',
      situation: 'Když potřebujete zopakovat instrukce',
      importance: 'critical'
    },
    {
      german: 'Das ist mein erster Tag',
      czech: 'To je můj první den',
      polish: 'To mój pierwszy dzień',
      situation: 'Při představování se v práci',
      importance: 'important'
    }
  ],
  practicalTips: [
    'Vždy pozdravte kolegy, když přijdete do práce',
    'Použijte "Sie" (vykat) s nadřízenými, "du" (tykat) s kolegy po domluvě',
    'Německy mluvte pomalu a jasně, nebojte se chyb',
    'Mějte připravené základní fráze pro situace, kdy nerozumíte'
  ],
  culturalNotes: [
    'V Německu je důležitá přesnost a dochvilnost',
    'Pevný stisk ruky při pozdravu je standard',
    'Udržujte oční kontakt při rozhovoru'
  ]
};

// Lekce 2: Orientace v balíkovém centru
export const lesson2: Lesson = {
  id: 'lesson-2',
  title: 'Orientace v balíkovém centru',
  description: 'Základní pojmy pro orientaci v pracovním prostředí a komunikaci o místech',
  category: 'Pracovní prostředí',
  difficulty: 'beginner',
  estimatedTime: 20,
  vocabulary: [
    {
      german: 'das Paketzentrum',
      czech: 'balíkové centrum',
      polish: 'centrum paczkowe',
      example: 'Das Paketzentrum öffnet um 5 Uhr morgens.',
      category: 'Místa',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'der Arbeitsplatz',
      czech: 'pracovní místo',
      polish: 'miejsce pracy',
      example: 'Mein Arbeitsplatz ist beim Förderband Nummer 3.',
      category: 'Místa',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'das Förderband',
      czech: 'dopravní pás',
      polish: 'taśma przenośnikowa',
      example: 'Stellen Sie die Pakete auf das Förderband.',
      category: 'Vybavení',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'die Toilette',
      czech: 'toalety',
      polish: 'toaleta',
      example: 'Wo ist die Toilette? - Sie ist links vom Eingang.',
      category: 'Místa',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'die Kantine',
      czech: 'jídelna',
      polish: 'stołówka',
      example: 'In der Kantine gibt es warmes Essen um 12 Uhr.',
      category: 'Místa',
      difficulty: 'beginner',
      importance: 'important'
    },
    {
      german: 'der Ausgang',
      czech: 'východ',
      polish: 'wyjście',
      example: 'Der Notausgang ist dort hinten rechts.',
      category: 'Místa',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'links',
      czech: 'vlevo',
      polish: 'na lewo',
      example: 'Die schweren Pakete kommen links.',
      category: 'Směry',
      difficulty: 'beginner',
      importance: 'important'
    },
    {
      german: 'rechts',
      czech: 'vpravo',
      polish: 'na prawo',
      example: 'Gehen Sie rechts zum Warenausgang.',
      category: 'Směry',
      difficulty: 'beginner',
      importance: 'important'
    }
  ],
  phrases: [
    {
      german: 'Wo ist...?',
      czech: 'Kde je...?',
      polish: 'Gdzie jest...?',
      situation: 'Když hledáte nějaké místo',
      importance: 'critical'
    },
    {
      german: 'Können Sie mir den Weg zeigen?',
      czech: 'Můžete mi ukázat cestu?',
      polish: 'Czy może mi Pan/Pani pokazać drogę?',
      situation: 'Když se potřebujete zorientovat',
      importance: 'important'
    },
    {
      german: 'Ich finde nicht...',
      czech: 'Nemůžu najít...',
      polish: 'Nie mogę znaleźć...',
      situation: 'Když něco nemůžete najít',
      importance: 'important'
    }
  ],
  practicalTips: [
    'Naučte se mapu centra co nejdříve',
    'Požádejte kolegu, aby vám ukázal důležitá místa',
    'Pamatujte si čísla pásů a sekcí, kde pracujete',
    'Zjistěte si, kde jsou nouzové východy'
  ]
};

// Lekce 3: Základní čísla a čas
export const lesson3: Lesson = {
  id: 'lesson-3',
  title: 'Čísla, čas a rozměry',
  description: 'Naučte se čísla, čas a základní jednotky potřebné pro práci s balíky',
  category: 'Čísla a měření',
  difficulty: 'beginner',
  estimatedTime: 25,
  vocabulary: [
    {
      german: 'eins',
      czech: 'jedna',
      polish: 'jeden',
      example: 'Förderband Nummer eins ist kaputt.',
      category: 'Čísla',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'zwei',
      czech: 'dva',
      polish: 'dwa',
      example: 'Ich arbeite an Position zwei.',
      category: 'Čísla',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'fünf',
      czech: 'pět',
      polish: 'pięć',
      example: 'Die Pause dauert fünf Minuten.',
      category: 'Čísla',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'zehn',
      czech: 'deset',
      polish: 'dziesięć',
      example: 'Zehn Pakete pro Minute ist das Ziel.',
      category: 'Čísla',
      difficulty: 'beginner',
      importance: 'important'
    },
    {
      german: 'zwanzig',
      czech: 'dvacet',
      polish: 'dwadzieścia',
      example: 'Das Paket wiegt zwanzig Kilogramm.',
      category: 'Čísla',
      difficulty: 'beginner',
      importance: 'important'
    },
    {
      german: 'eine Stunde',
      czech: 'hodina',
      polish: 'godzina',
      example: 'Wir haben eine Stunde Mittagspause.',
      category: 'Čas',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'Wie spät ist es?',
      czech: 'Kolik je hodin?',
      polish: 'Która jest godzina?',
      example: 'Entschuldigung, wie spät ist es? Ist es schon 12 Uhr?',
      category: 'Čas',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'Kilogramm',
      czech: 'kilogram',
      polish: 'kilogram',
      example: 'Dieses Paket wiegt 5 Kilogramm.',
      category: 'Váha',
      difficulty: 'beginner',
      importance: 'critical'
    }
  ],
  phrases: [
    {
      german: 'Wann ist Pause?',
      czech: 'Kdy je přestávka?',
      polish: 'Kiedy jest przerwa?',
      situation: 'Ptát se na čas přestávky',
      importance: 'critical'
    },
    {
      german: 'Wie schwer ist das?',
      czech: 'Jak to je těžké?',
      polish: 'Jak to jest ciężkie?',
      situation: 'Ptát se na váhu balíku',
      importance: 'important'
    },
    {
      german: 'Um wie viel Uhr...?',
      czech: 'V kolik hodin...?',
      polish: 'O której godzinie...?',
      situation: 'Ptát se na čas události',
      importance: 'critical'
    }
  ],
  practicalTips: [
    'Naučte se číst digitální hodiny (24hodinový formát)',
    'Pamatujte si váhové limity pro balíky',
    'Používejte prsty pro ukázání malých čísel',
    'Naučte se základní matematické operace německy'
  ]
};

// Lekce 4: Práce s balíky
export const lesson4: Lesson = {
  id: 'lesson-4',
  title: 'Práce s balíky a třídění',
  description: 'Základní slovní zásoba pro manipulaci s balíky, třídění a označování',
  category: 'Pracovní úkoly',
  difficulty: 'intermediate',
  estimatedTime: 30,
  vocabulary: [
    {
      german: 'das Paket',
      czech: 'balík',
      polish: 'paczka',
      example: 'Dieses Paket geht nach Berlin.',
      category: 'Předměty',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'sortieren',
      czech: 'třídit',
      polish: 'sortować',
      example: 'Bitte sortieren Sie die Pakete nach Postleitzahlen.',
      category: 'Činnosti',
      difficulty: 'intermediate',
      importance: 'critical'
    },
    {
      german: 'scannen',
      czech: 'skenovat',
      polish: 'skanować',
      example: 'Scannen Sie jedes Paket mit dem Handheld.',
      category: 'Činnosti',
      difficulty: 'intermediate',
      importance: 'critical'
    },
    {
      german: 'der Barcode',
      czech: 'čárový kód',
      polish: 'kod kreskowy',
      example: 'Der Barcode ist beschädigt, ich kann ihn nicht scannen.',
      category: 'Technologie',
      difficulty: 'intermediate',
      importance: 'critical'
    },
    {
      german: 'die Adresse',
      czech: 'adresa',
      polish: 'adres',
      example: 'Prüfen Sie die Adresse auf dem Etikett.',
      category: 'Informace',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'beschädigt',
      czech: 'poškozený',
      polish: 'uszkodzony',
      example: 'Das Paket ist beschädigt - melden Sie es dem Supervisor.',
      category: 'Stav',
      difficulty: 'intermediate',
      importance: 'critical'
    },
    {
      german: 'schwer',
      czech: 'těžký',
      polish: 'ciężki',
      example: 'Dieses Paket ist sehr schwer - brauchen Sie Hilfe?',
      category: 'Vlastnosti',
      difficulty: 'beginner',
      importance: 'important'
    }
  ],
  phrases: [
    {
      german: 'Ich brauche Hilfe',
      czech: 'Potřebuji pomoct',
      polish: 'Potrzebuję pomocy',
      situation: 'Když potřebujete pomoc s těžkým balíkem',
      importance: 'critical'
    },
    {
      german: 'Das kann ich nicht lesen',
      czech: 'To nemůžu přečíst',
      polish: 'Nie mogę tego przeczytać',
      situation: 'Když nevidíte adresu nebo štítek',
      importance: 'critical'
    },
    {
      german: 'Wo gehört das hin?',
      czech: 'Kam to patří?',
      polish: 'Gdzie to należy?',
      situation: 'Když nevíte, kam balík patří',
      importance: 'critical'
    }
  ],
  practicalTips: [
    'Vždy nejdříve zkontrolujte stav balíku',
    'Při problémech se štítkem volejte nadřízeného',
    'Těžké balíky zvedejte správnou technikou',
    'Hlaste poškozené balíky okamžitě'
  ]
};

// Lekce 5: Komunikace s nadřízenými
export const lesson5: Lesson = {
  id: 'lesson-5',
  title: 'Komunikace s vedením',
  description: 'Jak komunikovat s nadřízenými, hlásit problémy a žádat o pomoc',
  category: 'Profesionální komunikace',
  difficulty: 'intermediate',
  estimatedTime: 25,
  vocabulary: [
    {
      german: 'der Chef',
      czech: 'šéf',
      polish: 'szef',
      example: 'Der Chef möchte mit Ihnen sprechen.',
      category: 'Lidé',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'der Supervisor',
      czech: 'supervizor',
      polish: 'supervisor',
      example: 'Rufen Sie den Supervisor, wenn es ein Problem gibt.',
      category: 'Lidé',
      difficulty: 'intermediate',
      importance: 'critical'
    },
    {
      german: 'das Problem',
      czech: 'problém',
      polish: 'problem',
      example: 'Es gibt ein Problem mit der Maschine.',
      category: 'Situace',
      difficulty: 'beginner',
      importance: 'critical'
    },
    {
      german: 'kaputt',
      czech: 'rozbité',
      polish: 'zepsute',
      example: 'Das Förderband ist kaputt.',
      category: 'Stav',
      difficulty: 'beginner',
      importance: 'critical'
    }
  ],
  phrases: [
    {
      german: 'Können Sie mir helfen?',
      czech: 'Můžete mi pomoct?',
      polish: 'Czy może mi Pan/Pani pomóc?',
      situation: 'Žádost o pomoc',
      importance: 'critical'
    },
    {
      german: 'Es gibt ein Problem',
      czech: 'Je tu problém',
      polish: 'Jest problem',
      situation: 'Hlášení problému',
      importance: 'critical'
    },
    {
      german: 'Ich verstehe die Aufgabe nicht',
      czech: 'Nerozumím úkolu',
      polish: 'Nie rozumiem zadania',
      situation: 'Když nerozumíte instrukci',
      importance: 'critical'
    }
  ],
  practicalTips: [
    'Buďte zdvořilí, ale přímí',
    'Hlaste problémy okamžitě',
    'Pokud něčemu nerozumíte, zeptejte se',
    'Používejte "Entschuldigung" před každou žádostí'
  ]
};

export const allLessons: Lesson[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5
];

export const getLessonById = (id: string): Lesson | undefined => {
  return allLessons.find(lesson => lesson.id === id);
};

export const getLessonsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Lesson[] => {
  return allLessons.filter(lesson => lesson.difficulty === difficulty);
};

export const getLessonsByCategory = (category: string): Lesson[] => {
  return allLessons.filter(lesson => lesson.category === category);
};

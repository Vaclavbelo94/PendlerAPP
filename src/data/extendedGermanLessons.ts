export interface ExtendedPhrase {
  id: string;
  german: string;
  czech: string;
  english: string;
  slovak: string;
  phonetic: string;
  situation: string;
  importance: 'critical' | 'important' | 'useful';
  category: 'greeting' | 'work' | 'emergency' | 'time' | 'numbers' | 'directions' | 'tools' | 'problems' | 'technical' | 'shifts' | 'evaluation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
}

export interface ExtendedLessonCategory {
  id: string;
  titleKey: string;
  icon: string;
  description: string;
  phrases: ExtendedPhrase[];
  estimatedTime: number;
}

export const extendedGermanLessons: ExtendedLessonCategory[] = [
  {
    id: 'first-day',
    titleKey: 'nav.firstDay',
    icon: '👋',
    description: 'Základní fráze pro první den v práci',
    estimatedTime: 15,
    phrases: [
      {
        id: 'fd1',
        german: 'Guten Morgen',
        czech: 'Dobré ráno',
        english: 'Good morning',
        slovak: 'Dobré ráno',
        phonetic: 'gúten morgen',
        situation: 'Příchod do práce ráno',
        importance: 'critical',
        category: 'greeting',
        difficulty: 'beginner'
      },
      {
        id: 'fd2',
        german: 'Ich bin neu hier',
        czech: 'Jsem tu nový/nová',
        english: 'I am new here',
        slovak: 'Som tu nový/nová',
        phonetic: 'ich bin nojé hír',
        situation: 'Představení se kolegům',
        importance: 'critical',
        category: 'greeting',
        difficulty: 'beginner'
      },
      {
        id: 'fd3',
        german: 'Wo ist mein Arbeitsplatz?',
        czech: 'Kde je moje pracovní místo?',
        english: 'Where is my workplace?',
        slovak: 'Kde je moje pracovné miesto?',
        phonetic: 'vo ist majn arbajtsplac',
        situation: 'Orientace v budově',
        importance: 'critical',
        category: 'directions',
        difficulty: 'beginner'
      },
      {
        id: 'fd4',
        german: 'Können Sie mir helfen?',
        czech: 'Můžete mi pomoct?',
        english: 'Can you help me?',
        slovak: 'Môžete mi pomôcť?',
        phonetic: 'könen zí mír helfen',
        situation: 'Žádost o pomoc',
        importance: 'critical',
        category: 'emergency',
        difficulty: 'beginner'
      },
      {
        id: 'fd5',
        german: 'Ich verstehe nicht',
        czech: 'Nerozumím',
        english: 'I don\'t understand',
        slovak: 'Nerozumiem',
        phonetic: 'ich ferštéhe nicht',
        situation: 'Když nerozumíte pokynům',
        importance: 'critical',
        category: 'problems',
        difficulty: 'beginner'
      },
      {
        id: 'fd6',
        german: 'Sprechen Sie bitte langsamer',
        czech: 'Mluvte prosím pomaleji',
        english: 'Please speak slower',
        slovak: 'Hovorte prosím pomalšie',
        phonetic: 'špréchen zí bité langzamer',
        situation: 'Když je řeč příliš rychlá',
        importance: 'important',
        category: 'problems',
        difficulty: 'beginner'
      },
      {
        id: 'fd7',
        german: 'Wie heißen Sie?',
        czech: 'Jak se jmenujete?',
        english: 'What is your name?',
        slovak: 'Ako sa voláte?',
        phonetic: 'ví hajsen zí',
        situation: 'Ptaní na jméno kolegy',
        importance: 'useful',
        category: 'greeting',
        difficulty: 'beginner'
      },
      {
        id: 'fd8',
        german: 'Ich heiße...',
        czech: 'Jmenuji se...',
        english: 'My name is...',
        slovak: 'Volám sa...',
        phonetic: 'ich hajsé...',
        situation: 'Představení svého jména',
        importance: 'critical',
        category: 'greeting',
        difficulty: 'beginner'
      },
      {
        id: 'fd9',
        german: 'Wo ist die Umkleidekabine?',
        czech: 'Kde je šatna?',
        english: 'Where is the changing room?',
        slovak: 'Kde je šatňa?',
        phonetic: 'vo ist dí umklajdekabiné',
        situation: 'Hledání šatny první den',
        importance: 'important',
        category: 'directions',
        difficulty: 'beginner'
      },
      {
        id: 'fd10',
        german: 'Wann beginnt meine Schicht?',
        czech: 'Kdy začíná moje směna?',
        english: 'When does my shift start?',
        slovak: 'Kedy začína moja zmena?',
        phonetic: 'van beginnt majné šicht',
        situation: 'Dotaz na začátek směny',
        importance: 'critical',
        category: 'time',
        difficulty: 'beginner'
      },
      {
        id: 'fd11',
        german: 'Wo bekomme ich meine Arbeitskleidung?',
        czech: 'Kde dostanu pracovní oblečení?',
        english: 'Where do I get my work clothes?',
        slovak: 'Kde dostanem pracovné oblečenie?',
        phonetic: 'vo bekomé ich majné arbajtsklajdung',
        situation: 'Žádost o pracovní oblečení',
        importance: 'important',
        category: 'work',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'daily-communication',
    titleKey: 'nav.dailyCommunication',
    icon: '💬',
    description: 'Každodenní komunikace a pracovní úkoly',
    estimatedTime: 25,
    phrases: [
      {
        id: 'dc1',
        german: 'Wo ist das Förderband?',
        czech: 'Kde je dopravní pás?',
        english: 'Where is the conveyor belt?',
        slovak: 'Kde je dopravný pás?',
        phonetic: 'vo ist das förderband',
        situation: 'Hledání vybavení',
        importance: 'important',
        category: 'tools',
        difficulty: 'intermediate'
      },
      {
        id: 'dc2',
        german: 'Das Paket ist beschädigt',
        czech: 'Balík je poškozený',
        english: 'The package is damaged',
        slovak: 'Balík je poškodený',
        phonetic: 'das pakét ist bešädigt',
        situation: 'Hlášení problémů s balíky',
        importance: 'important',
        category: 'problems',
        difficulty: 'intermediate'
      },
      {
        id: 'dc3',
        german: 'Wann ist Pause?',
        czech: 'Kdy je přestávka?',
        english: 'When is the break?',
        slovak: 'Kedy je prestávka?',
        phonetic: 'van ist pauzé',
        situation: 'Dotaz na přestávku',
        importance: 'important',
        category: 'time',
        difficulty: 'beginner'
      },
      {
        id: 'dc4',
        german: 'Ich gehe zur Toilette',
        czech: 'Jdu na toaletu',
        english: 'I\'m going to the toilet',
        slovak: 'Idem na toaletu',
        phonetic: 'ich géhe cur toaleté',
        situation: 'Odchod z pracovního místa',
        importance: 'important',
        category: 'work',
        difficulty: 'beginner'
      },
      {
        id: 'dc5',
        german: 'Dieser Scanner funktioniert nicht',
        czech: 'Tento skener nefunguje',
        english: 'This scanner doesn\'t work',
        slovak: 'Tento skener nefunguje',
        phonetic: 'dízer skanr funkcionírt nicht',
        situation: 'Hlášení technických problémů',
        importance: 'important',
        category: 'problems',
        difficulty: 'intermediate'
      },
      {
        id: 'dc6',
        german: 'Wie viel Uhr ist es?',
        czech: 'Kolik je hodin?',
        english: 'What time is it?',
        slovak: 'Koľko je hodín?',
        phonetic: 'ví fíl úr ist es',
        situation: 'Ptaní na čas',
        importance: 'useful',
        category: 'time',
        difficulty: 'beginner'
      },
      {
        id: 'dc7',
        german: 'Wo sind die schweren Pakete?',
        czech: 'Kde jsou těžké balíky?',
        english: 'Where are the heavy packages?',
        slovak: 'Kde sú ťažké balíky?',
        phonetic: 'vo zint dí švéren pakété',
        situation: 'Hledání specifických balíků',
        importance: 'useful',
        category: 'work',
        difficulty: 'intermediate'
      },
      {
        id: 'dc8',
        german: 'Kann ich Ihnen helfen?',
        czech: 'Mohu vám pomoct?',
        english: 'Can I help you?',
        slovak: 'Môžem vám pomôcť?',
        phonetic: 'kan ich ínen helfen',
        situation: 'Nabídka pomoci kolegovi',
        importance: 'useful',
        category: 'work',
        difficulty: 'intermediate'
      },
      {
        id: 'dc9',
        german: 'Ich bin mit dieser Aufgabe fertig',
        czech: 'Dokončil/a jsem tento úkol',
        english: 'I finished this task',
        slovak: 'Dokončil/a som túto úlohu',
        phonetic: 'ich bin mit dízer aufgabé fertig',
        situation: 'Hlášení dokončení úkolu',
        importance: 'important',
        category: 'work',
        difficulty: 'intermediate'
      },
      {
        id: 'dc10',
        german: 'Was soll ich als nächstes machen?',
        czech: 'Co mám dělat dál?',
        english: 'What should I do next?',
        slovak: 'Čo mám robiť ďalej?',
        phonetic: 'vas zol ich als nächstes machen',
        situation: 'Žádost o další úkol',
        importance: 'important',
        category: 'work',
        difficulty: 'intermediate'
      },
      {
        id: 'dc11',
        german: 'Können Sie mir das erklären?',
        czech: 'Můžete mi to vysvětlit?',
        english: 'Can you explain that to me?',
        slovak: 'Môžete mi to vysvetliť?',
        phonetic: 'könen zí mír das erkléren',
        situation: 'Žádost o vysvětlení',
        importance: 'important',
        category: 'problems',
        difficulty: 'intermediate'
      },
      {
        id: 'dc12',
        german: 'Wo ist der nächste Container?',
        czech: 'Kde je další kontejner?',
        english: 'Where is the next container?',
        slovak: 'Kde je ďalší kontajner?',
        phonetic: 'vo ist der nächsté kontajner',
        situation: 'Hledání kontejneru',
        importance: 'useful',
        category: 'directions',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'technical-terms',
    titleKey: 'nav.technicalTerms',
    icon: '🔧',
    description: 'Technické termíny a vybavení skladu',
    estimatedTime: 20,
    phrases: [
      {
        id: 'tt1',
        german: 'das Betriebssystem',
        czech: 'operační systém',
        english: 'operating system',
        slovak: 'operačný systém',
        phonetic: 'das betrípssystém',
        situation: 'Práce s počítačem',
        importance: 'useful',
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'tt2',
        german: 'der Handscanner',
        czech: 'ruční skener',
        english: 'handheld scanner',
        slovak: 'ručný skener',
        phonetic: 'der hantskanr',
        situation: 'Používání skeneru',
        importance: 'critical',
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'tt3',
        german: 'die Sortieranlage',
        czech: 'třídící zařízení',
        english: 'sorting facility',
        slovak: 'triedidciace zariadenie',
        phonetic: 'dí sortíranlagé',
        situation: 'Popis zařízení',
        importance: 'important',
        category: 'technical',
        difficulty: 'advanced'
      },
      {
        id: 'tt4',
        german: 'der Barcode',
        czech: 'čárový kód',
        english: 'barcode',
        slovak: 'čiarový kód',
        phonetic: 'der barkódé',
        situation: 'Skenování balíků',
        importance: 'critical',
        category: 'technical',
        difficulty: 'beginner'
      },
      {
        id: 'tt5',
        german: 'die Waage',
        czech: 'váha',
        english: 'scale',
        slovak: 'váha',
        phonetic: 'dí vágé',
        situation: 'Vážení balíků',
        importance: 'important',
        category: 'technical',
        difficulty: 'beginner'
      },
      {
        id: 'tt6',
        german: 'das Terminal',
        czech: 'terminál',
        english: 'terminal',
        slovak: 'terminál',
        phonetic: 'das terminál',
        situation: 'Práce s počítačem',
        importance: 'important',
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'tt7',
        german: 'die Datenbank',
        czech: 'databáze',
        english: 'database',
        slovak: 'databáza',
        phonetic: 'dí dátenbánk',
        situation: 'Práce se systémem',
        importance: 'useful',
        category: 'technical',
        difficulty: 'advanced'
      },
      {
        id: 'tt8',
        german: 'das Netzwerk',
        czech: 'síť',
        english: 'network',
        slovak: 'sieť',
        phonetic: 'das netverk',
        situation: 'Technické problémy',
        importance: 'useful',
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'tt9',
        german: 'die Software',
        czech: 'software',
        english: 'software',
        slovak: 'softvér',
        phonetic: 'dí softvér',
        situation: 'Práce s programy',
        importance: 'useful',
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'tt10',
        german: 'der Server',
        czech: 'server',
        english: 'server',
        slovak: 'server',
        phonetic: 'der servr',
        situation: 'Technické problémy',
        importance: 'useful',
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'tt11',
        german: 'die Automatisierung',
        czech: 'automatizace',
        english: 'automation',
        slovak: 'automatizácia',
        phonetic: 'dí automatizírung',
        situation: 'Modernizace skladu',
        importance: 'useful',
        category: 'technical',
        difficulty: 'advanced'
      },
      {
        id: 'tt12',
        german: 'die Kalibrierung',
        czech: 'kalibrace',
        english: 'calibration',
        slovak: 'kalibrácia',
        phonetic: 'dí kalibírung',
        situation: 'Nastavení zařízení',
        importance: 'useful',
        category: 'technical',
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'shift-work',
    titleKey: 'nav.shiftWork',
    icon: '⏰',
    description: 'Směnová práce a organizace času',
    estimatedTime: 18,
    phrases: [
      {
        id: 'sw1',
        german: 'Ich arbeite in der Frühschicht',
        czech: 'Pracuji v ranní směně',
        english: 'I work the morning shift',
        slovak: 'Pracujem v rannej zmene',
        phonetic: 'ich arbajté in der früšicht',
        situation: 'Informace o směně',
        importance: 'important',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw2',
        german: 'Wann ist Schichtwechsel?',
        czech: 'Kdy je střídání směn?',
        english: 'When is the shift change?',
        slovak: 'Kedy je striedanie zmien?',
        phonetic: 'van ist šichtvechsl',
        situation: 'Dotaz na střídání',
        importance: 'important',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw3',
        german: 'Ich mache Überstunden',
        czech: 'Dělám přesčas',
        english: 'I\'m working overtime',
        slovak: 'Robím nadčas',
        phonetic: 'ich machó überstundén',
        situation: 'Hlášení přesčasů',
        importance: 'important',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw4',
        german: 'Kann ich früher gehen?',
        czech: 'Mohu odejít dříve?',
        english: 'Can I leave early?',
        slovak: 'Môžem odísť skôr?',
        phonetic: 'kan ich früher géhen',
        situation: 'Žádost o předčasný odchod',
        importance: 'useful',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw5',
        german: 'Ich bin krank und kann nicht kommen',
        czech: 'Jsem nemocný/á a nemohu přijít',
        english: 'I\'m sick and can\'t come',
        slovak: 'Som chorý/á a nemôžem prísť',
        phonetic: 'ich bin krank unt kan nicht komén',
        situation: 'Hlášení nemoci',
        importance: 'critical',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw6',
        german: 'Wer übernimmt meine Schicht?',
        czech: 'Kdo převezme moji směnu?',
        english: 'Who will take over my shift?',
        slovak: 'Kto prevezme moju zmenu?',
        phonetic: 'vér übernijmt majné šicht',
        situation: 'Předání směny',
        importance: 'important',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw7',
        german: 'Die Nachtschicht ist anstrengend',
        czech: 'Noční směna je náročná',
        english: 'The night shift is exhausting',
        slovak: 'Nočná zmena je náročná',
        phonetic: 'dí nachtšicht ist anštrengent',
        situation: 'Komentář o směně',
        importance: 'useful',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw8',
        german: 'Ich bevorzuge die Tagschicht',
        czech: 'Preferuji denní směnu',
        english: 'I prefer the day shift',
        slovak: 'Preferujem dennú zmenu',
        phonetic: 'ich befertsugé dí tágšicht',
        situation: 'Preference směny',
        importance: 'useful',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw9',
        german: 'Können wir die Schichten tauschen?',
        czech: 'Můžeme si vyměnit směny?',
        english: 'Can we swap shifts?',
        slovak: 'Môžeme si vymeniť zmeny?',
        phonetic: 'könen vír dí šichtén tauščen',
        situation: 'Výměna směn',
        importance: 'useful',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw10',
        german: 'Ich habe Bereitschaftsdienst',
        czech: 'Mám pohotovost',
        english: 'I\'m on standby duty',
        slovak: 'Mám pohotovosť',
        phonetic: 'ich habé berajtšaftsdínst',
        situation: 'Informace o službě',
        importance: 'useful',
        category: 'shifts',
        difficulty: 'advanced'
      },
      {
        id: 'sw11',
        german: 'Der Schichtplan hat sich geändert',
        czech: 'Plán směn se změnil',
        english: 'The shift schedule has changed',
        slovak: 'Plán zmien sa zmenil',
        phonetic: 'der šichtplán hat zich geändert',
        situation: 'Změna rozvrhu',
        importance: 'important',
        category: 'shifts',
        difficulty: 'intermediate'
      },
      {
        id: 'sw12',
        german: 'Ich brauche einen freien Tag',
        czech: 'Potřebuji volný den',
        english: 'I need a day off',
        slovak: 'Potrebujem voľný deň',
        phonetic: 'ich brauché ajnen frajén tág',
        situation: 'Žádost o volno',
        importance: 'important',
        category: 'shifts',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'work-evaluation',
    titleKey: 'nav.workEvaluation',
    icon: '📊',
    description: 'Hodnocení práce a zpětná vazba',
    estimatedTime: 15,
    phrases: [
      {
        id: 'we1',
        german: 'Das habe ich gut gemacht',
        czech: 'To jsem udělal/a dobře',
        english: 'I did that well',
        slovak: 'To som urobil/a dobre',
        phonetic: 'das habé ich gút gemacht',
        situation: 'Sebehodnocení',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we2',
        german: 'Ich muss das verbessern',
        czech: 'Musím to zlepšit',
        english: 'I need to improve this',
        slovak: 'Musím to zlepšiť',
        phonetic: 'ich mus das ferbésern',
        situation: 'Sebekritika',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we3',
        german: 'Meine Leistung ist gestiegen',
        czech: 'Mój výkon se zvýšil',
        english: 'My performance has improved',
        slovak: 'Môj výkon sa zvýšil',
        phonetic: 'majné lajtung ist geštígén',
        situation: 'Pozitivní hodnocení',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we4',
        german: 'Können Sie mir Feedback geben?',
        czech: 'Můžete mi dát zpětnou vazbu?',
        english: 'Can you give me feedback?',
        slovak: 'Môžete mi dať spätnú väzbu?',
        phonetic: 'könen zí mír fídbek gében',
        situation: 'Žádost o hodnocení',
        importance: 'important',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we5',
        german: 'Ich arbeite effizienter',
        czech: 'Pracuji efektivněji',
        english: 'I work more efficiently',
        slovak: 'Pracujem efektívnejšie',
        phonetic: 'ich arbajté eficiénter',
        situation: 'Zlepšení výkonu',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we6',
        german: 'Das war ein Fehler',
        czech: 'To byla chyba',
        english: 'That was a mistake',
        slovak: 'To bola chyba',
        phonetic: 'das vár ajn féler',
        situation: 'Přiznání chyby',
        importance: 'important',
        category: 'evaluation',
        difficulty: 'beginner'
      },
      {
        id: 'we7',
        german: 'Ich lerne schnell',
        czech: 'Učím se rychle',
        english: 'I learn quickly',
        slovak: 'Učím sa rýchlo',
        phonetic: 'ich lerné šnel',
        situation: 'Pozitivní sebehodnocení',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we8',
        german: 'Das Team arbeitet gut zusammen',
        czech: 'Tým dobře spolupracuje',
        english: 'The team works well together',
        slovak: 'Tím dobre spolupracuje',
        phonetic: 'das tím arbajtet gút cusamen',
        situation: 'Hodnocení týmu',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we9',
        german: 'Ich bin pünktlich',
        czech: 'Jsem dochvilný/á',
        english: 'I am punctual',
        slovak: 'Som dochvíľny/á',
        phonetic: 'ich bin pünktlich',
        situation: 'Pozitivní vlastnost',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'beginner'
      },
      {
        id: 'we10',
        german: 'Ich bin motiviert',
        czech: 'Jsem motivovaný/á',
        english: 'I am motivated',
        slovak: 'Som motivovaný/á',
        phonetic: 'ich bin motivírt',
        situation: 'Popis postoju',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we11',
        german: 'Das Ziel wurde erreicht',
        czech: 'Cíl byl dosažen',
        english: 'The goal was achieved',
        slovak: 'Cieľ bol dosiahnutý',
        phonetic: 'das cíl vurdé erajcht',
        situation: 'Úspěšné dokončení',
        importance: 'useful',
        category: 'evaluation',
        difficulty: 'intermediate'
      },
      {
        id: 'we12',
        german: 'Ich brauche mehr Training',
        czech: 'Potřebuji více tréninku',
        english: 'I need more training',
        slovak: 'Potrebujem viac tréningu',
        phonetic: 'ich brauché mér tréning',
        situation: 'Žádost o školení',
        importance: 'important',
        category: 'evaluation',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'numbers-time',
    titleKey: 'nav.numbersTime',
    icon: '🕐',
    description: 'Čísla, čas a základní měření',
    estimatedTime: 20,
    phrases: [
      {
        id: 'nt1',
        german: 'eins, zwei, drei',
        czech: 'jedna, dva, tři',
        english: 'one, two, three',
        slovak: 'jeden, dva, tri',
        phonetic: 'ajns, cvaj, draj',
        situation: 'Základní čísla',
        importance: 'critical',
        category: 'numbers',
        difficulty: 'beginner'
      },
      {
        id: 'nt2',
        german: 'zehn, zwanzig, dreißig',
        czech: 'deset, dvacet, třicet',
        english: 'ten, twenty, thirty',
        slovak: 'desať, dvadsať, tridsať',
        phonetic: 'cén, cvancich, drajsich',
        situation: 'Desítky čísel',
        importance: 'important',
        category: 'numbers',
        difficulty: 'beginner'
      },
      {
        id: 'nt3',
        german: 'Es ist acht Uhr',
        czech: 'Je osm hodin',
        english: 'It is eight o\'clock',
        slovak: 'Je osem hodín',
        phonetic: 'es ist acht úr',
        situation: 'Oznámení času',
        importance: 'important',
        category: 'time',
        difficulty: 'intermediate'
      },
      {
        id: 'nt4',
        german: 'Um sechs Uhr beginnt die Schicht',
        czech: 'V šest hodin začíná směna',
        english: 'The shift starts at six o\'clock',
        slovak: 'O šiestej hodine začína zmena',
        phonetic: 'um zeks úr beginnt dí šicht',
        situation: 'Informace o začátku směny',
        importance: 'critical',
        category: 'time',
        difficulty: 'intermediate'
      },
      {
        id: 'nt5',
        german: 'Das wiegt fünf Kilogramm',
        czech: 'To váží pět kilogramů',
        english: 'That weighs five kilograms',
        slovak: 'To váži päť kilogramov',
        phonetic: 'das víkt fünf kilogram',
        situation: 'Informace o váze balíku',
        importance: 'useful',
        category: 'numbers',
        difficulty: 'intermediate'
      },
      {
        id: 'nt6',
        german: 'Pause ist um zwölf Uhr',
        czech: 'Přestávka je ve dvanáct hodin',
        english: 'Break is at twelve o\'clock',
        slovak: 'Prestávka je o dvanástej hodine',
        phonetic: 'pauzé ist um cvölf úr',
        situation: 'Informace o čase přestávky',
        importance: 'important',
        category: 'time',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'problems-help',
    titleKey: 'nav.problemsHelp',
    icon: '🆘',
    description: 'Nouzové situace a žádosti o pomoc',
    estimatedTime: 15,
    phrases: [
      {
        id: 'ph1',
        german: 'Ich brauche Hilfe',
        czech: 'Potřebuji pomoct',
        english: 'I need help',
        slovak: 'Potrebujem pomoc',
        phonetic: 'ich brauché hilfé',
        situation: 'Urgentní žádost o pomoc',
        importance: 'critical',
        category: 'emergency',
        difficulty: 'beginner'
      },
      {
        id: 'ph2',
        german: 'Ich bin krank',
        czech: 'Jsem nemocný/nemocná',
        english: 'I am sick',
        slovak: 'Som chorý/chorá',
        phonetic: 'ich bin krank',
        situation: 'Zdravotní problémy',
        importance: 'critical',
        category: 'emergency',
        difficulty: 'beginner'
      },
      {
        id: 'ph3',
        german: 'Wo ist der Vorgesetzte?',
        czech: 'Kde je nadřízený?',
        english: 'Where is the supervisor?',
        slovak: 'Kde je nadriadený?',
        phonetic: 'vo ist der forgezecté',
        situation: 'Hledání vedoucího',
        importance: 'important',
        category: 'directions',
        difficulty: 'intermediate'
      },
      {
        id: 'ph4',
        german: 'Es tut mir leid',
        czech: 'Je mi líto',
        english: 'I\'m sorry',
        slovak: 'Je mi ľúto',
        phonetic: 'es tut mír lajt',
        situation: 'Omluva za chybu',
        importance: 'important',
        category: 'problems',
        difficulty: 'beginner'
      },
      {
        id: 'ph5',
        german: 'Das ist ein Notfall',
        czech: 'To je nouzová situace',
        english: 'This is an emergency',
        slovak: 'To je núdzová situácia',
        phonetic: 'das ist ajn nótfal',
        situation: 'Nahlášení nouzové situace',
        importance: 'critical',
        category: 'emergency',
        difficulty: 'intermediate'
      },
      {
        id: 'ph6',
        german: 'Rufen Sie den Arzt',
        czech: 'Zavolejte doktora',
        english: 'Call the doctor',
        slovak: 'Zavolajte lekára',
        phonetic: 'rúfen zí den arct',
        situation: 'Žádost o lékařskou pomoc',
        importance: 'critical',
        category: 'emergency',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'end-of-shift',
    titleKey: 'nav.endOfShift',
    icon: '🏠',
    description: 'Konec směny a rozloučení',
    estimatedTime: 10,
    phrases: [
      {
        id: 'es1',
        german: 'Auf Wiedersehen',
        czech: 'Na shledanou',
        english: 'Goodbye',
        slovak: 'Dovidenia',
        phonetic: 'auf víderzen',
        situation: 'Rozloučení na konci směny',
        importance: 'important',
        category: 'greeting',
        difficulty: 'beginner'
      },
      {
        id: 'es2',
        german: 'Bis morgen',
        czech: 'Do zítřka',
        english: 'See you tomorrow',
        slovak: 'Do zajtra',
        phonetic: 'bis morgen',
        situation: 'Rozloučení do dalšího dne',
        importance: 'important',
        category: 'greeting',
        difficulty: 'beginner'
      },
      {
        id: 'es3',
        german: 'Meine Schicht ist zu Ende',
        czech: 'Moje směna končí',
        english: 'My shift is over',
        slovak: 'Moja zmena končí',
        phonetic: 'majné šicht ist cu endé',
        situation: 'Oznámení konce směny',
        importance: 'important',
        category: 'work',
        difficulty: 'intermediate'
      },
      {
        id: 'es4',
        german: 'Schönes Wochenende',
        czech: 'Hezký víkend',
        english: 'Have a nice weekend',
        slovak: 'Pekný víkend',
        phonetic: 'šönés vochenendé',
        situation: 'Přání na víkend',
        importance: 'useful',
        category: 'greeting',
        difficulty: 'intermediate'
      },
      {
        id: 'es5',
        german: 'Vielen Dank für die Hilfe',
        czech: 'Děkuji za pomoc',
        english: 'Thank you for the help',
        slovak: 'Ďakujem za pomoc',
        phonetic: 'fílén dank für dí hilfé',
        situation: 'Poděkování kolegům',
        importance: 'useful',
        category: 'greeting',
        difficulty: 'intermediate'
      }
    ]
  }
];

export const getAllPhrases = (): ExtendedPhrase[] => {
  return extendedGermanLessons.flatMap(category => category.phrases);
};

export const getPhrasesByCategory = (categoryId: string): ExtendedPhrase[] => {
  const category = extendedGermanLessons.find(cat => cat.id === categoryId);
  return category ? category.phrases : [];
};

export const getPhrasesByImportance = (importance: 'critical' | 'important' | 'useful'): ExtendedPhrase[] => {
  return getAllPhrases().filter(phrase => phrase.importance === importance);
};

export const searchPhrases = (searchTerm: string): ExtendedPhrase[] => {
  const term = searchTerm.toLowerCase();
  return getAllPhrases().filter(phrase => 
    phrase.german.toLowerCase().includes(term) ||
    phrase.czech.toLowerCase().includes(term) ||
    phrase.english.toLowerCase().includes(term) ||
    phrase.slovak.toLowerCase().includes(term) ||
    phrase.situation.toLowerCase().includes(term)
  );
};

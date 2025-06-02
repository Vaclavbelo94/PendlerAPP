
export interface PracticalPhrase {
  id: string;
  german: string;
  czech: string;
  english: string;
  slovak: string;
  phonetic: string;
  situation: string;
  importance: 'critical' | 'important' | 'useful';
}

export interface LessonCategory {
  id: string;
  titleKey: string;
  icon: string;
  phrases: PracticalPhrase[];
}

// Export aliases for compatibility
export type ExtendedPhrase = PracticalPhrase;
export type ExtendedLessonCategory = LessonCategory;

export const extendedGermanLessons: LessonCategory[] = [
  {
    id: 'first-day',
    titleKey: 'První den',
    icon: '👋',
    phrases: [
      {
        id: 'fd1',
        german: 'Guten Morgen',
        czech: 'Dobré ráno',
        english: 'Good morning',
        slovak: 'Dobré ráno',
        phonetic: 'gúten morgen',
        situation: 'Příchod do práce',
        importance: 'critical'
      },
      {
        id: 'fd2',
        german: 'Ich bin neu hier',
        czech: 'Jsem tu nový/nová',
        english: 'I am new here',
        slovak: 'Som tu nový/nová',
        phonetic: 'ich bin nojé hír',
        situation: 'Představení se kolegům',
        importance: 'critical'
      },
      {
        id: 'fd3',
        german: 'Wo ist mein Arbeitsplatz?',
        czech: 'Kde je moje pracovní místo?',
        english: 'Where is my workplace?',
        slovak: 'Kde je moje pracovné miesto?',
        phonetic: 'vo ist majn arbajtsplac',
        situation: 'Orientace v budově',
        importance: 'critical'
      },
      {
        id: 'fd4',
        german: 'Können Sie mir helfen?',
        czech: 'Můžete mi pomoct?',
        english: 'Can you help me?',
        slovak: 'Môžete mi pomôcť?',
        phonetic: 'könen zí mír helfen',
        situation: 'Žádost o pomoc',
        importance: 'critical'
      },
      {
        id: 'fd5',
        german: 'Ich verstehe nicht',
        czech: 'Nerozumím',
        english: 'I don\'t understand',
        slovak: 'Nerozumiem',
        phonetic: 'ich ferštéhe nicht',
        situation: 'Když nerozumíte pokynům',
        importance: 'critical'
      }
    ]
  },
  {
    id: 'daily-communication',
    titleKey: 'Denní komunikace',
    icon: '💬',
    phrases: [
      {
        id: 'dc1',
        german: 'Wo ist das Förderband?',
        czech: 'Kde je dopravní pás?',
        english: 'Where is the conveyor belt?',
        slovak: 'Kde je dopravný pás?',
        phonetic: 'vo ist das förderband',
        situation: 'Hledání vybavení',
        importance: 'important'
      },
      {
        id: 'dc2',
        german: 'Das Paket ist beschädigt',
        czech: 'Balík je poškozený',
        english: 'The package is damaged',
        slovak: 'Balík je poškodený',
        phonetic: 'das pakét ist bešädigt',
        situation: 'Hlášení problémů s balíky',
        importance: 'important'
      },
      {
        id: 'dc3',
        german: 'Wann ist Pause?',
        czech: 'Kdy je přestávka?',
        english: 'When is the break?',
        slovak: 'Kedy je prestávka?',
        phonetic: 'van ist pauzé',
        situation: 'Dotaz na přestávku',
        importance: 'important'
      },
      {
        id: 'dc4',
        german: 'Ich gehe zur Toilette',
        czech: 'Jdu na toaletu',
        english: 'I\'m going to the toilet',
        slovak: 'Idem na toaletu',
        phonetic: 'ich géhe cur toaleté',
        situation: 'Odchod z pracovního místa',
        importance: 'important'
      },
      {
        id: 'dc5',
        german: 'Dieser Scanner funktioniert nicht',
        czech: 'Tento skener nefunguje',
        english: 'This scanner doesn\'t work',
        slovak: 'Tento skener nefunguje',
        phonetic: 'dízer skanr funkcionírt nicht',
        situation: 'Hlášení technických problémů',
        importance: 'important'
      }
    ]
  },
  {
    id: 'technical-terms',
    titleKey: 'Technické termíny',
    icon: '🔧',
    phrases: [
      {
        id: 'tt1',
        german: 'Der Scanner',
        czech: 'Skener',
        english: 'Scanner',
        slovak: 'Skener',
        phonetic: 'der skanr',
        situation: 'Práce s technickým vybavením',
        importance: 'important'
      },
      {
        id: 'tt2',
        german: 'Das Förderband',
        czech: 'Dopravní pás',
        english: 'Conveyor belt',
        slovak: 'Dopravný pás',
        phonetic: 'das förderband',
        situation: 'Základní vybavení',
        importance: 'critical'
      },
      {
        id: 'tt3',
        german: 'Der Barcode',
        czech: 'Čárový kód',
        english: 'Barcode',
        slovak: 'Čiarový kód',
        phonetic: 'der barkód',
        situation: 'Skenování balíků',
        importance: 'important'
      },
      {
        id: 'tt4',
        german: 'Die Waage',
        czech: 'Váha',
        english: 'Scale',
        slovak: 'Váha',
        phonetic: 'dí vágé',
        situation: 'Vážení balíků',
        importance: 'important'
      },
      {
        id: 'tt5',
        german: 'Der Container',
        czech: 'Kontejner',
        english: 'Container',
        slovak: 'Kontajner',
        phonetic: 'der kontejnr',
        situation: 'Třídění balíků',
        importance: 'important'
      }
    ]
  },
  {
    id: 'shift-work',
    titleKey: 'Směnová práce',
    icon: '⏰',
    phrases: [
      {
        id: 'sw1',
        german: 'Meine Schicht beginnt um 6 Uhr',
        czech: 'Moje směna začína v 6 hodin',
        english: 'My shift starts at 6 o\'clock',
        slovak: 'Moja zmena začína o 6 hodín',
        phonetic: 'majné šicht begint um zeks úr',
        situation: 'Informace o směně',
        importance: 'important'
      },
      {
        id: 'sw2',
        german: 'Ich arbeite Nachtschicht',
        czech: 'Pracuji noční směnu',
        english: 'I work night shift',
        slovak: 'Pracujem nočnú zmenu',
        phonetic: 'ich arbajté nachtšicht',
        situation: 'Typ směny',
        importance: 'important'
      },
      {
        id: 'sw3',
        german: 'Überstunden',
        czech: 'Přesčasy',
        english: 'Overtime',
        slovak: 'Nadčasy',
        phonetic: 'ybršhtunden',
        situation: 'Práce přes čas',
        importance: 'useful'
      },
      {
        id: 'sw4',
        german: 'Ich bin müde',
        czech: 'Jsem unavený/unavená',
        english: 'I am tired',
        slovak: 'Som unavený/unavená',
        phonetic: 'ich bin mýdé',
        situation: 'Vyjádření stavu',
        importance: 'useful'
      },
      {
        id: 'sw5',
        german: 'Kann ich früher gehen?',
        czech: 'Mohu jít dříve?',
        english: 'Can I leave earlier?',
        slovak: 'Môžem ísť skôr?',
        phonetic: 'kan ich frýher géhen',
        situation: 'Žádost o dřívější odchod',
        importance: 'useful'
      }
    ]
  },
  {
    id: 'work-evaluation',
    titleKey: 'Hodnocení práce',
    icon: '📊',
    phrases: [
      {
        id: 'we1',
        german: 'Gute Arbeit',
        czech: 'Dobrá práce',
        english: 'Good work',
        slovak: 'Dobrá práca',
        phonetic: 'gúté arbajt',
        situation: 'Pochvala',
        importance: 'useful'
      },
      {
        id: 'we2',
        german: 'Das war schnell',
        czech: 'To bylo rychlé',
        english: 'That was fast',
        slovak: 'To bolo rýchle',
        phonetic: 'das var šnel',
        situation: 'Pozitivní hodnocení',
        importance: 'useful'
      },
      {
        id: 'we3',
        german: 'Ich muss langsamer arbeiten',
        czech: 'Musím pracovat pomaleji',
        english: 'I need to work slower',
        slovak: 'Musím pracovať pomalšie',
        phonetic: 'ich mus langzámr arbajten',
        situation: 'Sebehodnocení',
        importance: 'useful'
      },
      {
        id: 'we4',
        german: 'Können Sie mir zeigen?',
        czech: 'Můžete mi ukázat?',
        english: 'Can you show me?',
        slovak: 'Môžete mi ukázať?',
        phonetic: 'könen zí mír cajgen',
        situation: 'Žádost o ukázku',
        importance: 'important'
      },
      {
        id: 'we5',
        german: 'Ich verstehe das nicht',
        czech: 'Tomu nerozumím',
        english: 'I don\'t understand that',
        slovak: 'Tomu nerozumiem',
        phonetic: 'ich ferštéhe das nicht',
        situation: 'Nepochopení',
        importance: 'critical'
      }
    ]
  },
  {
    id: 'numbers-time',
    titleKey: 'Čísla a čas',
    icon: '🕐',
    phrases: [
      {
        id: 'nt1',
        german: 'Eins, zwei, drei',
        czech: 'Jedna, dva, tři',
        english: 'One, two, three',
        slovak: 'Jedna, dva, tri',
        phonetic: 'ajns, cvaj, draj',
        situation: 'Základní počítání',
        importance: 'critical'
      },
      {
        id: 'nt2',
        german: 'Es ist acht Uhr',
        czech: 'Je osm hodin',
        english: 'It is eight o\'clock',
        slovak: 'Je osem hodín',
        phonetic: 'es ist acht úr',
        situation: 'Určení času',
        importance: 'important'
      },
      {
        id: 'nt3',
        german: 'Wie spät ist es?',
        czech: 'Kolik je hodin?',
        english: 'What time is it?',
        slovak: 'Koľko je hodín?',
        phonetic: 'ví špét ist es',
        situation: 'Dotaz na čas',
        importance: 'important'
      },
      {
        id: 'nt4',
        german: 'Zehn Minuten',
        czech: 'Deset minut',
        english: 'Ten minutes',
        slovak: 'Desať minút',
        phonetic: 'cén minúten',
        situation: 'Časové údaje',
        importance: 'important'
      },
      {
        id: 'nt5',
        german: 'Eine halbe Stunde',
        czech: 'Půl hodiny',
        english: 'Half an hour',
        slovak: 'Pol hodiny',
        phonetic: 'ajné halbé štundé',
        situation: 'Vyjádření času',
        importance: 'useful'
      }
    ]
  },
  {
    id: 'problems-help',
    titleKey: 'Problémy a pomoc',
    icon: '🆘',
    phrases: [
      {
        id: 'ph1',
        german: 'Ich brauche Hilfe',
        czech: 'Potřebuji pomoc',
        english: 'I need help',
        slovak: 'Potrebujem pomoc',
        phonetic: 'ich brauché hilfé',
        situation: 'Urgentní žádost o pomoc',
        importance: 'critical'
      },
      {
        id: 'ph2',
        german: 'Ich bin krank',
        czech: 'Jsem nemocný/nemocná',
        english: 'I am sick',
        slovak: 'Som chorý/chorá',
        phonetic: 'ich bin krank',
        situation: 'Zdravotní problémy',
        importance: 'critical'
      },
      {
        id: 'ph3',
        german: 'Wo ist der Vorgesetzte?',
        czech: 'Kde je nadřízený?',
        english: 'Where is the supervisor?',
        slovak: 'Kde je nadriadený?',
        phonetic: 'vo ist der forgezecté',
        situation: 'Hledání vedoucího',
        importance: 'important'
      },
      {
        id: 'ph4',
        german: 'Es tut mir leid',
        czech: 'Je mi líto',
        english: 'I\'m sorry',
        slovak: 'Je mi ľúto',
        phonetic: 'es tut mír lajt',
        situation: 'Omluva za chybu',
        importance: 'important'
      },
      {
        id: 'ph5',
        german: 'Können Sie das wiederholen?',
        czech: 'Můžete to zopakovat?',
        english: 'Can you repeat that?',
        slovak: 'Môžete to zopakovať?',
        phonetic: 'könen zí das víderholén',
        situation: 'Žádost o zopakování',
        importance: 'important'
      }
    ]
  },
  {
    id: 'end-of-shift',
    titleKey: 'Konec směny',
    icon: '🏠',
    phrases: [
      {
        id: 'es1',
        german: 'Auf Wiedersehen',
        czech: 'Na shledanou',
        english: 'Goodbye',
        slovak: 'Dovidenia',
        phonetic: 'auf víderzen',
        situation: 'Rozloučení na konci směny',
        importance: 'important'
      },
      {
        id: 'es2',
        german: 'Bis morgen',
        czech: 'Do zítřka',
        english: 'See you tomorrow',
        slovak: 'Do zajtra',
        phonetic: 'bis morgen',
        situation: 'Rozloučení do dalšího dne',
        importance: 'important'
      },
      {
        id: 'es3',
        german: 'Meine Schicht ist zu Ende',
        czech: 'Moje směna končí',
        english: 'My shift is over',
        slovak: 'Moja zmena končí',
        phonetic: 'majné šicht ist cu endé',
        situation: 'Oznámení konce směny',
        importance: 'important'
      },
      {
        id: 'es4',
        german: 'Schönes Wochenende',
        czech: 'Hezký víkend',
        english: 'Have a nice weekend',
        slovak: 'Pekný víkend',
        phonetic: 'šönés vochenendé',
        situation: 'Přání na víkend',
        importance: 'useful'
      },
      {
        id: 'es5',
        german: 'Vielen Dank',
        czech: 'Děkuji mnohokrát',
        english: 'Thank you very much',
        slovak: 'Ďakujem veľmi pekne',
        phonetic: 'fílén dank',
        situation: 'Poděkování kolegům',
        importance: 'useful'
      }
    ]
  }
];

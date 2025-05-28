
export interface ExtendedPhrase {
  id: string;
  german: string;
  czech: string;
  english: string;
  slovak: string;
  phonetic: string;
  situation: string;
  importance: 'critical' | 'important' | 'useful';
  category: 'greeting' | 'work' | 'emergency' | 'time' | 'numbers' | 'directions' | 'tools' | 'problems';
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

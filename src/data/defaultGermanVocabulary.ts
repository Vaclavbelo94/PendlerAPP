import { VocabularyItem } from '@/models/VocabularyItem';

// Výchozí slovní zásoba pro německý jazyk
export const defaultGermanVocabulary: VocabularyItem[] = [
  // Základní fráze a pozdravy
  {
    id: 'de_1',
    word: 'Guten Tag',
    translation: 'Dobrý den',
    example: 'Guten Tag, wie geht es Ihnen?',
    category: 'Pozdravy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_2',
    word: 'Guten Morgen',
    translation: 'Dobré ráno',
    example: 'Guten Morgen, wie hast du geschlafen?',
    category: 'Pozdravy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_3',
    word: 'Auf Wiedersehen',
    translation: 'Na shledanou',
    example: 'Ich muss jetzt gehen. Auf Wiedersehen!',
    category: 'Pozdravy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_4',
    word: 'Danke schön',
    translation: 'Děkuji pěkně',
    example: 'Danke schön für deine Hilfe.',
    category: 'Pozdravy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Podstatná jména
  {
    id: 'de_5',
    word: 'der Mann',
    translation: 'muž',
    example: 'Der Mann trägt einen schwarzen Anzug.',
    category: 'Podstatná jména',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_6',
    word: 'die Frau',
    translation: 'žena',
    example: 'Die Frau liest ein Buch.',
    category: 'Podstatná jména',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_7',
    word: 'das Kind',
    translation: 'dítě',
    example: 'Das Kind spielt im Garten.',
    category: 'Podstatná jména',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_8',
    word: 'das Haus',
    translation: 'dům',
    example: 'Das Haus ist sehr groß.',
    category: 'Podstatná jména',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Jídlo
  {
    id: 'de_9',
    word: 'das Brot',
    translation: 'chléb',
    example: 'Ich esse gern frisches Brot zum Frühstück.',
    category: 'Jídlo',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_10',
    word: 'der Käse',
    translation: 'sýr',
    example: 'Ich mag deutschen Käse sehr.',
    category: 'Jídlo',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_11',
    word: 'der Apfel',
    translation: 'jablko',
    example: 'Ein Apfel am Tag hält den Doktor fern.',
    category: 'Jídlo',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Barvy
  {
    id: 'de_12',
    word: 'rot',
    translation: 'červený',
    example: 'Mein Auto ist rot.',
    category: 'Barvy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_13',
    word: 'blau',
    translation: 'modrý',
    example: 'Der Himmel ist heute sehr blau.',
    category: 'Barvy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_14',
    word: 'grün',
    translation: 'zelený',
    example: 'Die Wiese ist grün.',
    category: 'Barvy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_15',
    word: 'schwarz',
    translation: 'černý',
    example: 'Sie trägt ein schwarzes Kleid.',
    category: 'Barvy',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Čísla
  {
    id: 'de_16',
    word: 'eins',
    translation: 'jedna',
    example: 'Ich habe nur eins bekommen.',
    category: 'Čísla',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_17',
    word: 'zwei',
    translation: 'dva',
    example: 'Ich brauche zwei Tickets, bitte.',
    category: 'Čísla',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_18',
    word: 'drei',
    translation: 'tři',
    example: 'Es sind nur noch drei Tage bis zum Urlaub.',
    category: 'Čísla',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Pokročilá slovní zásoba - cestování
  {
    id: 'de_19',
    word: 'der Bahnhof',
    translation: 'nádraží',
    example: 'Der Zug kommt in zehn Minuten am Bahnhof an.',
    category: 'Cestování',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_20',
    word: 'der Flughafen',
    translation: 'letiště',
    example: 'Wir müssen zwei Stunden vor dem Abflug am Flughafen sein.',
    category: 'Cestování',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_21',
    word: 'die Reise',
    translation: 'cesta',
    example: 'Die Reise nach Berlin war sehr angenehm.',
    category: 'Cestování',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_22',
    word: 'der Reisepass',
    translation: 'cestovní pas',
    example: 'Vergessen Sie nicht, Ihren Reisepass mitzunehmen.',
    category: 'Cestování',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Slovesa
  {
    id: 'de_23',
    word: 'sprechen',
    translation: 'mluvit',
    example: 'Ich kann gut Deutsch sprechen.',
    category: 'Slovesa',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_24',
    word: 'gehen',
    translation: 'jít',
    example: 'Ich gehe morgen ins Kino.',
    category: 'Slovesa',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_25',
    word: 'arbeiten',
    translation: 'pracovat',
    example: 'Er arbeitet in einer Bank.',
    category: 'Slovesa',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Pokročilá slovní zásoba - práce
  {
    id: 'de_26',
    word: 'die Bewerbung',
    translation: 'žádost o práci',
    example: 'Ich habe meine Bewerbung per E-Mail geschickt.',
    category: 'Práce',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_27',
    word: 'das Vorstellungsgespräch',
    translation: 'pracovní pohovor',
    example: 'Ich habe morgen ein Vorstellungsgespräch.',
    category: 'Práce',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_28',
    word: 'der Lebenslauf',
    translation: 'životopis',
    example: 'Ein guter Lebenslauf ist wichtig für die Jobsuche.',
    category: 'Práce',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_29',
    word: 'die Erfahrung',
    translation: 'zkušenost',
    example: 'Er hat viel Erfahrung in diesem Bereich.',
    category: 'Práce',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_30',
    word: 'das Gehalt',
    translation: 'plat',
    example: 'Das Gehalt wird monatlich überwiesen.',
    category: 'Práce',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Dimensions and Weight
  {
    id: 'de_31',
    word: 'schwer',
    translation: 'těžký',
    example: 'Dieses Paket ist zu schwer für mich.',
    category: 'Rozměry a váha',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_32',
    word: 'leicht',
    translation: 'lehký',
    example: 'Das ist ein leichtes Paket, du kannst es alleine tragen.',
    category: 'Rozměry a váha',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_33',
    word: 'breit',
    translation: 'široký',
    example: 'Der Karton ist zu breit für dieses Regal.',
    category: 'Rozměry a váha',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_34',
    word: 'schmal',
    translation: 'úzký',
    example: 'Der Durchgang ist sehr schmal, seien Sie vorsichtig.',
    category: 'Rozměry a váha',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_35',
    word: 'die Dimension',
    translation: 'rozměr',
    example: 'Wir müssen die Dimensionen jedes Pakets überprüfen.',
    category: 'Rozměry a váha',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_36',
    word: 'die Größe',
    translation: 'velikost',
    example: 'Die Größe des Paketes bestimmt den Preis.',
    category: 'Rozměry a váha',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Loading and Unloading
  {
    id: 'de_37',
    word: 'die Verladung',
    translation: 'nakládka',
    example: 'Die Verladung beginnt um 7 Uhr morgens.',
    category: 'Logistika',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_38',
    word: 'die Entladung',
    translation: 'vykládka',
    example: 'Nach der Entladung muss alles dokumentiert werden.',
    category: 'Logistika',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_39',
    word: 'beladen',
    translation: 'naložit',
    example: 'Wir müssen den LKW vor Mittag beladen.',
    category: 'Logistika',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_40',
    word: 'entladen',
    translation: 'vyložit',
    example: 'Bitte entladen Sie den Container vorsichtig.',
    category: 'Logistika',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Warehouse and Facilities
  {
    id: 'de_41',
    word: 'das Tor',
    translation: 'brána',
    example: 'Der LKW steht vor dem Tor Nummer 5.',
    category: 'Sklad',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_42',
    word: 'die Lagerhalle',
    translation: 'skladovací hala',
    example: 'Die neue Lagerhalle hat 5000 Quadratmeter.',
    category: 'Sklad',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_43',
    word: 'der Wareneingang',
    translation: 'příjem zboží',
    example: 'Alle Pakete müssen zuerst durch den Wareneingang.',
    category: 'Sklad',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_44',
    word: 'der Warenausgang',
    translation: 'výdej zboží',
    example: 'Der Warenausgang schließt um 16 Uhr.',
    category: 'Sklad',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  
  // Common logistics phrases
  {
    id: 'de_45',
    word: 'Das Paket ist beschädigt.',
    translation: 'Balík je poškozen.',
    example: 'Bitte notieren Sie: Das Paket ist beschädigt.',
    category: 'Fráze',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_46',
    word: 'Wohin soll ich das stellen?',
    translation: 'Kam to mám postavit?',
    example: 'Entschuldigung, wohin soll ich das stellen?',
    category: 'Fráze',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_47',
    word: 'Vorsicht, zerbrechlich!',
    translation: 'Pozor, křehké!',
    example: 'Vorsicht, zerbrechlich! Bitte vorsichtig behandeln.',
    category: 'Fráze',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_48',
    word: 'nach oben',
    translation: 'nahoru',
    example: 'Der Pfeil zeigt nach oben, so muss das Paket stehen.',
    category: 'Směry',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_49',
    word: 'nach unten',
    translation: 'dolů',
    example: 'Bitte legen Sie die schweren Pakete nach unten.',
    category: 'Směry',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'de_50',
    word: 'die Lieferschein',
    translation: 'dodací list',
    example: 'Bitte unterschreiben Sie hier auf dem Lieferschein.',
    category: 'Dokumenty',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  }
];

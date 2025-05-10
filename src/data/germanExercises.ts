
import { Exercise } from "../components/language/GrammarExercise";

export const grammarExercises: Exercise[] = [
  // Articles (der, die, das)
  {
    id: 1,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Tisch ist braun.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'der',
    explanation: 'Tisch (stůl) je podstatné jméno mužského rodu, proto používáme "der".',
    category: 'articles'
  },
  {
    id: 2,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Frau kocht.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'die',
    explanation: 'Frau (žena) je podstatné jméno ženského rodu, proto používáme "die".',
    category: 'articles'
  },
  {
    id: 3,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Kind spielt.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'das',
    explanation: 'Kind (dítě) je podstatné jméno středního rodu, proto používáme "das".',
    category: 'articles'
  },
  {
    id: 4,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Buch ist interessant.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'das',
    explanation: 'Buch (kniha) je podstatné jméno středního rodu, proto používáme "das".',
    category: 'articles'
  },
  {
    id: 17,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Hund bellt.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'der',
    explanation: 'Hund (pes) je podstatné jméno mužského rodu, proto používáme "der".',
    category: 'articles'
  },
  {
    id: 18,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Katze miaut.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'die',
    explanation: 'Katze (kočka) je podstatné jméno ženského rodu, proto používáme "die".',
    category: 'articles'
  },
  {
    id: 19,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Auto fährt schnell.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'das',
    explanation: 'Auto (auto) je podstatné jméno středního rodu, proto používáme "das".',
    category: 'articles'
  },
  {
    id: 20,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Sonne scheint.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'die',
    explanation: 'Sonne (slunce) je podstatné jméno ženského rodu, proto používáme "die".',
    category: 'articles'
  },

  // Present tense
  {
    id: 5,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "arbeiten" pro "ich": Ich _____ in einer Bank.',
    options: ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten'],
    correctAnswer: 'arbeite',
    explanation: 'Pro 1. osobu jednotného čísla (ich) je koncovka slovesa "-e".',
    category: 'present-tense'
  },
  {
    id: 6,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "spielen" pro "du": Du _____ Fußball.',
    options: ['spiele', 'spielst', 'spielt', 'spielen'],
    correctAnswer: 'spielst',
    explanation: 'Pro 2. osobu jednotného čísla (du) je koncovka slovesa "-st".',
    category: 'present-tense'
  },
  {
    id: 7,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "lesen" pro "er": Er _____ ein Buch.',
    options: ['lese', 'lest', 'liest', 'lesen'],
    correctAnswer: 'liest',
    explanation: 'Pro 3. osobu jednotného čísla (er) je koncovka slovesa "-t" a u nepravidelných sloves může dojít ke změně kmenové samohlásky.',
    category: 'present-tense'
  },
  {
    id: 21,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "kommen" pro "sie (množné)": Sie _____ aus Tschechien.',
    options: ['komme', 'kommst', 'kommt', 'kommen'],
    correctAnswer: 'kommen',
    explanation: 'Pro 3. osobu množného čísla (sie) je koncovka slovesa "-en".',
    category: 'present-tense'
  },
  {
    id: 22,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "fahren" pro "wir": Wir _____ nach Berlin.',
    options: ['fahre', 'fährst', 'fährt', 'fahren'],
    correctAnswer: 'fahren',
    explanation: 'Pro 1. osobu množného čísla (wir) je koncovka slovesa "-en".',
    category: 'present-tense'
  },
  {
    id: 23,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "sehen" pro "ihr": Ihr _____ einen Film.',
    options: ['sehe', 'siehst', 'sieht', 'seht'],
    correctAnswer: 'seht',
    explanation: 'Pro 2. osobu množného čísla (ihr) je koncovka slovesa "-t".',
    category: 'present-tense'
  },
  {
    id: 24,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "geben" pro "du": Du _____ mir das Buch.',
    options: ['gebe', 'gibst', 'gibt', 'geben'],
    correctAnswer: 'gibst',
    explanation: 'Pro 2. osobu jednotného čísla (du) je koncovka slovesa "-st" a dochází ke změně kmenové samohlásky "e" na "i".',
    category: 'present-tense'
  },

  // Cases
  {
    id: 8,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v dativu: Ich gebe _____ Mann einen Brief.',
    options: ['der', 'dem', 'den', 'des'],
    correctAnswer: 'dem',
    explanation: 'Ve 3. pádu (dativ) se člen "der" (mužský rod) mění na "dem".',
    category: 'cases'
  },
  {
    id: 9,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v akuzativu: Ich sehe _____ Mann.',
    options: ['der', 'dem', 'den', 'des'],
    correctAnswer: 'den',
    explanation: 'Ve 4. pádu (akuzativ) se člen "der" (mužský rod) mění na "den".',
    category: 'cases'
  },
  {
    id: 10,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v genitivu: Das ist das Auto _____ Mannes.',
    options: ['der', 'dem', 'den', 'des'],
    correctAnswer: 'des',
    explanation: 'Ve 2. pádu (genitiv) se člen "der" (mužský rod) mění na "des".',
    category: 'cases'
  },
  {
    id: 25,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v dativu: Ich helfe _____ Frau.',
    options: ['der', 'dem', 'die', 'des'],
    correctAnswer: 'der',
    explanation: 'Ve 3. pádu (dativ) se člen "die" (ženský rod) mění na "der".',
    category: 'cases'
  },
  {
    id: 26,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v akuzativu: Er besucht _____ Stadt.',
    options: ['der', 'dem', 'die', 'des'],
    correctAnswer: 'die',
    explanation: 'Ve 4. pádu (akuzativ) zůstává člen "die" (ženský rod) beze změny.',
    category: 'cases'
  },
  {
    id: 27,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v genitivu: Das ist das Spielzeug _____ Kindes.',
    options: ['der', 'dem', 'das', 'des'],
    correctAnswer: 'des',
    explanation: 'Ve 2. pádu (genitiv) se člen "das" (střední rod) mění na "des".',
    category: 'cases'
  },
  {
    id: 28,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v dativu: Wir folgen _____ Anweisungen.',
    options: ['die', 'der', 'den', 'des'],
    correctAnswer: 'den',
    explanation: 'Ve 3. pádu (dativ) množného čísla se člen "die" mění na "den".',
    category: 'cases'
  },

  // Modal verbs
  {
    id: 11,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "können": Ich _____ gut schwimmen.',
    options: ['kann', 'kannst', 'können', 'könnt'],
    correctAnswer: 'kann',
    explanation: 'Pro 1. osobu jednotného čísla (ich) je tvar modálního slovesa "können" - "kann".',
    category: 'modal-verbs'
  },
  {
    id: 12,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "müssen": Du _____ jetzt gehen.',
    options: ['muss', 'musst', 'müssen', 'müsst'],
    correctAnswer: 'musst',
    explanation: 'Pro 2. osobu jednotného čísla (du) je tvar modálního slovesa "müssen" - "musst".',
    category: 'modal-verbs'
  },
  {
    id: 13,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "wollen": Wir _____ nach Berlin fahren.',
    options: ['will', 'willst', 'wollen', 'wollt'],
    correctAnswer: 'wollen',
    explanation: 'Pro 1. osobu množného čísla (wir) je tvar modálního slovesa "wollen" - "wollen".',
    category: 'modal-verbs'
  },
  {
    id: 14,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "dürfen": Er _____ hier nicht rauchen.',
    options: ['darf', 'darfst', 'dürfen', 'dürft'],
    correctAnswer: 'darf',
    explanation: 'Pro 3. osobu jednotného čísla (er) je tvar modálního slovesa "dürfen" - "darf".',
    category: 'modal-verbs'
  },
  {
    id: 29,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "sollen": Ihr _____ früh aufstehen.',
    options: ['sollst', 'soll', 'sollt', 'sollen'],
    correctAnswer: 'sollt',
    explanation: 'Pro 2. osobu množného čísla (ihr) je tvar modálního slovesa "sollen" - "sollt".',
    category: 'modal-verbs'
  },
  {
    id: 30,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "mögen": Sie (jednotné) _____ Schokolade.',
    options: ['mag', 'magst', 'mögt', 'mögen'],
    correctAnswer: 'mag',
    explanation: 'Pro 3. osobu jednotného čísla (sie) je tvar modálního slovesa "mögen" - "mag".',
    category: 'modal-verbs'
  },
  {
    id: 31,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "können": Sie (množné) _____ gut kochen.',
    options: ['kannst', 'kann', 'könnt', 'können'],
    correctAnswer: 'können',
    explanation: 'Pro 3. osobu množného čísla (sie) je tvar modálního slovesa "können" - "können".',
    category: 'modal-verbs'
  },
  {
    id: 32,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "müssen": Ihr _____ pünktlich sein.',
    options: ['muss', 'musst', 'müsst', 'müssen'],
    correctAnswer: 'müsst',
    explanation: 'Pro 2. osobu množného čísla (ihr) je tvar modálního slovesa "müssen" - "müsst".',
    category: 'modal-verbs'
  },

  // Word order
  {
    id: 15,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "Ich _____ heute ins Kino."',
    options: ['gehe', 'heute gehe', 'gehe heute', 'heute ich gehe'],
    correctAnswer: 'gehe',
    explanation: 'V oznamovací větě je sloveso vždy na druhém místě.',
    category: 'word-order'
  },
  {
    id: 16,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "Heute _____ ich ins Kino."',
    options: ['gehe', 'ich gehe', 'gehe ich', 'ich heute gehe'],
    correctAnswer: 'gehe ich',
    explanation: 'Pokud věta začíná příslovečným určením, sloveso zůstává na druhém místě a podmět se posouvá na třetí místo.',
    category: 'word-order'
  },
  {
    id: 33,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "Wann _____ du nach Hause?"',
    options: ['gehst', 'du gehst', 'gehst du', 'du wann gehst'],
    correctAnswer: 'gehst du',
    explanation: 'V tázací větě začínající tázacím slovem je sloveso na druhém místě a podmět na třetím.',
    category: 'word-order'
  },
  {
    id: 34,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "_____ du mir helfen?"',
    options: ['Kannst', 'Du kannst', 'Kannst du', 'Du kannst mir'],
    correctAnswer: 'Kannst du',
    explanation: 'V tázací větě je modální sloveso na prvním místě a podmět na druhém.',
    category: 'word-order'
  },
  {
    id: 35,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "Am Wochenende _____ wir ins Restaurant."',
    options: ['gehen', 'wir gehen', 'gehen wir', 'wir am Wochenende gehen'],
    correctAnswer: 'gehen wir',
    explanation: 'Pokud věta začíná příslovečným určením času, sloveso zůstává na druhém místě a podmět se posouvá za sloveso.',
    category: 'word-order'
  },
  {
    id: 36,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov v souvětí: "Ich weiß, dass _____ ."',
    options: ['du kommst morgen', 'du morgen kommst', 'kommst du morgen', 'morgen du kommst'],
    correctAnswer: 'du morgen kommst',
    explanation: 'Ve vedlejší větě uvozené spojkou "dass" je sloveso až na konci věty.',
    category: 'word-order'
  }
];

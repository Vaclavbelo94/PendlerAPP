// Define the proper types to match the data structure
interface Example {
  id: string;
  german: string;
  czech: string;
}

interface GrammarRule {
  id: string;
  name: string;
  description: string;
  examples: Example[];
}

interface GrammarCategory {
  id: string;
  name: string;
  rules: GrammarRule[];
}

// Export types for use in other files
export type { Example, GrammarRule, GrammarCategory };

// Exercise type for interactive grammar exercises
export interface Exercise {
  id: number;
  type: 'multiplechoice' | 'fillblank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
}

// Define the grammar exercises data structure
export const grammarExercises: GrammarCategory[] = [
  {
    id: "nouns",
    name: "Podstatná jména",
    rules: [
      {
        id: "gender",
        name: "Rody podstatných jmen",
        description: "V němčině mají podstatná jména jeden ze tří rodů: mužský (der), ženský (die), nebo střední (das). Rod podstatného jména je třeba se naučit společně s novým slovem.",
        examples: [
          { id: "n1", german: "der Mann", czech: "muž" },
          { id: "n2", german: "die Frau", czech: "žena" },
          { id: "n3", german: "das Kind", czech: "dítě" },
          { id: "n4", german: "der Tisch", czech: "stůl" },
          { id: "n5", german: "die Tür", czech: "dveře" },
          { id: "n6", german: "das Fenster", czech: "okno" },
          { id: "n7", german: "der Computer", czech: "počítač" },
          { id: "n8", german: "die Lampe", czech: "lampa" }
        ]
      },
      {
        id: "plural",
        name: "Tvoření množného čísla",
        description: "Němčina má několik způsobů, jak tvořit množné číslo podstatných jmen. Přidání koncovky -e, -en, -er, nebo přehlasování samohlásky jsou nejčastější způsoby.",
        examples: [
          { id: "p1", german: "der Tisch → die Tische", czech: "stůl → stoly" },
          { id: "p2", german: "die Frau → die Frauen", czech: "žena → ženy" },
          { id: "p3", german: "das Kind → die Kinder", czech: "dítě → děti" },
          { id: "p4", german: "der Mann → die Männer", czech: "muž → muži" },
          { id: "p5", german: "das Haus → die Häuser", czech: "dům → domy" },
          { id: "p6", german: "die Blume → die Blumen", czech: "květina → květiny" }
        ]
      },
      {
        id: "compounds",
        name: "Složená podstatná jména",
        description: "V němčině se často vytvářejí složená podstatná jména spojením dvou nebo více slov. Rod složeného podstatného jména se řídí posledním slovem.",
        examples: [
          { id: "c1", german: "das Haus + die Tür = die Haustür", czech: "dům + dveře = domovní dveře" },
          { id: "c2", german: "der Hand + das Tuch = das Handtuch", czech: "ruka + látka = ručník" },
          { id: "c3", german: "das Buch + der Laden = der Buchladen", czech: "kniha + obchod = knihkupectví" },
          { id: "c4", german: "die Arbeit + der Platz = der Arbeitsplatz", czech: "práce + místo = pracoviště" },
          { id: "c5", german: "der Tisch + die Lampe = die Tischlampe", czech: "stůl + lampa = stolní lampa" }
        ]
      }
    ]
  },
  {
    id: "articles",
    name: "Členy",
    rules: [
      {
        id: "definite",
        name: "Určité členy",
        description: "Určité členy (der, die, das) se používají, když mluvíme o konkrétní, známé věci nebo osobě.",
        examples: [
          { id: "d1", german: "der Mann ist mein Vater", czech: "ten muž je můj otec" },
          { id: "d2", german: "die Frau arbeitet dort", czech: "ta žena tam pracuje" },
          { id: "d3", german: "das Auto ist neu", czech: "to auto je nové" },
          { id: "d4", german: "der Computer funktioniert nicht", czech: "ten počítač nefunguje" },
          { id: "d5", german: "die Sonne scheint", czech: "slunce svítí" }
        ]
      },
      {
        id: "indefinite",
        name: "Neurčité členy",
        description: "Neurčité členy (ein, eine, ein) se používají, když mluvíme o obecné, dosud neznámé věci nebo osobě.",
        examples: [
          { id: "i1", german: "ein Mann steht dort", czech: "nějaký muž tam stojí" },
          { id: "i2", german: "eine Frau singt", czech: "nějaká žena zpívá" },
          { id: "i3", german: "ein Kind spielt", czech: "nějaké dítě si hraje" },
          { id: "i4", german: "ich kaufe ein Buch", czech: "kupuji (nějakou) knihu" },
          { id: "i5", german: "wir brauchen eine Lösung", czech: "potřebujeme (nějaké) řešení" }
        ]
      },
      {
        id: "cases",
        name: "Členy v pádech",
        description: "Členy se v němčině ohýbají podle čtyř pádů: nominativ (1. pád), genitiv (2. pád), dativ (3. pád) a akuzativ (4. pád).",
        examples: [
          { id: "c1", german: "Nominativ: der Mann, die Frau, das Kind", czech: "Nominativ: ten muž, ta žena, to dítě" },
          { id: "c2", german: "Genitiv: des Mannes, der Frau, des Kindes", czech: "Genitiv: toho muže, té ženy, toho dítěte" },
          { id: "c3", german: "Dativ: dem Mann, der Frau, dem Kind", czech: "Dativ: tomu muži, té ženě, tomu dítěti" },
          { id: "c4", german: "Akkusativ: den Mann, die Frau, das Kind", czech: "Akuzativ: toho muže, tu ženu, to dítě" }
        ]
      }
    ]
  },
  {
    id: "verbs",
    name: "Slovesa",
    rules: [
      {
        id: "conjugation",
        name: "Časování sloves v přítomném čase",
        description: "V němčině se slovesa časují podle osoby a čísla. Základní koncovky pro přítomný čas jsou: -e, -st, -t, -en, -t, -en.",
        examples: [
          { id: "v1", german: "ich mache (dělám)", czech: "machen (dělat) - 1. os. j. č." },
          { id: "v2", german: "du machst (děláš)", czech: "machen (dělat) - 2. os. j. č." },
          { id: "v3", german: "er/sie/es macht (dělá)", czech: "machen (dělat) - 3. os. j. č." },
          { id: "v4", german: "wir machen (děláme)", czech: "machen (dělat) - 1. os. mn. č." },
          { id: "v5", german: "ihr macht (děláte)", czech: "machen (dělat) - 2. os. mn. č." },
          { id: "v6", german: "sie/Sie machen (dělají/děláte)", czech: "machen (dělat) - 3. os. mn. č. / vykání" }
        ]
      },
      {
        id: "irregular",
        name: "Nepravidelná slovesa",
        description: "Některá slovesa v němčině mají nepravidelné časování, často se mění kmenová samohláska.",
        examples: [
          { id: "ir1", german: "ich bin, du bist, er ist", czech: "sein (být) - jsem, jsi, je" },
          { id: "ir2", german: "ich habe, du hast, er hat", czech: "haben (mít) - mám, máš, má" },
          { id: "ir3", german: "ich gehe, du gehst, er geht", czech: "gehen (jít) - jdu, jdeš, jde" },
          { id: "ir4", german: "ich fahre, du fährst, er fährt", czech: "fahren (jet) - jedu, jedeš, jede" },
          { id: "ir5", german: "ich lese, du liest, er liest", czech: "lesen (číst) - čtu, čteš, čte" },
          { id: "ir6", german: "ich nehme, du nimmst, er nimmt", czech: "nehmen (brát) - beru, bereš, bere" }
        ]
      },
      {
        id: "modal",
        name: "Modální slovesa",
        description: "Modální slovesa vyjadřují možnost, nutnost, schopnost, atd. Patří mezi ně: können, müssen, dürfen, sollen, wollen, mögen.",
        examples: [
          { id: "m1", german: "ich kann Deutsch sprechen", czech: "umím/můžu mluvit německy" },
          { id: "m2", german: "du musst jetzt gehen", czech: "musíš teď jít" },
          { id: "m3", german: "er darf hier nicht rauchen", czech: "nesmí zde kouřit" },
          { id: "m4", german: "wir sollen früh aufstehen", czech: "máme brzy vstát" },
          { id: "m5", german: "ihr wollt nach Berlin fahren", czech: "chcete jet do Berlína" },
          { id: "m6", german: "sie mögen Schokolade", czech: "mají rádi čokoládu" }
        ]
      },
      {
        id: "perfect",
        name: "Perfekt (minulý čas složený)",
        description: "Perfekt se tvoří pomocí přítomného tvaru haben (nebo sein) a participia perfekta (Partizip II).",
        examples: [
          { id: "pf1", german: "ich habe gegessen", czech: "jedl/a jsem" },
          { id: "pf2", german: "du hast geschlafen", czech: "spal/a jsi" },
          { id: "pf3", german: "er hat gearbeitet", czech: "pracoval" },
          { id: "pf4", german: "wir sind gefahren", czech: "jeli jsme" },
          { id: "pf5", german: "ihr seid gekommen", czech: "přišli jste" },
          { id: "pf6", german: "sie haben gesprochen", czech: "mluvili" }
        ]
      }
    ]
  },
  {
    id: "sentences",
    name: "Větná skladba",
    rules: [
      {
        id: "word-order",
        name: "Slovosled v německé větě",
        description: "V německé oznamovací větě je sloveso vždy na druhém místě. Pokud věta začíná jiným větným členem než podmětem, podmět následuje až po slovese.",
        examples: [
          { id: "wo1", german: "Ich gehe nach Hause.", czech: "Jdu domů." },
          { id: "wo2", german: "Heute gehe ich nach Hause.", czech: "Dnes jdu domů." },
          { id: "wo3", german: "Nach Hause gehe ich heute.", czech: "Domů jdu dnes." },
          { id: "wo4", german: "Er kauft ein Buch.", czech: "Kupuje knihu." },
          { id: "wo5", german: "Das Buch kauft er.", czech: "Tu knihu kupuje on." }
        ]
      },
      {
        id: "questions",
        name: "Tázací věty",
        description: "V tázacích větách je sloveso na prvním místě, nebo na druhém místě po tázacím slově.",
        examples: [
          { id: "q1", german: "Gehst du nach Hause?", czech: "Jdeš domů?" },
          { id: "q2", german: "Kauft er ein Buch?", czech: "Kupuje knihu?" },
          { id: "q3", german: "Wo wohnst du?", czech: "Kde bydlíš?" },
          { id: "q4", german: "Warum kommst du so spät?", czech: "Proč přicházíš tak pozdě?" },
          { id: "q5", german: "Wann fährst du in den Urlaub?", czech: "Kdy jedeš na dovolenou?" }
        ]
      },
      {
        id: "negation",
        name: "Zápor ve větě",
        description: "V němčině se zápor tvoří pomocí 'nicht' (ne) nebo 'kein' (žádný). 'Nicht' stojí obvykle na konci věty nebo před příslovcem, 'kein' nahrazuje neurčitý člen.",
        examples: [
          { id: "n1", german: "Ich verstehe das nicht.", czech: "Nerozumím tomu." },
          { id: "n2", german: "Er kommt heute nicht.", czech: "Dnes nepřijde." },
          { id: "n3", german: "Ich habe kein Auto.", czech: "Nemám auto." },
          { id: "n4", german: "Wir haben keine Zeit.", czech: "Nemáme čas." },
          { id: "n5", german: "Das ist nicht gut.", czech: "To není dobré." }
        ]
      },
      {
        id: "subordinate",
        name: "Vedlejší věty",
        description: "Ve vedlejších větách jde časované sloveso na konec věty. Vedlejší věty začínají spojkami jako dass, weil, wenn, atd.",
        examples: [
          { id: "s1", german: "Ich weiß, dass er kommt.", czech: "Vím, že přijde." },
          { id: "s2", german: "Er bleibt zu Hause, weil er krank ist.", czech: "Zůstává doma, protože je nemocný." },
          { id: "s3", german: "Wenn ich Zeit habe, besuche ich dich.", czech: "Když budu mít čas, navštívím tě." },
          { id: "s4", german: "Sie fragt, ob wir kommen.", czech: "Ptá se, zda přijdeme." },
          { id: "s5", german: "Das ist das Buch, das ich lese.", czech: "To je ta kniha, kterou čtu." }
        ]
      }
    ]
  },
  {
    id: "cases",
    name: "Pády",
    rules: [
      {
        id: "nominative",
        name: "Nominativ (1. pád)",
        description: "Nominativ odpovídá na otázku 'kdo, co?' a používá se pro podmět věty.",
        examples: [
          { id: "nom1", german: "Der Mann liest.", czech: "Ten muž čte." },
          { id: "nom2", german: "Die Katze schläft.", czech: "Ta kočka spí." },
          { id: "nom3", german: "Das Kind spielt.", czech: "To dítě si hraje." },
          { id: "nom4", german: "Die Bücher sind neu.", czech: "Ty knihy jsou nové." }
        ]
      },
      {
        id: "accusative",
        name: "Akkusativ (4. pád)",
        description: "Akkusativ odpovídá na otázku 'koho, co?' a používá se pro přímý předmět.",
        examples: [
          { id: "acc1", german: "Ich sehe den Mann.", czech: "Vidím toho muže." },
          { id: "acc2", german: "Er kauft eine Katze.", czech: "Kupuje kočku." },
          { id: "acc3", german: "Wir besuchen das Kind.", czech: "Navštěvujeme to dítě." },
          { id: "acc4", german: "Sie liest die Bücher.", czech: "Čte ty knihy." }
        ]
      },
      {
        id: "dative",
        name: "Dativ (3. pád)",
        description: "Dativ odpovídá na otázku 'komu, čemu?' a používá se pro nepřímý předmět a po určitých předložkách.",
        examples: [
          { id: "dat1", german: "Ich gebe dem Mann ein Buch.", czech: "Dávám tomu muži knihu." },
          { id: "dat2", german: "Er hilft der Frau.", czech: "Pomáhá té ženě." },
          { id: "dat3", german: "Wir schenken dem Kind ein Spielzeug.", czech: "Darujeme tomu dítěti hračku." },
          { id: "dat4", german: "Mit den Freunden", czech: "S (těmi) přáteli" }
        ]
      },
      {
        id: "genitive",
        name: "Genitiv (2. pád)",
        description: "Genitiv odpovídá na otázku 'koho, čeho?' a vyjadřuje přivlastnění nebo příslušnost.",
        examples: [
          { id: "gen1", german: "Das Auto des Mannes", czech: "Auto toho muže" },
          { id: "gen2", german: "Die Tasche der Frau", czech: "Taška té ženy" },
          { id: "gen3", german: "Das Spielzeug des Kindes", czech: "Hračka toho dítěte" },
          { id: "gen4", german: "während des Tages", czech: "během dne" }
        ]
      }
    ]
  },
  {
    id: "adjectives",
    name: "Přídavná jména",
    rules: [
      {
        id: "endings",
        name: "Koncovky přídavných jmen",
        description: "Přídavná jména v němčině mají koncovky, které se mění podle rodu, pádu a členu, který jim předchází.",
        examples: [
          { id: "adj1", german: "der große Mann", czech: "ten velký muž" },
          { id: "adj2", german: "eine schöne Frau", czech: "nějaká krásná žena" },
          { id: "adj3", german: "das kleine Kind", czech: "to malé dítě" },
          { id: "adj4", german: "mit gutem Essen", czech: "s dobrým jídlem" }
        ]
      },
      {
        id: "comparison",
        name: "Stupňování přídavných jmen",
        description: "Přídavná jména se stupňují přidáním -er pro 2. stupeň (komparativ) a -(e)st pro 3. stupeň (superlativ).",
        examples: [
          { id: "comp1", german: "klein - kleiner - am kleinsten", czech: "malý - menší - nejmenší" },
          { id: "comp2", german: "groß - größer - am größten", czech: "velký - větší - největší" },
          { id: "comp3", german: "schön - schöner - am schönsten", czech: "krásný - krásnější - nejkrásnější" },
          { id: "comp4", german: "gut - besser - am besten", czech: "dobrý - lepší - nejlepší" },
          { id: "comp5", german: "viel - mehr - am meisten", czech: "mnoho - více - nejvíce" }
        ]
      }
    ]
  }
];

// Update grammar exercises array with exercise objects
export const grammarExercises2: Exercise[] = [
  // Articles (der, die, das)
  {
    id: 1,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Tisch ist braun.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'der',
    explanation: 'Tisch (stůl) je podstatné jméno mužského rodu, proto používáme "der".',
    category: 'členy'
  },
  {
    id: 2,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Frau kocht.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'die',
    explanation: 'Frau (žena) je podstatné jméno ženského rodu, proto používáme "die".',
    category: 'členy'
  },
  {
    id: 3,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Kind spielt.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'das',
    explanation: 'Kind (dítě) je podstatné jméno středního rodu, proto používáme "das".',
    category: 'členy'
  },
  {
    id: 4,
    type: 'multiplechoice',
    question: 'Vyberte správný člen: _____ Buch ist interessant.',
    options: ['der', 'die', 'das'],
    correctAnswer: 'das',
    explanation: 'Buch (kniha) je podstatné jméno středního rodu, proto používáme "das".',
    category: 'členy'
  },
  
  // Present tense
  {
    id: 5,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "arbeiten" pro "ich": Ich _____ in einer Bank.',
    options: ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten'],
    correctAnswer: 'arbeite',
    explanation: 'Pro 1. osobu jednotného čísla (ich) je koncovka slovesa "-e".',
    category: 'přítomný-čas'
  },
  {
    id: 6,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "spielen" pro "du": Du _____ Fußball.',
    options: ['spiele', 'spielst', 'spielt', 'spielen'],
    correctAnswer: 'spielst',
    explanation: 'Pro 2. osobu jednotného čísla (du) je koncovka slovesa "-st".',
    category: 'přítomný-čas'
  },
  {
    id: 7,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar slovesa "lesen" pro "er": Er _____ ein Buch.',
    options: ['lese', 'lest', 'liest', 'lesen'],
    correctAnswer: 'liest',
    explanation: 'Pro 3. osobu jednotného čísla (er) je koncovka slovesa "-t" a u nepravidelných sloves může dojít ke změně kmenové samohlásky.',
    category: 'přítomný-čas'
  },
  
  // Cases
  {
    id: 8,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v dativu: Ich gebe _____ Mann einen Brief.',
    options: ['der', 'dem', 'den', 'des'],
    correctAnswer: 'dem',
    explanation: 'Ve 3. pádu (dativ) se člen "der" (mužský rod) mění na "dem".',
    category: 'pády'
  },
  {
    id: 9,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v akuzativu: Ich sehe _____ Mann.',
    options: ['der', 'dem', 'den', 'des'],
    correctAnswer: 'den',
    explanation: 'Ve 4. pádu (akuzativ) se člen "der" (mužský rod) mění na "den".',
    category: 'pády'
  },
  {
    id: 10,
    type: 'multiplechoice',
    question: 'Vyberte správný tvar členu v genitivu: Das ist das Auto _____ Mannes.',
    options: ['der', 'dem', 'den', 'des'],
    correctAnswer: 'des',
    explanation: 'Ve 2. pádu (genitiv) se člen "der" (mužský rod) mění na "des".',
    category: 'pády'
  },
  
  // Modal verbs
  {
    id: 11,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "können": Ich _____ gut schwimmen.',
    options: ['kann', 'kannst', 'können', 'könnt'],
    correctAnswer: 'kann',
    explanation: 'Pro 1. osobu jednotného čísla (ich) je tvar modálního slovesa "können" - "kann".',
    category: 'modální-slovesa'
  },
  {
    id: 12,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "müssen": Du _____ jetzt gehen.',
    options: ['muss', 'musst', 'müssen', 'müsst'],
    correctAnswer: 'musst',
    explanation: 'Pro 2. osobu jednotného čísla (du) je tvar modálního slovesa "müssen" - "musst".',
    category: 'modální-slovesa'
  },
  {
    id: 13,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "wollen": Wir _____ nach Berlin fahren.',
    options: ['will', 'willst', 'wollen', 'wollt'],
    correctAnswer: 'wollen',
    explanation: 'Pro 1. osobu množného čísla (wir) je tvar modálního slovesa "wollen" - "wollen".',
    category: 'modální-slovesa'
  },
  {
    id: 14,
    type: 'multiplechoice',
    question: 'Doplňte správný tvar modálního slovesa "dürfen": Er _____ hier nicht rauchen.',
    options: ['darf', 'darfst', 'dürfen', 'dürft'],
    correctAnswer: 'darf',
    explanation: 'Pro 3. osobu jednotného čísla (er) je tvar modálního slovesa "dürfen" - "darf".',
    category: 'modální-slovesa'
  },
  
  // Word order
  {
    id: 15,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "Ich _____ heute ins Kino."',
    options: ['gehe', 'heute gehe', 'gehe heute', 'heute ich gehe'],
    correctAnswer: 'gehe',
    explanation: 'V oznamovací větě je sloveso vždy na druhém místě.',
    category: 'slovosled'
  },
  {
    id: 16,
    type: 'multiplechoice',
    question: 'Vyberte správné pořadí slov: "Heute _____ ich ins Kino."',
    options: ['gehe', 'ich gehe', 'gehe ich', 'ich heute gehe'],
    correctAnswer: 'gehe ich',
    explanation: 'Pokud věta začíná příslovečným určením, sloveso zůstává na druhém místě a podmět se posouvá na třetí místo.',
    category: 'slovosled'
  }
];

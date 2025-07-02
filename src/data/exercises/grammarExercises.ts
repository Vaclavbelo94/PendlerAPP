
import { Exercise } from "@/types/exercises";

export const grammarExercises: Exercise[] = [
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
    question: 'Vyberte správný člen: _____ Buch je interessant.',
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


export interface GermanPhrase {
  id: string;
  category: string;
  cz: string;
  pl: string;
  de: string;
  audioUrl: string;
}

export const phraseCategories = [
  "Work commands",
  "Tools", 
  "Shift & Time",
  "Safety",
  "Talk to Supervisor"
];

export const germanPhrases: GermanPhrase[] = [
  // Work commands
  {
    id: "001",
    category: "Work commands",
    cz: "Polož to sem",
    pl: "Połóż to tutaj", 
    de: "Leg das hier hin",
    audioUrl: "/audio/leg-das-hier-hin.mp3"
  },
  {
    id: "002",
    category: "Work commands",
    cz: "Vezmi si to",
    pl: "Weź to",
    de: "Nimm das",
    audioUrl: "/audio/nimm-das.mp3"
  },
  {
    id: "003",
    category: "Work commands",
    cz: "Rychleji prosím",
    pl: "Szybciej proszę",
    de: "Schneller bitte",
    audioUrl: "/audio/schneller-bitte.mp3"
  },
  {
    id: "004",
    category: "Work commands",
    cz: "Zastav se",
    pl: "Zatrzymaj się",
    de: "Stopp",
    audioUrl: "/audio/stopp.mp3"
  },

  // Tools
  {
    id: "005",
    category: "Tools",
    cz: "Scanner",
    pl: "Skaner",
    de: "Scanner",
    audioUrl: "/audio/scanner.mp3"
  },
  {
    id: "006",
    category: "Tools",
    cz: "Vozík",
    pl: "Wózek",
    de: "Wagen",
    audioUrl: "/audio/wagen.mp3"
  },
  {
    id: "007",
    category: "Tools",
    cz: "Páska",
    pl: "Taśma",
    de: "Klebeband",
    audioUrl: "/audio/klebeband.mp3"
  },
  {
    id: "008",
    category: "Tools",
    cz: "Krabice",
    pl: "Pudełko",
    de: "Karton",
    audioUrl: "/audio/karton.mp3"
  },

  // Shift & Time
  {
    id: "009",
    category: "Shift & Time",
    cz: "Ranní směna",
    pl: "Zmiana poranna",
    de: "Frühschicht",
    audioUrl: "/audio/fruehschicht.mp3"
  },
  {
    id: "010",
    category: "Shift & Time",
    cz: "Noční směna",
    pl: "Zmiana nocna",
    de: "Nachtschicht",
    audioUrl: "/audio/nachtschicht.mp3"
  },
  {
    id: "011",
    category: "Shift & Time",
    cz: "Přestávka",
    pl: "Przerwa",
    de: "Pause",
    audioUrl: "/audio/pause.mp3"
  },
  {
    id: "012",
    category: "Shift & Time",
    cz: "Konec směny",
    pl: "Koniec zmiany",
    de: "Schichtende",
    audioUrl: "/audio/schichtende.mp3"
  },

  // Safety
  {
    id: "013",
    category: "Safety",
    cz: "Pozor!",
    pl: "Uwaga!",
    de: "Achtung!",
    audioUrl: "/audio/achtung.mp3"
  },
  {
    id: "014",
    category: "Safety",
    cz: "Bezpečnostní obuv",
    pl: "Obuwie bezpieczeństwa",
    de: "Sicherheitsschuhe",
    audioUrl: "/audio/sicherheitsschuhe.mp3"
  },
  {
    id: "015",
    category: "Safety",
    cz: "Nouzový východ",
    pl: "Wyjście awaryjne",
    de: "Notausgang",
    audioUrl: "/audio/notausgang.mp3"
  },
  {
    id: "016",
    category: "Safety",
    cz: "První pomoc",
    pl: "Pierwsza pomoc",
    de: "Erste Hilfe",
    audioUrl: "/audio/erste-hilfe.mp3"
  },

  // Talk to Supervisor
  {
    id: "017",
    category: "Talk to Supervisor",
    cz: "Potřebuji pomoc",
    pl: "Potrzebuję pomocy",
    de: "Ich brauche Hilfe",
    audioUrl: "/audio/ich-brauche-hilfe.mp3"
  },
  {
    id: "018",
    category: "Talk to Supervisor",
    cz: "Mám problém",
    pl: "Mam problem",
    de: "Ich habe ein Problem",
    audioUrl: "/audio/ich-habe-ein-problem.mp3"
  },
  {
    id: "019",
    category: "Talk to Supervisor",
    cz: "Nerozumím",
    pl: "Nie rozumiem",
    de: "Ich verstehe nicht",
    audioUrl: "/audio/ich-verstehe-nicht.mp3"
  },
  {
    id: "020",
    category: "Talk to Supervisor",
    cz: "Můžete to zopakovat?",
    pl: "Czy możesz to powtórzyć?",
    de: "Können Sie das wiederholen?",
    audioUrl: "/audio/koennen-sie-das-wiederholen.mp3"
  }
];

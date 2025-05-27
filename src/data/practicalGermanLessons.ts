
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

export const practicalGermanLessons: LessonCategory[] = [
  {
    id: 'first-day',
    titleKey: 'nav.firstDay',
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
    titleKey: 'nav.dailyCommunication',
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
    id: 'problems-help',
    titleKey: 'nav.problemsHelp',
    icon: '🆘',
    phrases: [
      {
        id: 'ph1',
        german: 'Ich brauche Hilfe',
        czech: 'Potřebuji pomoct',
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
    titleKey: 'nav.endOfShift',
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

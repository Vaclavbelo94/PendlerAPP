
import { useLanguage } from '@/hooks/useLanguage';

export const supportedLanguages = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export const getCommonPhrases = () => {
  const { t } = useLanguage();
  
  return {
    cs: [
      'Dobrý den',
      'Děkuji',
      'Prosím',
      'Promiňte',
      'Nerozumím',
      'Kde je...?',
      'Kolik to stojí?',
      'Mluvíte česky?'
    ],
    pl: [
      'Dzień dobry',
      'Dziękuję',
      'Proszę',
      'Przepraszam',
      'Nie rozumiem',
      'Gdzie jest...?',
      'Ile to kosztuje?',
      'Czy mówi pan po polsku?'
    ],
    de: [
      'Guten Tag',
      'Danke',
      'Bitte',
      'Entschuldigung',
      'Ich verstehe nicht',
      'Wo ist...?',
      'Was kostet das?',
      'Sprechen Sie Deutsch?'
    ]
  };
};

export const getWorkplacePhrases = () => {
  const { t } = useLanguage();
  
  return {
    cs: [
      'Jsem nový zaměstnanec',
      'Kde je můj pracovní stůl?',
      'Kdy je přestávka?',
      'Potřebuji pomoc',
      'Moje směna končí'
    ],
    pl: [
      'Jestem nowym pracownikiem',
      'Gdzie jest moje biurko?',
      'Kiedy jest przerwa?',
      'Potrzebuję pomocy',
      'Moja zmiana kończy się'
    ],
    de: [
      'Ich bin ein neuer Mitarbeiter',
      'Wo ist mein Arbeitsplatz?',
      'Wann ist die Pause?',
      'Ich brauche Hilfe',
      'Meine Schicht ist zu Ende'
    ]
  };
};

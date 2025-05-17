
interface PhraseCategory {
  id: string;
  title: string;
  phrases: string[];
}

export const workPhrases: PhraseCategory[] = [
  {
    id: "workplace",
    title: "V práci",
    phrases: [
      "Dobrý den, jmenuji se...",
      "Kde najdu svého nadřízeného?",
      "Potřebuji mluvit s personálním oddělením.",
      "Kdy začíná/končí moje směna?",
      "Kde je kancelář/dílna/továrna?",
      "Potřebuji si vzít dovolenou.",
      "Jsem nemocný/á, nemohu dnes přijít.",
      "Mohu dostat zálohu na mzdu?",
      "Kdy je výplata?",
      "Jak dlouhá je pauza na oběd?",
      "Potřebuji přesčasové hodiny.",
      "Jaké jsou moje pracovní povinnosti?",
      "Mohu pracovat na dálku/z domova?",
      "Kde je nejbližší toaleta?",
      "Ztratil/a jsem přístupovou kartu."
    ],
  },
  {
    id: "transportation",
    title: "Doprava",
    phrases: [
      "Kolik stojí jízdenka do...?",
      "Kdy jede další vlak/autobus?",
      "Potřebuji týdenní/měsíční jízdenku.",
      "Kde je nejbližší zastávka?",
      "Je tento vlak zpožděný?",
      "Musím přestupovat?",
      "Je tam parkoviště?",
      "Kolik stojí parkování?",
      "Jak dlouho trvá cesta do...?",
      "Je na silnici zácpa?",
      "Můžete mi zavolat taxi?",
      "Jaká je nejrychlejší cesta do...?",
      "Je toto správný směr na...?",
      "Kolik stojí pronájem auta?",
      "Kde si mohu koupit jízdenku?"
    ],
  },
  {
    id: "accommodation",
    title: "Ubytování",
    phrases: [
      "Hledám levné ubytování.",
      "Kolik stojí nájem?",
      "Jsou v ceně zahrnuty poplatky?",
      "Jak dlouhá je výpovědní lhůta?",
      "Je možné prodloužit smlouvu?",
      "Něco v bytě nefunguje.",
      "Potřebuji zavolat opraváře.",
      "Kde najdu nejbližší obchod?",
      "Je v okolí lékárna/nemocnice?",
      "Jak funguje třídění odpadu?",
      "Je v bytě WiFi připojení?",
      "Mohu mít domácího mazlíčka?",
      "Kdy se platí kauce?",
      "Kde je hlavní uzávěr vody/plynu?",
      "Potřebuji vyměnit klíče."
    ],
  },
  {
    id: "official",
    title: "Úřady a dokumenty",
    phrases: [
      "Potřebuji vyřídit pracovní povolení.",
      "Kde se registrují daně?",
      "Jaké dokumenty potřebuji pro přihlášení k pobytu?",
      "Potřebuji vyplnit formulář pro...",
      "Kdy je otevřeno na úřadě?",
      "Potřebuji tlumočníka.",
      "Mohu požádat o kopii dokumentu?",
      "Potřebuji informace o zdravotním pojištění.",
      "Jak funguje daňové přiznání v této zemi?",
      "Kde najdu informace o sociálním pojištění?",
      "Jaké jsou podmínky pro získání občanství?",
      "Potřebuji prodloužit platnost víza.",
      "Kde si mohu ověřit dokument?",
      "Jaké jsou úřední hodiny?",
      "Potřebuji právní poradenství."
    ],
  },
  {
    id: "emergency",
    title: "Nouzové situace",
    phrases: [
      "Potřebuji pomoc.",
      "Zavolejte sanitku/policii/hasiče.",
      "Měl/a jsem nehodu.",
      "Potřebuji lékaře.",
      "Kde je nejbližší nemocnice?",
      "Ztratil/a jsem doklady.",
      "Ukradli mi peněženku/telefon.",
      "Auto má poruchu.",
      "Nevím, kde se nacházím.",
      "Jak se dostanu zpět do...",
      "Potřebuji lék na...",
      "Je mi špatně/nevolno.",
      "Potřebuji pomoc s překladem.",
      "Mám alergii na...",
      "Kde je nejbližší policejní stanice?"
    ],
  },
  {
    id: "shopping",
    title: "Nakupování",
    phrases: [
      "Kolik to stojí?",
      "Přijímáte platební karty?",
      "Máte slevy?",
      "Hledám...",
      "Můžete mi pomoci najít...?",
      "Kde najdu oddělení s...?",
      "Mohu si to vyzkoušet?",
      "Máte to ve větší/menší velikosti?",
      "Máte to v jiné barvě?",
      "Je možné toto zboží vrátit?",
      "Jaká je záruční doba?",
      "Potřebuji účtenku.",
      "Je toto zboží ve slevě?",
      "Kde je zkušební kabinka?",
      "Kdy zavíráte?"
    ],
  },
  {
    id: "food",
    title: "Jídlo a restaurace",
    phrases: [
      "Máte menu v angličtině/češtině?",
      "Jsem vegetarián/vegan.",
      "Mám alergii na...",
      "Co doporučujete?",
      "Mohu dostat sklenici vody?",
      "Můžeme platit zvlášť?",
      "Přijímáte spropitné?",
      "Je toto jídlo pálivé?",
      "Mohu si objednat?",
      "Účet, prosím.",
      "Máte bezlepkové/bezlaktózové jídlo?",
      "Jaká je dnešní specialita?",
      "Je v tomto jídle maso?",
      "Můžete mi to zabalit s sebou?",
      "Máte rezervaci na jméno...?"
    ],
  },
];

export const languagePairs = [
  { code: "cs", name: "Čeština" },
  { code: "de", name: "Němčina" },
  { code: "en", name: "Angličtina" },
  { code: "sk", name: "Slovenština" },
  { code: "pl", name: "Polština" },
]

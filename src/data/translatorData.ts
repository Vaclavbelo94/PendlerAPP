
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
    ],
  },
];

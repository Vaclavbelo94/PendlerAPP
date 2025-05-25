
import { GrammarCategory } from "@/types/exercises";

export const basicGrammarRules: GrammarCategory[] = [
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
  }
];


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhraseCategory {
  title: string;
  phrases: {
    german: string;
    czech: string;
  }[];
}

const phraseCategories: PhraseCategory[] = [
  {
    title: "Pozdravy a představení",
    phrases: [
      { german: "Guten Morgen!", czech: "Dobré ráno!" },
      { german: "Guten Tag!", czech: "Dobrý den!" },
      { german: "Guten Abend!", czech: "Dobrý večer!" },
      { german: "Ich heiße...", czech: "Jmenuji se..." },
      { german: "Wie heißt du?", czech: "Jak se jmenuješ?" },
    ]
  },
  {
    title: "V restauraci",
    phrases: [
      { german: "Ich möchte bestellen.", czech: "Chtěl/a bych si objednat." },
      { german: "Die Speisekarte, bitte.", czech: "Jídelní lístek, prosím." },
      { german: "Ein Glas Wasser, bitte.", czech: "Sklenici vody, prosím." },
      { german: "Zahlen, bitte!", czech: "Platit, prosím!" },
      { german: "Das schmeckt sehr gut.", czech: "To je velmi chutné." },
    ]
  },
  {
    title: "V práci",
    phrases: [
      { german: "Können Sie mir bitte helfen?", czech: "Můžete mi prosím pomoci?" },
      { german: "Ich verstehe nicht.", czech: "Nerozumím." },
      { german: "Können Sie das wiederholen?", czech: "Můžete to zopakovat?" },
    ]
  },
  {
    title: "Na nákupech",
    phrases: [
      { german: "Wie viel kostet das?", czech: "Kolik to stojí?" },
      { german: "Ich suche...", czech: "Hledám..." },
      { german: "Haben Sie das in einer anderen Größe?", czech: "Máte to v jiné velikosti?" },
      { german: "Ich nehme das.", czech: "Vezmu si to." },
    ]
  }
];

const PhrasesTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Užitečné fráze</CardTitle>
        <CardDescription>
          Fráze pro běžné životní situace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phraseCategories.map((category, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-medium">{category.title}</h3>
              <ScrollArea className="w-full">
                <div className="min-w-[280px]">
                  <Table className="w-full">
                    <TableBody>
                      {category.phrases.map((phrase, phraseIndex) => (
                        <TableRow key={phraseIndex}>
                          <TableCell className="font-medium">{phrase.german}</TableCell>
                          <TableCell>{phrase.czech}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhrasesTab;

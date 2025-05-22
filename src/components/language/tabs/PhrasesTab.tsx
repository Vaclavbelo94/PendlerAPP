
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Volume2, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
      { german: "Auf Wiedersehen!", czech: "Na shledanou!" },
      { german: "Tschüss!", czech: "Ahoj! (při loučení)" },
      { german: "Hallo!", czech: "Ahoj!" },
      { german: "Ich heiße...", czech: "Jmenuji se..." },
      { german: "Wie heißt du?", czech: "Jak se jmenuješ?" },
      { german: "Freut mich dich kennenzulernen.", czech: "Těší mě, že tě poznávám." },
      { german: "Woher kommst du?", czech: "Odkud jsi?" },
      { german: "Ich komme aus Tschechien.", czech: "Jsem z České republiky." },
      { german: "Wie geht es dir?", czech: "Jak se máš?" },
      { german: "Mir geht es gut, danke.", czech: "Mám se dobře, děkuji." },
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
      { german: "Haben Sie vegetarische Gerichte?", czech: "Máte vegetariánská jídla?" },
      { german: "Ist dieses Gericht scharf?", czech: "Je toto jídlo pálivé?" },
      { german: "Wie viel kostet das?", czech: "Kolik to stojí?" },
      { german: "Können Sie mir eine Empfehlung geben?", czech: "Můžete mi něco doporučit?" },
      { german: "Ich bin allergisch gegen...", czech: "Jsem alergický/á na..." },
      { german: "Gibt es WLAN hier?", czech: "Je tu Wi-Fi?" },
      { german: "Das Passwort für WLAN, bitte.", czech: "Heslo na Wi-Fi, prosím." },
    ]
  },
  {
    title: "V práci",
    phrases: [
      { german: "Können Sie mir bitte helfen?", czech: "Můžete mi prosím pomoci?" },
      { german: "Ich verstehe nicht.", czech: "Nerozumím." },
      { german: "Können Sie das wiederholen?", czech: "Můžete to zopakovat?" },
      { german: "Wer ist der Verantwortliche?", czech: "Kdo je odpovědná osoba?" },
      { german: "Wann ist die Besprechung?", czech: "Kdy je porada?" },
      { german: "Ich brauche mehr Zeit.", czech: "Potřebuji více času." },
      { german: "Das ist fertig.", czech: "To je hotové." },
      { german: "Ich habe eine Frage.", czech: "Mám otázku." },
      { german: "Kann ich heute früher gehen?", czech: "Můžu dnes odejít dříve?" },
      { german: "Wann haben wir Pause?", czech: "Kdy máme přestávku?" },
      { german: "Ich habe einen Termin beim Arzt.", czech: "Mám schůzku u lékaře." },
      { german: "Das ist dringend.", czech: "To je naléhavé." },
      { german: "Ich bin krank.", czech: "Jsem nemocný/á." },
      { german: "Ich kann heute nicht kommen.", czech: "Dnes nemůžu přijít." },
    ]
  },
  {
    title: "Na nákupech",
    phrases: [
      { german: "Wie viel kostet das?", czech: "Kolik to stojí?" },
      { german: "Ich suche...", czech: "Hledám..." },
      { german: "Haben Sie das in einer anderen Größe?", czech: "Máte to v jiné velikosti?" },
      { german: "Ich nehme das.", czech: "Vezmu si to." },
      { german: "Wo ist die Umkleidekabine?", czech: "Kde jsou zkušební kabinky?" },
      { german: "Akzeptieren Sie Kreditkarten?", czech: "Přijímáte kreditní karty?" },
      { german: "Kann ich das umtauschen?", czech: "Mohu to vyměnit?" },
      { german: "Gibt es Rabatte?", czech: "Jsou nějaké slevy?" },
      { german: "Das ist zu teuer.", czech: "To je příliš drahé." },
      { german: "Haben Sie etwas günstigeres?", czech: "Máte něco levnějšího?" },
      { german: "Ich möchte nur schauen.", czech: "Chci se jen podívat." },
      { german: "Wo ist die Kasse?", czech: "Kde je pokladna?" },
    ]
  },
  {
    title: "U lékaře",
    phrases: [
      { german: "Ich habe Schmerzen.", czech: "Mám bolesti." },
      { german: "Wo tut es weh?", czech: "Kde to bolí?" },
      { german: "Ich habe Fieber.", czech: "Mám horečku." },
      { german: "Ich habe Kopfschmerzen.", czech: "Bolí mě hlava." },
      { german: "Ich brauche ein Rezept.", czech: "Potřebuji recept." },
      { german: "Ich bin allergisch gegen dieses Medikament.", czech: "Jsem alergický/á na tento lék." },
      { german: "Wie oft sollte ich die Tabletten nehmen?", czech: "Jak často bych měl/a brát ty tablety?" },
      { german: "Brauche ich eine Krankschreibung?", czech: "Potřebuji neschopenku?" },
      { german: "Wann soll ich wiederkommen?", czech: "Kdy mám přijít znovu?" },
    ]
  },
  {
    title: "Cestování",
    phrases: [
      { german: "Wo ist der Bahnhof?", czech: "Kde je nádraží?" },
      { german: "Eine Fahrkarte nach... bitte.", czech: "Jízdenku do... prosím." },
      { german: "Wann fährt der nächste Zug?", czech: "Kdy jede další vlak?" },
      { german: "Ist dieser Platz frei?", czech: "Je toto místo volné?" },
      { german: "Ich habe mich verirrt.", czech: "Ztratil/a jsem se." },
      { german: "Können Sie mir den Weg zeigen?", czech: "Můžete mi ukázat cestu?" },
      { german: "Wie komme ich zum Flughafen?", czech: "Jak se dostanu na letiště?" },
      { german: "Wo kann ich ein Taxi finden?", czech: "Kde najdu taxi?" },
      { german: "Wie weit ist es?", czech: "Jak daleko to je?" },
      { german: "Entschuldigung, ist hier in der Nähe eine Toilette?", czech: "Promiňte, je tu někde poblíž toaleta?" },
    ]
  }
];

const PhrasesTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Pozdravy a představení");
  
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Váš prohlížeč nepodporuje převod textu na řeč"
      });
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Zkopírováno",
      description: "Text byl zkopírován do schránky"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Užitečné fráze</CardTitle>
        <CardDescription>
          Fráze pro běžné životní situace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={phraseCategories[0].title}>
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-auto flex-wrap mb-4 w-full space-x-1 space-y-1">
              {phraseCategories.map((category, index) => (
                <TabsTrigger 
                  key={index} 
                  value={category.title}
                  onClick={() => setSelectedCategory(category.title)}
                  className="mb-1"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          
          {phraseCategories.map((category) => (
            <div 
              key={category.title} 
              className={category.title === selectedCategory ? 'block' : 'hidden'}
            >
              <div className="bg-muted/30 rounded-lg">
                <Table className="w-full">
                  <TableBody>
                    {category.phrases.map((phrase, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/50">
                        <TableCell className="align-top md:w-1/2">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{phrase.german}</span>
                            <div className="flex space-x-1 ml-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleTextToSpeech(phrase.german)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleCopyText(phrase.german)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-top md:w-1/2">
                          <div className="flex justify-between items-start">
                            <span>{phrase.czech}</span>
                            <div className="flex space-x-1 ml-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleCopyText(phrase.czech)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </Tabs>

        <div className="bg-muted/20 p-3 rounded-lg mt-4">
          <h3 className="text-sm font-medium mb-2">Tip pro výslovnost:</h3>
          <p className="text-sm text-muted-foreground">
            Pro poslechnutí správné výslovnosti klikněte na ikonu reproduktoru vedle německé fráze.
            Pro přehlednější zobrazení na mobilních zařízeních otáčejte telefon do landscape režimu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhrasesTab;

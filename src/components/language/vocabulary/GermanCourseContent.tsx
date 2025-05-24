
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVocabularyContext } from './VocabularyManager';
import VocabularyReviewCard from '../VocabularyReviewCard';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useVocabularyReviewSession } from '@/hooks/useVocabularyReviewSession';
import { Volume2, CheckCircle, ArrowRight, PlayCircle, AlertCircle } from "lucide-react";

// Helper function to play audio for German pronunciation
const pronounceWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE';
    speechSynthesis.speak(utterance);
  }
};

// Vocabulary card component
const VocabularyCard = ({ german, czech, example, category }: { 
  german: string, 
  czech: string, 
  example?: string,
  category?: string 
}) => {
  const [showExample, setShowExample] = useState(false);
  
  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {german} 
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 p-0 h-8 w-8" 
              onClick={() => pronounceWord(german)}
            >
              <Volume2 className="h-4 w-4" />
              <span className="sr-only">Přečíst</span>
            </Button>
          </CardTitle>
          {category && (
            <Badge variant="outline">{category}</Badge>
          )}
        </div>
        <CardDescription>{czech}</CardDescription>
      </CardHeader>
      {example && (
        <CardContent className="pt-0">
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm" 
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? 'Skrýt příklad' : 'Zobrazit příklad'}
          </Button>
          {showExample && (
            <div className="mt-2 text-sm italic border-l-2 border-primary/20 pl-2">
              {example}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Lesson section component
const LessonSection = ({ title, description, items }: { 
  title: string, 
  description?: string, 
  items: {
    german: string,
    czech: string,
    example?: string,
    category?: string
  }[]
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-muted-foreground mb-3 text-sm">{description}</p>}
      <div className="space-y-3">
        {items.map((item, index) => (
          <VocabularyCard 
            key={index} 
            german={item.german} 
            czech={item.czech} 
            example={item.example}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
};

// Záložka: Základy
export const WarehouseBasicsTab = () => {
  const greetings = [
    { german: "Guten Morgen", czech: "Dobré ráno", example: "Guten Morgen, wie geht es Ihnen?" },
    { german: "Guten Tag", czech: "Dobrý den", example: "Guten Tag, Herr Schmidt." },
    { german: "Auf Wiedersehen", czech: "Na shledanou", example: "Ich muss jetzt gehen. Auf Wiedersehen!" },
    { german: "Danke schön", czech: "Děkuji pěkně", example: "Danke schön für Ihre Hilfe." },
    { german: "Bitte schön", czech: "Prosím pěkně", example: "Können Sie mir bitte schön helfen?" },
    { german: "Entschuldigung", czech: "Promiňte", example: "Entschuldigung, wo ist die Toilette?" },
  ];

  const basicPhrases = [
    { german: "Ich verstehe nicht", czech: "Nerozumím", example: "Entschuldigung, ich verstehe nicht. Können Sie das wiederholen?" },
    { german: "Sprechen Sie Englisch?", czech: "Mluvíte anglicky?", example: "Sprechen Sie Englisch? Ich spreche kein Deutsch." },
    { german: "Wo ist die Toilette?", czech: "Kde jsou toalety?", example: "Entschuldigung, wo ist die Toilette?" },
    { german: "Ich brauche Hilfe", czech: "Potřebuji pomoct", example: "Ich brauche Hilfe bei dieser Aufgabe." },
    { german: "Wie spät ist es?", czech: "Kolik je hodin?", example: "Entschuldigung, wie spät ist es?" },
    { german: "Wann ist Pause?", czech: "Kdy je přestávka?", example: "Wann haben wir heute Pause?" },
    { german: "Wo ist der Ausgang?", czech: "Kde je východ?", example: "Können Sie mir zeigen, wo der Ausgang ist?" },
  ];

  const introductions = [
    { german: "Ich heiße...", czech: "Jmenuji se...", example: "Hallo, ich heiße Martin." },
    { german: "Ich komme aus Tschechien", czech: "Pocházím z Česka", example: "Ich komme aus Tschechien und arbeite jetzt in Deutschland." },
    { german: "Ich arbeite im Paketzentrum", czech: "Pracuji v balíkovém centru", example: "Seit einem Monat arbeite ich im Paketzentrum." },
    { german: "Das ist mein erster Tag", czech: "To je můj první den", example: "Das ist mein erster Tag hier. Können Sie mir helfen?" },
    { german: "Ich bin neu hier", czech: "Jsem tu nový", example: "Ich bin neu hier und kenne mich noch nicht aus." },
  ];

  const workBasics = [
    { german: "die Schicht", czech: "směna", example: "Meine Schicht beginnt um 6 Uhr morgens.", category: "Práce" },
    { german: "der Arbeitsplatz", czech: "pracovní místo", example: "Mein Arbeitsplatz ist beim Förderband.", category: "Práce" },
    { german: "die Pause", czech: "přestávka", example: "Die Pause dauert 30 Minuten.", category: "Práce" },
    { german: "der Vorgesetzter", czech: "nadřízený", example: "Mein Vorgesetzter heißt Herr Müller.", category: "Práce" },
    { german: "der Kollege", czech: "kolega", example: "Das ist mein neuer Kollege aus Prag.", category: "Práce" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Základy němčiny</CardTitle>
          <CardDescription>
            Naučte se základní fráze a pozdravy, které vám pomohou při každodenní komunikaci v práci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonSection title="Pozdravy" items={greetings} />
          <LessonSection title="Základní fráze" items={basicPhrases} />
          <LessonSection title="Představení se" items={introductions} />
          <LessonSection title="Základy práce" items={workBasics} />
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">23 slovíček</div>
          <Button className="flex gap-1" size="sm">
            Procvičit <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Záložka: Balení a třídění
export const PackagingTermsTab = () => {
  const packagingTerms = [
    { german: "das Paket", czech: "Balík", example: "Das Paket wiegt 5 Kilogramm.", category: "Předměty" },
    { german: "der Karton", czech: "Krabice", example: "Stellen Sie den Karton auf das Förderband.", category: "Předměty" },
    { german: "die Lieferung", czech: "Dodávka", example: "Die Lieferung muss heute noch raus.", category: "Logistika" },
    { german: "die Adresse", czech: "Adresa", example: "Bitte überprüfen Sie die Adresse auf dem Paket.", category: "Informace" },
    { german: "die Sendung", czech: "Zásilka", example: "Diese Sendung geht nach Berlin.", category: "Logistika" },
    { german: "das Etikett", czech: "Štítek", example: "Das Etikett ist beschädigt.", category: "Informace" },
    { german: "der Briefumschlag", czech: "Obálka", example: "Der Briefumschlag ist zerrissen.", category: "Předměty" },
    { german: "die Postleitzahl", czech: "PSČ", example: "Die Postleitzahl für München ist 80331.", category: "Informace" },
  ];

  const sortingTerms = [
    { german: "sortieren", czech: "třídit", example: "Bitte sortieren Sie die Pakete nach Postleitzahlen.", category: "Činnosti" },
    { german: "einpacken", czech: "zabalit", example: "Sie müssen die Ware sorgfältig einpacken.", category: "Činnosti" },
    { german: "auspacken", czech: "vybalit", example: "Bitte packen Sie die beschädigte Ware aus.", category: "Činnosti" },
    { german: "das Förderband", czech: "dopravní pás", example: "Legen Sie das Paket auf das Förderband.", category: "Vybavení" },
    { german: "wiegen", czech: "vážit", example: "Bitte wiegen Sie dieses Paket.", category: "Činnosti" },
    { german: "messen", czech: "měřit", example: "Wir müssen die Größe messen.", category: "Činnosti" },
    { german: "scannen", czech: "skenovat", example: "Scannen Sie den Barcode.", category: "Činnosti" },
    { german: "verladen", czech: "naložit", example: "Die Pakete werden morgen verladen.", category: "Činnosti" },
  ];

  const warehouseTerms = [
    { german: "das Lager", czech: "sklad", example: "Die Pakete werden im Lager sortiert.", category: "Místa" },
    { german: "die Palette", czech: "paleta", example: "Stellen Sie die schweren Pakete auf die Palette.", category: "Vybavení" },
    { german: "der Gabelstapler", czech: "vysokozdvižný vozík", example: "Der Gabelstapler transportiert die schweren Paletten.", category: "Vybavení" },
    { german: "die Laderampe", czech: "nakládací rampa", example: "Der LKW parkt an der Laderampe.", category: "Místa" },
    { german: "der Container", czech: "kontejner", example: "Der Container ist fast voll.", category: "Vybavení" },
    { german: "das Regal", czech: "regál", example: "Die Pakete stehen im Regal.", category: "Vybavení" },
    { german: "der Wareneingang", czech: "příjem zboží", example: "Alle neuen Pakete gehen durch den Wareneingang.", category: "Místa" },
    { german: "der Warenausgang", czech: "expedice", example: "Der Warenausgang ist um 16 Uhr geschlossen.", category: "Místa" },
  ];

  const qualityTerms = [
    { german: "beschädigt", czech: "poškozený", example: "Dieses Paket ist beschädigt.", category: "Stav" },
    { german: "zerbrochen", czech: "rozbitý", example: "Vorsicht, der Inhalt ist zerbrochen.", category: "Stav" },
    { german: "nass", czech: "mokrý", example: "Das Paket ist nass geworden.", category: "Stav" },
    { german: "zerbrechlich", czech: "křehký", example: "Vorsicht! Das ist zerbrechlich.", category: "Stav" },
    { german: "eilig", czech: "spěšný", example: "Diese Sendung ist eilig.", category: "Priorita" },
    { german: "Express", czech: "express", example: "Das ist eine Express-Sendung.", category: "Priorita" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balíkové centrum - rozšířená slovní zásoba</CardTitle>
          <CardDescription>
            Pokročilejší pojmy pro efektivní práci v logistickém centru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonSection 
            title="Základní pojmy balíkového centra" 
            description="Nejpoužívanější slova pro práci s balíky"
            items={packagingTerms} 
          />
          <LessonSection 
            title="Třídění a manipulace" 
            description="Slovíčka spojená s tříděním a manipulací s balíky"
            items={sortingTerms} 
          />
          <LessonSection 
            title="Vybavení skladu" 
            description="Pojmy pro orientaci ve skladu a práci s vybavením"
            items={warehouseTerms} 
          />
          <LessonSection 
            title="Kvalita a stav zboží" 
            description="Popis stavu balíků a jejich priority"
            items={qualityTerms} 
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">30 slovíček</div>
          <Button className="flex gap-1" size="sm">
            Procvičit <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Záložka: Čísla
export const NumbersTab = () => {
  const basicNumbers = [
    { german: "eins", czech: "jedna", example: "Ich brauche nur eins." },
    { german: "zwei", czech: "dva", example: "Ich sehe zwei Pakete." },
    { german: "drei", czech: "tři", example: "Drei Pakete sind beschädigt." },
    { german: "vier", czech: "čtyři", example: "Vier Sendungen für Berlin." },
    { german: "fünf", czech: "pět", example: "Fünf Minuten Pause." },
    { german: "sechs", czech: "šest", example: "Sechs Paletten sind bereit." },
    { german: "sieben", czech: "sedm", example: "Sieben Uhr ist Schichtbeginn." },
    { german: "acht", czech: "osm", example: "Acht Stunden Arbeitszeit." },
    { german: "neun", czech: "devět", example: "Neun Kilogramm ist das Limit." },
    { german: "zehn", czech: "deset", example: "Zehn Pakete pro Minute." },
  ];

  const tenToHundred = [
    { german: "elf", czech: "jedenáct", example: "Elf Uhr ist Mittagspause." },
    { german: "zwölf", czech: "dvanáct", example: "Zwölf Sendungen sind angekommen." },
    { german: "zwanzig", czech: "dvacet", example: "Zwanzig Minuten bis Feierabend." },
    { german: "dreißig", czech: "třicet", example: "Dreißig Pakete wurden bereits sortiert." },
    { german: "vierzig", czech: "čtyřicet", example: "Vierzig Grad ist zu heiß zum Arbeiten." },
    { german: "fünfzig", czech: "padesát", example: "Fünfzig Kilogramm ist das Maximum." },
    { german: "sechzig", czech: "šedesát", example: "Sechzig Sekunden pro Paket." },
    { german: "siebzig", czech: "sedmdesát", example: "Siebzig Prozent sind schon fertig." },
    { german: "achtzig", czech: "osmdesát", example: "Achtzig Sendungen heute." },
    { german: "neunzig", czech: "devadesát", example: "Neunzig Minuten bis Schichtende." },
    { german: "hundert", czech: "sto", example: "Hundert Pakete müssen wir noch sortieren." },
    { german: "tausend", czech: "tisíc", example: "Tausend Pakete täglich." },
  ];

  const timeExpressions = [
    { german: "eine Stunde", czech: "hodina", example: "Die Schicht dauert noch eine Stunde." },
    { german: "eine Minute", czech: "minuta", example: "Bitte warten Sie eine Minute." },
    { german: "eine Sekunde", czech: "sekunda", example: "Das dauert nur eine Sekunde." },
    { german: "eine Woche", czech: "týden", example: "Ich arbeite hier seit einer Woche." },
    { german: "ein Monat", czech: "měsíc", example: "Nächsten Monat bekomme ich mehr Stunden." },
    { german: "heute", czech: "dnes", example: "Heute haben wir viel zu tun." },
    { german: "morgen", czech: "zítra", example: "Morgen ist mein freier Tag." },
    { german: "gestern", czech: "včera", example: "Gestern waren weniger Pakete da." },
  ];

  const weightAndSize = [
    { german: "ein Kilogramm", czech: "kilogram", example: "Das Paket wiegt ein Kilogramm." },
    { german: "ein Gramm", czech: "gram", example: "Der Brief wiegt nur 20 Gramm." },
    { german: "eine Tonne", czech: "tuna", example: "Der Container wiegt eine Tonne." },
    { german: "ein Meter", czech: "metr", example: "Das Paket ist einen Meter lang." },
    { german: "ein Zentimeter", czech: "centimetr", example: "Fünf Zentimeter zu groß." },
    { german: "ein Liter", czech: "litr", example: "Vorsicht, ein Liter Flüssigkeit drin." },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Čísla a měrné jednotky</CardTitle>
          <CardDescription>
            Kompletní přehled čísel a jednotek potřebných pro práci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonSection title="Základní číslovky (1-10)" items={basicNumbers} />
          <LessonSection title="Vyšší číslovky" items={tenToHundred} />
          <LessonSection title="Časové výrazy" items={timeExpressions} />
          <LessonSection title="Váha a rozměry" items={weightAndSize} />
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Interaktivní cvičení</h4>
            <p className="text-sm mb-4">Procvičte si čísla pomocí interaktivní hry</p>
            <Button className="flex gap-1">
              <PlayCircle className="h-4 w-4" /> Spustit cvičení
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">34 slovíček</div>
          <Button className="flex gap-1" size="sm">
            Procvičit <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Záložka: Pokyny
export const DirectionsTab = () => {
  const directions = [
    { german: "links", czech: "vlevo", example: "Die Pakete für Hamburg sind links." },
    { german: "rechts", czech: "vpravo", example: "Gehen Sie rechts zum Ausgang." },
    { german: "geradeaus", czech: "rovně", example: "Geradeaus finden Sie die Kantine." },
    { german: "oben", czech: "nahoře", example: "Die internationalen Sendungen sind oben." },
    { german: "unten", czech: "dole", example: "Legen Sie die schweren Pakete unten hin." },
    { german: "hinten", czech: "vzadu", example: "Die Toiletten sind hinten." },
    { german: "vorne", czech: "vpředu", example: "Der Ausgang ist vorne." },
    { german: "in der Mitte", czech: "uprostřed", example: "Das Büro ist in der Mitte." },
    { german: "neben", czech: "vedle", example: "Stellen Sie es neben die anderen Pakete." },
    { german: "zwischen", czech: "mezi", example: "Zwischen diesen Regalen." },
  ];

  const commands = [
    { german: "Bringen Sie das hier hin", czech: "Přineste to sem", example: "Bringen Sie das Paket bitte hier hin." },
    { german: "Stellen Sie das dort", czech: "Položte to tam", example: "Stellen Sie den Karton dort auf den Tisch." },
    { german: "Sortieren Sie diese Pakete", czech: "Roztřiďte tyto balíky", example: "Sortieren Sie diese Pakete nach Größe." },
    { german: "Achten Sie auf das Gewicht", czech: "Dávejte pozor na váhu", example: "Achten Sie auf das Gewicht der Pakete." },
    { german: "Seien Sie vorsichtig", czech: "Buďte opatrní", example: "Seien Sie vorsichtig mit zerbrechlichen Sachen." },
    { german: "Machen Sie es schneller", czech: "Dělejte to rychleji", example: "Wir haben Zeitdruck, machen Sie es schneller." },
    { german: "Stoppen Sie", czech: "Zastavte", example: "Stoppen Sie! Das Förderband ist kaputt." },
    { german: "Warten Sie", czech: "Počkejte", example: "Warten Sie, bis ich zurück bin." },
  ];

  const questions = [
    { german: "Wohin soll ich das bringen?", czech: "Kam to mám přinést?", example: "Wohin soll ich diese Pakete bringen?" },
    { german: "Wie spät ist es?", czech: "Kolik je hodin?", example: "Entschuldigung, wie spät ist es? Ist es schon Mittagspause?" },
    { german: "Wann haben wir Pause?", czech: "Kdy máme přestávku?", example: "Wann haben wir heute Pause? Um 12 Uhr?" },
    { german: "Wo finde ich...?", czech: "Kde najdu...?", example: "Wo finde ich die schweren Pakete?" },
    { german: "Kann ich Ihnen helfen?", czech: "Můžu vám pomoct?", example: "Sie sehen müde aus. Kann ich Ihnen helfen?" },
    { german: "Haben Sie Zeit?", czech: "Máte čas?", example: "Haben Sie kurz Zeit? Ich brauche Hilfe." },
  ];

  const emergencyPhrases = [
    { german: "Hilfe!", czech: "Pomoc!", example: "Hilfe! Jemand ist verletzt!" },
    { german: "Rufen Sie einen Arzt", czech: "Zavolejte doktora", example: "Rufen Sie schnell einen Arzt!" },
    { german: "Das ist gefährlich", czech: "To je nebezpečné", example: "Stopp! Das ist gefährlich!" },
    { german: "Es gibt ein Problem", czech: "Je tu problém", example: "Es gibt ein Problem mit der Maschine." },
    { german: "Der Notausgang", czech: "Nouzový východ", example: "Wo ist der nächste Notausgang?" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pokyny a komunikace</CardTitle>
          <CardDescription>
            Orientace v prostoru, porozumění pokynům a základní komunikace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonSection title="Směry a orientace" items={directions} />
          <LessonSection title="Příkazy a pokyny" items={commands} />
          <LessonSection title="Užitečné otázky" items={questions} />
          <LessonSection title="Nouzové situace" items={emergencyPhrases} />
          
          <div className="mt-4 p-4 border rounded-lg border-blue-200 bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Tip pro porozumění</h4>
            <p className="text-sm text-blue-700">
              Pokud nerozumíte pokynu, můžete říct: "Entschuldigung, ich verstehe nicht. Können Sie das wiederholen?" 
              (Promiňte, nerozumím. Můžete to zopakovat?)
            </p>
          </div>
          
          <div className="mt-4 p-4 border rounded-lg border-red-200 bg-red-50">
            <h4 className="font-medium text-red-800 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Důležité nouzové fráze
            </h4>
            <p className="text-sm text-red-700">
              V nouzových situacích je důležité znát základní fráze pro volání o pomoc. 
              Vždy se obraťte na nadřízeného nebo zavolejte na číslo 112.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">29 slovíček</div>
          <Button className="flex gap-1" size="sm">
            Procvičit <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Nová záložka: Technologie a vybavení
export const TechnologyTab = () => {
  const scanningTerms = [
    { german: "der Barcode", czech: "čárový kód", example: "Scannen Sie den Barcode auf dem Paket.", category: "Technologie" },
    { german: "der Scanner", czech: "skener", example: "Der Scanner funktioniert nicht.", category: "Vybavení" },
    { german: "das Handheld", czech: "ruční terminál", example: "Nehmen Sie das Handheld mit.", category: "Vybavení" },
    { german: "scannen", czech: "skenovat", example: "Bitte scannen Sie jedes Paket.", category: "Činnosti" },
    { german: "der QR-Code", czech: "QR kód", example: "Dieser QR-Code ist beschädigt.", category: "Technologie" },
    { german: "die Seriennummer", czech: "sériové číslo", example: "Notieren Sie sich die Seriennummer.", category: "Informace" },
  ];

  const systemTerms = [
    { german: "das System", czech: "systém", example: "Das System ist heute langsam.", category: "Technologie" },
    { german: "der Computer", czech: "počítač", example: "Der Computer ist eingefroren.", category: "Vybavení" },
    { german: "die Software", czech: "software", example: "Die Software wurde aktualisiert.", category: "Technologie" },
    { german: "das Update", czech: "aktualizace", example: "Warten Sie auf das Update.", category: "Technologie" },
    { german: "der Fehler", czech: "chyba", example: "Es gibt einen Fehler im System.", category: "Problémy" },
    { german: "das Backup", czech: "záloha", example: "Die Daten sind im Backup gespeichert.", category: "Technologie" },
  ];

  const machineTerms = [
    { german: "die Maschine", czech: "stroj", example: "Die Maschine ist kaputt.", category: "Vybavení" },
    { german: "die Waage", czech: "váha", example: "Stellen Sie das Paket auf die Waage.", category: "Vybavení" },
    { german: "der Drucker", czech: "tiskárna", example: "Der Drucker hat kein Papier mehr.", category: "Vybavení" },
    { german: "das Etikettiersystem", czech: "systém etiketování", example: "Das Etikettiersystem druckt nicht.", category: "Vybavení" },
    { german: "der Sortierer", czech: "třídič", example: "Der automatische Sortierer sortiert nach PLZ.", category: "Vybavení" },
    { german: "die Wartung", czech: "údržba", example: "Die Maschine braucht Wartung.", category: "Údržba" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technologie a vybavení</CardTitle>
          <CardDescription>
            Moderní technologie používané v balíkovém centru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonSection 
            title="Skenování a identifikace" 
            description="Technologie pro identifikaci balíků"
            items={scanningTerms} 
          />
          <LessonSection 
            title="Počítačové systémy" 
            description="Software a systémy používané v centru"
            items={systemTerms} 
          />
          <LessonSection 
            title="Stroje a zařízení" 
            description="Mechanické vybavení a jeho údržba"
            items={machineTerms} 
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">18 slovíček</div>
          <Button className="flex gap-1" size="sm">
            Procvičit <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Záložka: Procvičení (zachována beze změny)
export const PracticeTab = () => {
  const {
    currentItem,
    dueItems,
    markCorrect,
    markIncorrect,
    goToNextItem,
  } = useVocabularyContext();
  
  const {
    isComplete,
    isStarted,
    sessionStats,
    currentStreak,
    handleStartReview,
    handleCorrect,
    handleIncorrect,
    resetSession
  } = useVocabularyReviewSession(
    dueItems,
    currentItem,
    markCorrect,
    markIncorrect,
    goToNextItem
  );

  if (!isStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Procvičování slovíček</CardTitle>
          <CardDescription>
            Opakování je matka moudrosti! Procvičujte pravidelně, abyste si slovíčka lépe zapamatovali.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-muted text-center">
              <h3 className="text-xl font-semibold mb-2">
                {dueItems.length > 0 ? `${dueItems.length} slovíček k procvičení` : "Žádná slovíčka k procvičení"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {dueItems.length > 0 
                  ? "Procvičte si slovíčka pomocí metody spaced repetition pro lepší zapamatování"
                  : "Momentálně nemáte žádná slovíčka k procvičení. Všechna jste už zvládli!"}
              </p>
              <Button 
                onClick={handleStartReview} 
                disabled={dueItems.length === 0}
                className="flex items-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Začít procvičování
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Typy procvičování</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium mb-1">Spaced Repetition</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Procvičování založené na opakování v optimálních intervalech
                    </p>
                    <Badge>Aktivní</Badge>
                  </div>
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium mb-1">Překládání vět</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Procvičování v kontextu celých vět
                    </p>
                    <Badge variant="outline">Připravujeme</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Procvičování dokončeno!</CardTitle>
          <CardDescription>
            Výborně! Dokončili jste dnešní procvičování.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex h-20 w-20 rounded-full bg-green-100 p-2 mb-2">
              <CheckCircle className="h-full w-full text-green-500" />
            </div>
            
            <h3 className="text-xl font-bold">Skvělá práce!</h3>
            
            <div className="space-y-3 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Správných odpovědí</p>
                <p className="text-2xl font-bold">{sessionStats.correctCount}/{sessionStats.correctCount + sessionStats.incorrectCount}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Nejdelší série správných odpovědí</p>
                <p className="text-2xl font-bold">{sessionStats.streakCount}</p>
              </div>
              
              <div className="mt-6">
                <Button onClick={resetSession} className="mx-auto">
                  Zpět na přehled
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentItem) {
    return (
      <VocabularyReviewCard
        item={currentItem}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        remainingItems={dueItems.length}
        totalItems={dueItems.length + sessionStats.correctCount + sessionStats.incorrectCount}
        currentStreak={currentStreak}
      />
    );
  }

  return (
    <div className="text-center p-6">
      <p>Načítání slovíček...</p>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVocabularyContext } from './VocabularyManager';
import VocabularyReviewCard from '../VocabularyReviewCard';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useVocabularyReviewSession } from '@/hooks/useVocabularyReviewSession';
import { useIsMobile } from '@/hooks/use-mobile';
import { Volume2, CheckCircle, ArrowRight, PlayCircle, AlertCircle, Book, Users, MessageCircle, Package, Clock, Settings } from "lucide-react";

// Helper function to play audio for German pronunciation
const pronounceWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE';
    speechSynthesis.speak(utterance);
  }
};

// Vocabulary card component using consistent design patterns
const VocabularyCard = ({ german, czech, example, category }: { 
  german: string, 
  czech: string, 
  example?: string,
  category?: string 
}) => {
  const [showExample, setShowExample] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-base break-words">{german}</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-shrink-0 h-6 w-6 p-0 hover:bg-primary/10" 
              onClick={() => pronounceWord(german)}
            >
              <Volume2 className="h-3 w-3" />
              <span className="sr-only">Přečíst</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2 break-words">{czech}</p>
          {example && (
            <div className="mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => setShowExample(!showExample)}
              >
                {showExample ? 'Skrýt příklad' : 'Zobrazit příklad'}
              </Button>
              {showExample && (
                <div className="mt-1 text-xs italic text-muted-foreground border-l-2 border-primary/20 pl-2">
                  {example}
                </div>
              )}
            </div>
          )}
        </div>
        {category && (
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {category}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Lesson section component using consistent card layout
const LessonSection = ({ title, description, items, icon }: { 
  title: string, 
  description?: string,
  icon?: React.ReactNode,
  items: {
    german: string,
    czech: string,
    example?: string,
    category?: string
  }[]
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
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
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {items.length} slovíček v této sekci
      </CardFooter>
    </Card>
  );
};

// Záložka: Základy - rozšířeno
export const WarehouseBasicsTab = () => {
  const greetings = [
    { german: "Guten Morgen", czech: "Dobré ráno", example: "Guten Morgen, wie geht es Ihnen?" },
    { german: "Guten Tag", czech: "Dobrý den", example: "Guten Tag, Herr Schmidt." },
    { german: "Guten Abend", czech: "Dobrý večer", example: "Guten Abend! Schönen Feierabend!" },
    { german: "Auf Wiedersehen", czech: "Na shledanou", example: "Ich muss jetzt gehen. Auf Wiedersehen!" },
    { german: "Bis morgen", czech: "Do zítřka", example: "Bis morgen um 6 Uhr!" },
    { german: "Schönes Wochenende", czech: "Hezký víkend", example: "Schönes Wochenende und gute Erholung!" },
    { german: "Danke schön", czech: "Děkuji pěkně", example: "Danke schön für Ihre Hilfe." },
    { german: "Bitte schön", czech: "Prosím pěkně", example: "Können Sie mir bitte schön helfen?" },
    { german: "Entschuldigung", czech: "Promiňte", example: "Entschuldigung, wo ist die Toilette?" },
    { german: "Tut mir leid", czech: "Je mi líto", example: "Tut mir leid, das war mein Fehler." }
  ];

  const basicPhrases = [
    { german: "Ich verstehe nicht", czech: "Nerozumím", example: "Entschuldigung, ich verstehe nicht. Können Sie das wiederholen?" },
    { german: "Sprechen Sie Englisch?", czech: "Mluvíte anglicky?", example: "Sprechen Sie Englisch? Ich spreche kein Deutsch." },
    { german: "Können Sie mir helfen?", czech: "Můžete mi pomoct?", example: "Können Sie mir bitte mit diesem schweren Paket helfen?" },
    { german: "Wo ist die Toilette?", czech: "Kde jsou toalety?", example: "Entschuldigung, wo ist die Toilette?" },
    { german: "Ich brauche Hilfe", czech: "Potřebuji pomoct", example: "Ich brauche Hilfe bei dieser Aufgabe." },
    { german: "Wie spät ist es?", czech: "Kolik je hodin?", example: "Entschuldigung, wie spät ist es?" },
    { german: "Wann ist Pause?", czech: "Kdy je přestávka?", example: "Wann haben wir heute Pause?" },
    { german: "Wo ist der Ausgang?", czech: "Kde je východ?", example: "Können Sie mir zeigen, wo der Ausgang ist?" },
    { german: "Können Sie das wiederholen?", czech: "Můžete to zopakovat?", example: "Entschuldigung, können Sie das bitte wiederholen?" },
    { german: "Sprechen Sie bitte langsamer", czech: "Mluvte prosím pomaleji", example: "Können Sie bitte langsamer sprechen? Ich lerne noch Deutsch." },
    { german: "Wie heißt das auf Deutsch?", czech: "Jak se to řekne německy?", example: "Wie heißt das auf Deutsch? Ich kenne das Wort nicht." },
    { german: "Das verstehe ich", czech: "To rozumím", example: "Ah ja, das verstehe ich jetzt. Danke!" }
  ];

  const introductions = [
    { german: "Ich heiße...", czech: "Jmenuji se...", example: "Hallo, ich heiße Martin." },
    { german: "Ich komme aus Tschechien", czech: "Pocházím z Česka", example: "Ich komme aus Tschechien und arbeite jetzt in Deutschland." },
    { german: "Ich komme aus Polen", czech: "Pocházím z Polska", example: "Ich komme aus Polen, aus Krakau." },
    { german: "Ich arbeite im Paketzentrum", czech: "Pracuji v balíkovém centru", example: "Seit einem Monat arbeite ich im Paketzentrum." },
    { german: "Das ist mein erster Tag", czech: "To je můj první den", example: "Das ist mein erster Tag hier. Können Sie mir helfen?" },
    { german: "Ich bin neu hier", czech: "Jsem tu nový", example: "Ich bin neu hier und kenne mich noch nicht aus." },
    { german: "Ich spreche ein bisschen Deutsch", czech: "Mluvím trochu německy", example: "Ich spreche nur ein bisschen Deutsch, aber ich lerne." },
    { german: "Freut mich, Sie kennenzulernen", czech: "Těší mě, že vás poznávám", example: "Freut mich, Sie kennenzulernen, Herr Müller." },
    { german: "Ich arbeite in der Früh", czech: "Pracuji v ranní směně", example: "Ich arbeite in der Frühschicht von 6 bis 14 Uhr." },
    { german: "Wie lange arbeiten Sie hier?", czech: "Jak dlouho tu pracujete?", example: "Wie lange arbeiten Sie schon hier im Zentrum?" }
  ];

  const workBasics = [
    { german: "die Schicht", czech: "směna", example: "Meine Schicht beginnt um 6 Uhr morgens.", category: "Práce" },
    { german: "die Frühschicht", czech: "ranní směna", example: "Ich arbeite immer Frühschicht.", category: "Práce" },
    { german: "die Spätschicht", czech: "odpolední směna", example: "Die Spätschicht beginnt um 14 Uhr.", category: "Práce" },
    { german: "die Nachtschicht", czech: "noční směna", example: "Nachtschicht ist von 22 bis 6 Uhr.", category: "Práce" },
    { german: "der Arbeitsplatz", czech: "pracovní místo", example: "Mein Arbeitsplatz ist beim Förderband.", category: "Práce" },
    { german: "die Pause", czech: "přestávka", example: "Die Pause dauert 30 Minuten.", category: "Práce" },
    { german: "der Feierabend", czech: "konec práce", example: "Um 14 Uhr ist Feierabend.", category: "Práce" },
    { german: "der Vorgesetzter", czech: "nadřízený", example: "Mein Vorgesetzter heißt Herr Müller.", category: "Práce" },
    { german: "der Kollege", czech: "kolega", example: "Das ist mein neuer Kollege aus Prag.", category: "Práce" },
    { german: "die Überstunden", czech: "přesčasy", example: "Können Sie heute Überstunden machen?", category: "Práce" },
    { german: "der Teamleiter", czech: "vedoucí týmu", example: "Der Teamleiter erklärt die neue Aufgabe.", category: "Práce" },
    { german: "die Aufgabe", czech: "úkol", example: "Ihre Aufgabe ist das Sortieren der Pakete.", category: "Práce" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Základy němčiny
          </CardTitle>
          <CardDescription>
            Naučte se základní fráze a pozdravy, které vám pomohou při každodenní komunikaci v práci
          </CardDescription>
        </CardHeader>
      </Card>

      <LessonSection 
        title="Pozdravy a zdvořilost" 
        description="Rozšířené pozdravy pro každodenní komunikaci"
        icon={<MessageCircle className="h-5 w-5" />}
        items={greetings} 
      />
      
      <LessonSection 
        title="Základní komunikační fráze" 
        description="Užitečné fráze pro běžné situace a překonání jazykových bariér"
        icon={<Users className="h-5 w-5" />}
        items={basicPhrases} 
      />
      
      <LessonSection 
        title="Představení se a poznávání kolegů" 
        description="Jak se představit a navázat první kontakt s novými kolegy"
        icon={<Users className="h-5 w-5" />}
        items={introductions} 
      />
      
      <LessonSection 
        title="Základy práce a směny" 
        description="Nejdůležitější pojmy týkající se práce a pracovní doby"
        icon={<Clock className="h-5 w-5" />}
        items={workBasics} 
      />

      <Card>
        <CardFooter className="flex justify-between items-center pt-6">
          <div className="text-sm text-muted-foreground">
            Celkem {greetings.length + basicPhrases.length + introductions.length + workBasics.length} slovíček
          </div>
          <Button className="flex items-center gap-2">
            Procvičit vše <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Záložka: Balení a třídění - rozšířeno
export const PackagingTermsTab = () => {
  const packagingTerms = [
    { german: "das Paket", czech: "balík", example: "Das Paket wiegt 5 Kilogramm.", category: "Předměty" },
    { german: "das kleine Paket", czech: "malý balík", example: "Die kleinen Pakete kommen auf dieses Band.", category: "Předměty" },
    { german: "das große Paket", czech: "velký balík", example: "Große Pakete brauchen zwei Personen.", category: "Předměty" },
    { german: "der Karton", czech: "krabice", example: "Stellen Sie den Karton auf das Förderband.", category: "Předměty" },
    { german: "die Schachtel", czech: "krabička", example: "Diese Schachtel ist sehr zerbrechlich.", category: "Předměty" },
    { german: "der Umschlag", czech: "obálka", example: "Der Umschlag gehört zu den Briefen.", category: "Předměty" },
    { german: "die Lieferung", czech: "dodávka", example: "Die Lieferung muss heute noch raus.", category: "Logistika" },
    { german: "die Sendung", czech: "zásilka", example: "Diese Sendung geht nach Berlin.", category: "Logistika" },
    { german: "die Express-Sendung", czech: "expresní zásilka", example: "Express-Sendungen haben Priorität.", category: "Logistika" },
    { german: "die Adresse", czech: "adresa", example: "Bitte überprüfen Sie die Adresse auf dem Paket.", category: "Informace" },
    { german: "der Empfänger", czech: "příjemce", example: "Der Name des Empfängers ist unleserlich.", category: "Informace" },
    { german: "der Absender", czech: "odesílatel", example: "Der Absender ist Amazon.", category: "Informace" },
    { german: "das Etikett", czech: "štítek", example: "Das Etikett ist beschädigt.", category: "Informace" },
    { german: "der Aufkleber", czech: "nálepka", example: "Der Aufkleber zeigt 'Zerbrechlich'.", category: "Informace" },
    { german: "die Postleitzahl", czech: "PSČ", example: "Die Postleitzahl für München ist 80331.", category: "Informace" },
    { german: "das Gewicht", czech: "váha", example: "Das Gewicht steht auf dem Etikett.", category: "Informace" }
  ];

  const sortingTerms = [
    { german: "sortieren", czech: "třídit", example: "Bitte sortieren Sie die Pakete nach Postleitzahlen.", category: "Činnosti" },
    { german: "einsortieren", czech: "zatřídit", example: "Können Sie dieses Paket richtig einsortieren?", category: "Činnosti" },
    { german: "einpacken", czech: "zabalit", example: "Sie müssen die Ware sorgfältig einpacken.", category: "Činnosti" },
    { german: "auspacken", czech: "vybalit", example: "Bitte packen Sie die beschädigte Ware aus.", category: "Činnosti" },
    { german: "umpacken", czech: "přebalit", example: "Dieses Paket muss umgepackt werden.", category: "Činnosti" },
    { german: "wiegen", czech: "vážit", example: "Bitte wiegen Sie dieses Paket.", category: "Činnosti" },
    { german: "messen", czech: "měřit", example: "Wir müssen die Größe messen.", category: "Činnosti" },
    { german: "scannen", czech: "skenovat", example: "Scannen Sie den Barcode.", category: "Činnosti" },
    { german: "verladen", czech: "naložit", example: "Die Pakete werden morgen verladen.", category: "Činnosti" },
    { german: "stapeln", czech: "skládat", example: "Stapeln Sie die Pakete vorsichtig.", category: "Činnosti" },
    { german: "transportieren", czech: "přepravovat", example: "Schwere Pakete mit dem Wagen transportieren.", category: "Činnosti" },
    { german: "kontrollieren", czech: "kontrolovat", example: "Kontrollieren Sie die Adresse.", category: "Činnosti" },
    { german: "das Förderband", czech: "dopravní pás", example: "Legen Sie das Paket auf das Förderband.", category: "Vybavení" },
    { german: "das Band", czech: "pás", example: "Band Nummer 3 ist defekt.", category: "Vybavení" },
    { german: "der Scanner", czech: "skener", example: "Der Scanner funktioniert nicht.", category: "Vybavení" }
  ];

  const warehouseTerms = [
    { german: "das Lager", czech: "sklad", example: "Die Pakete werden im Lager sortiert.", category: "Místa" },
    { german: "das Warenlager", czech: "skladiště", example: "Das Warenlager ist sehr groß.", category: "Místa" },
    { german: "die Halle", czech: "hala", example: "In dieser Halle arbeiten 50 Personen.", category: "Místa" },
    { german: "die Palette", czech: "paleta", example: "Stellen Sie die schweren Pakete auf die Palette.", category: "Vybavení" },
    { german: "der Gabelstapler", czech: "vysokozdvižný vozík", example: "Der Gabelstapler transportiert die schweren Paletten.", category: "Vybavení" },
    { german: "der Rollwagen", czech: "vozík", example: "Nehmen Sie den Rollwagen für die schweren Pakete.", category: "Vybavení" },
    { german: "die Laderampe", czech: "nakládací rampa", example: "Der LKW parkt an der Laderampe.", category: "Místa" },
    { german: "das Tor", czech: "brána", example: "Tor 5 ist für die Anlieferung.", category: "Místa" },
    { german: "der Container", czech: "kontejner", example: "Der Container ist fast voll.", category: "Vybavení" },
    { german: "der LKW", czech: "nákladní auto", example: "Der LKW kommt um 8 Uhr.", category: "Vybavení" },
    { german: "das Regal", czech: "regál", example: "Die Pakete stehen im Regal.", category: "Vybavení" },
    { german: "das Fach", czech: "přihrádka", example: "Legen Sie das Paket in das richtige Fach.", category: "Vybavení" },
    { german: "der Wareneingang", czech: "příjem zboží", example: "Alle neuen Pakete gehen durch den Wareneingang.", category: "Místa" },
    { german: "der Warenausgang", czech: "expedice", example: "Der Warenausgang ist um 16 Uhr geschlossen.", category: "Místa" },
    { german: "die Verladestation", czech: "nakládací stanice", example: "An der Verladestation werden die Pakete in LKWs geladen.", category: "Místa" },
    { german: "die Sortieranlage", czech: "třídírna", example: "Die neue Sortieranlage ist sehr schnell.", category: "Vybavení" }
  ];

  const qualityTerms = [
    { german: "beschädigt", czech: "poškozený", example: "Dieses Paket ist beschädigt.", category: "Stav" },
    { german: "kaputt", czech: "rozbitý", example: "Das Paket ist kaputt gegangen.", category: "Stav" },
    { german: "zerbrochen", czech: "rozbitý", example: "Vorsicht, der Inhalt ist zerbrochen.", category: "Stav" },
    { german: "zerrissen", czech: "roztržený", example: "Das Etikett ist zerrissen.", category: "Stav" },
    { german: "nass", czech: "mokrý", example: "Das Paket ist nass geworden.", category: "Stav" },
    { german: "schmutzig", czech: "špinavý", example: "Das Paket ist sehr schmutzig.", category: "Stav" },
    { german: "sauber", czech: "čistý", example: "Halten Sie den Arbeitsplatz sauber.", category: "Stav" },
    { german: "neu", czech: "nový", example: "Das ist ein neues Paket.", category: "Stav" },
    { german: "alt", czech: "starý", example: "Alte Pakete zuerst bearbeiten.", category: "Stav" },
    { german: "zerbrechlich", czech: "křehký", example: "Vorsicht! Das ist zerbrechlich.", category: "Stav" },
    { german: "schwer", czech: "těžký", example: "Dieses Paket ist sehr schwer.", category: "Vlastnosti" },
    { german: "leicht", czech: "lehký", example: "Die leichten Pakete nach oben.", category: "Vlastnosti" },
    { german: "groß", czech: "velký", example: "Große Pakete brauchen mehr Platz.", category: "Vlastnosti" },
    { german: "klein", czech: "malý", example: "Kleine Pakete kommen hier hin.", category: "Vlastnosti" },
    { german: "eilig", czech: "spěšný", example: "Diese Sendung ist eilig.", category: "Priorita" },
    { german: "Express", czech: "express", example: "Das ist eine Express-Sendung.", category: "Priorita" },
    { german: "normal", czech: "normální", example: "Das ist eine normale Sendung.", category: "Priorita" },
    { german: "wichtig", czech: "důležitý", example: "Dieses Paket ist sehr wichtig.", category: "Priorita" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Balíkové centrum - rozšířená slovní zásoba
          </CardTitle>
          <CardDescription>
            Pokročilejší pojmy pro efektivní práci v logistickém centru
          </CardDescription>
        </CardHeader>
      </Card>

      <LessonSection 
        title="Balíky a zásilky" 
        description="Rozšířené pojmy pro práci s různými typy balíků a zásilek"
        icon={<Package className="h-5 w-5" />}
        items={packagingTerms} 
      />
      
      <LessonSection 
        title="Třídění a manipulace" 
        description="Detailní slovíčka spojená s tříděním a manipulací s balíky"
        icon={<Settings className="h-5 w-5" />}
        items={sortingTerms} 
      />
      
      <LessonSection 
        title="Vybavení skladu a místa" 
        description="Komplexní pojmy pro orientaci ve skladu a práci s vybavením"
        icon={<Settings className="h-5 w-5" />}
        items={warehouseTerms} 
      />
      
      <LessonSection 
        title="Kvalita, stav a priority" 
        description="Podrobný popis stavu balíků, jejich kvality a priority zpracování"
        icon={<AlertCircle className="h-5 w-5" />}
        items={qualityTerms} 
      />

      <Card>
        <CardFooter className="flex justify-between items-center pt-6">
          <div className="text-sm text-muted-foreground">
            Celkem {packagingTerms.length + sortingTerms.length + warehouseTerms.length + qualityTerms.length} slovíček
          </div>
          <Button className="flex items-center gap-2">
            Procvičit vše <ArrowRight className="h-4 w-4" />
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
        onCorrect={() => handleCorrect(currentItem.id)}
        onIncorrect={() => handleIncorrect(currentItem.id)}
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

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

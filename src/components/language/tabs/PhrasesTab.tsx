
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageSquare, Coffee, Briefcase, Heart, MapPin, Volume2, PlayCircle } from "lucide-react";

const PhrasesTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('work');
  const isMobile = useIsMobile();

  const phraseCategories = [
    {
      id: 'work',
      title: 'Práce',
      description: 'Fráze pro pracovní prostředí',
      icon: Briefcase,
      count: 25,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'daily',
      title: 'Každodenní',
      description: 'Běžné konverzační fráze',
      icon: Coffee,
      count: 30,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'social',
      title: 'Sociální',
      description: 'Fráze pro společenské situace',
      icon: Heart,
      count: 20,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'travel',
      title: 'Cestování',
      description: 'Užitečné fráze na cesty',
      icon: MapPin,
      count: 18,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const phrasesData = {
    work: [
      { german: "Ich bin neu hier", czech: "Jsem tu nový/nová", situation: "První den v práci" },
      { german: "Können Sie mir helfen?", czech: "Můžete mi pomoct?", situation: "Žádost o pomoc" },
      { german: "Wo ist die Kantine?", czech: "Kde je jídelna?", situation: "Orientace v budově" },
      { german: "Um wie viel Uhr haben wir Pause?", czech: "V kolik hodin máme přestávku?", situation: "Dotaz na rozvrh" },
      { german: "Das verstehe ich nicht", czech: "Tomu nerozumím", situation: "Při nedorozumění" }
    ],
    daily: [
      { german: "Wie geht es Ihnen?", czech: "Jak se máte?", situation: "Zdvořilý pozdrav" },
      { german: "Das Wetter ist heute schön", czech: "Dnes je hezké počasí", situation: "Hovořit o počasí" },
      { german: "Haben Sie Zeit?", czech: "Máte čas?", situation: "Žádost o pozornost" },
      { german: "Entschuldigen Sie die Störung", czech: "Promiňte, že ruším", situation: "Zdvořilé přerušení" },
      { german: "Vielen Dank für Ihre Hilfe", czech: "Moc děkuji za vaši pomoc", situation: "Poděkování" }
    ],
    social: [
      { german: "Freut mich, Sie kennenzulernen", czech: "Těší mě, že vás poznávám", situation: "Při seznámení" },
      { german: "Woher kommen Sie?", czech: "Odkud pocházíte?", situation: "Dotaz na původ" },
      { german: "Sprechen Sie Tschechisch?", czech: "Mluvíte česky?", situation: "Dotaz na jazyky" },
      { german: "Das ist sehr interessant", czech: "To je velmi zajímavé", situation: "Vyjádření zájmu" },
      { german: "Haben Sie Familie?", czech: "Máte rodinu?", situation: "Osobní rozhovor" }
    ],
    travel: [
      { german: "Wo ist der Bahnhof?", czech: "Kde je nádraží?", situation: "Orientace ve městě" },
      { german: "Eine Fahrkarte nach Berlin, bitte", czech: "Jednu jízdenku do Berlína, prosím", situation: "Nákup jízdenky" },
      { german: "Wann fährt der nächste Zug?", czech: "Kdy jede další vlak?", situation: "Dotaz na odjezd" },
      { german: "Ist dieser Platz frei?", czech: "Je toto místo volné?", situation: "V dopravním prostředku" },
      { german: "Können Sie mir den Weg zeigen?", czech: "Můžete mi ukázat cestu?", situation: "Žádost o navigaci" }
    ]
  };

  const pronouncePhrase = (phrase: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Užitečné fráze</CardTitle>
          <CardDescription>
            Naučte se praktické fráze pro různé životní situace v Německu
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <Card className="border-b p-1">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} h-auto p-0.5`}>
            {phraseCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="flex items-center justify-center py-1 px-0.5"
                >
                  <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                    <Icon className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                    <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                      {category.title}
                    </span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Card>

        <div className="mt-2">
          {phraseCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <Card className={`${category.color} mb-4`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <category.icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </div>
                        <Badge variant="outline">{category.count} frází</Badge>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full flex gap-1" size="sm">
                        <PlayCircle className="h-4 w-4" />
                        Procvičit fráze
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Tip pro učení</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Procvičujte fráze v kontextu skutečných situací. 
                        Zkuste si představit, kdy byste je mohli použít.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    {phrasesData[category.id as keyof typeof phrasesData]?.map((phrase, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{phrase.german}</h3>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="p-0 h-8 w-8" 
                                  onClick={() => pronouncePhrase(phrase.german)}
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-muted-foreground mb-2">{phrase.czech}</p>
                              <Badge variant="secondary" className="text-xs">
                                {phrase.situation}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default PhrasesTab;

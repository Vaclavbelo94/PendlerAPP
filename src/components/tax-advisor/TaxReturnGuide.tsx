
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Wallet, ArrowRight, Check } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const TaxReturnGuide = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const steps = [
    {
      title: "Příprava dokumentů",
      content: "Shromážděte všechny potřebné dokumenty: formulář Lohnsteuerbescheinigung od zaměstnavatele, doklady o nákladech na dojíždění, pracovní vybavení a další odečitatelné položky."
    },
    {
      title: "Vytvoření ELSTER účtu",
      content: "Pro elektronické podání daňového přiznání si vytvořte účet v systému ELSTER (www.elster.de). Registrace vyžaduje potvrzení poštou, proto začněte s dostatečným předstihem."
    },
    {
      title: "Vyplnění formulářů",
      content: "Vyplňte daňové formuláře v systému ELSTER nebo použijte daňový software jako WISO Steuer nebo Tax Fix. Průvodce vás povede celým procesem."
    },
    {
      title: "Odeslání přiznání",
      content: "Elektronicky odešlete vyplněné přiznání přes ELSTER nebo vytiskněte a zašlete poštou na příslušný finanční úřad (Finanzamt)."
    },
    {
      title: "Kontrola rozhodnutí",
      content: "Po zpracování obdržíte daňové rozhodnutí (Steuerbescheid). Zkontrolujte, zda jsou všechny odpočty správně zohledněny."
    }
  ];
  
  const deadlines = [
    {
      title: "Standardní termín",
      date: "31. července",
      description: "Pro daňová přiznání bez daňového poradce."
    },
    {
      title: "Prodloužený termín",
      date: "28. února (následující rok)",
      description: "Pro daňová přiznání zpracovaná daňovým poradcem."
    },
    {
      title: "Pozdní podání",
      fee: "Až 0,25% z daně, min. 25 € za každý započatý měsíc",
      description: "Pokuta za opožděné podání."
    }
  ];
  
  const documents = [
    {
      title: "Lohnsteuerbescheinigung",
      description: "Roční výplatní páska od zaměstnavatele"
    },
    {
      title: "Pendlerpauschale",
      description: "Odpočet nákladů na dojíždění"
    },
    {
      title: "Werbungskosten",
      description: "Náklady související s prací (pracovní vybavení, pracovní oblečení)"
    },
    {
      title: "Sonderausgaben",
      description: "Zvláštní výdaje (pojištění, charitativní dary)"
    },
    {
      title: "Außergewöhnliche Belastungen",
      description: "Mimořádné náklady (zdravotní výdaje)"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Průvodce daňovým přiznáním v Německu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2 text-xs md:text-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Přehled</span>
                <span className="sm:hidden">Přehled</span>
              </TabsTrigger>
              <TabsTrigger value="deadlines" className="flex items-center gap-2 text-xs md:text-sm">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Termíny</span>
                <span className="sm:hidden">Termíny</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2 text-xs md:text-sm">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Dokumenty</span>
                <span className="sm:hidden">Dokumenty</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Postup podání daňového přiznání</h3>
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 rounded-full bg-primary/20 p-2 mt-1">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Potřebujete pomoc s daněmi?</h3>
                    <p className="text-sm text-muted-foreground">Vyzkoušejte náš optimalizační nástroj nebo kontaktujte daňového poradce.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("documents")}>
                      Potřebné dokumenty
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deadlines" className="pt-4 space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Důležité termíny</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {deadlines.map((deadline, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-medium">{deadline.title}</h4>
                        {deadline.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm">{deadline.date}</span>
                          </div>
                        )}
                        {deadline.fee && (
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{deadline.fee}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">{deadline.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Upozornění:</span> Nenechávejte podání na poslední chvíli. Finanční úřady jsou v období těsně před termíny velmi vytížené.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="pt-4 space-y-4">
              <h3 className="text-lg font-medium">Potřebné dokumenty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-md border">
                    <Check className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <AspectRatio ratio={16/9}>
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center rounded-md border border-dashed">
                    <div className="text-center p-4">
                      <FileText className="h-10 w-10 text-muted-foreground/70 mx-auto mb-2" />
                      <h3 className="text-sm font-medium">Vzory dokumentů</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ukázky dokumentů budou brzy k dispozici
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" disabled>
                        Zobrazit příklady
                      </Button>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReturnGuide;

import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, ArrowRightLeft, Mic, Volume2, Copy, Check, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Translator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("cs");
  const [targetLanguage, setTargetLanguage] = useState("de");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("translator");
  const { toast } = useToast();

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      toast({
        title: "Prázdný text",
        description: "Zadejte text k překladu",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    
    // Simulace překladu (v reálné aplikaci by zde byl API call)
    setTimeout(() => {
      // Jednoduchá simulace překladu pro demo účely
      let result = "";
      if (sourceLanguage === "cs" && targetLanguage === "de") {
        // Česky -> Německy
        const translations: Record<string, string> = {
          "ahoj": "Hallo",
          "dobrý den": "Guten Tag",
          "děkuji": "Danke",
          "prosím": "Bitte",
          "ano": "Ja",
          "ne": "Nein",
          "jak se máš": "Wie geht es dir",
          "na shledanou": "Auf Wiedersehen"
        };
        
        result = sourceText;
        Object.entries(translations).forEach(([cs, de]) => {
          result = result.replace(new RegExp(cs, 'gi'), de);
        });
      } else if (sourceLanguage === "de" && targetLanguage === "cs") {
        // Německy -> Česky
        const translations: Record<string, string> = {
          "hallo": "Ahoj",
          "guten tag": "Dobrý den",
          "danke": "Děkuji",
          "bitte": "Prosím",
          "ja": "Ano",
          "nein": "Ne",
          "wie geht es dir": "Jak se máš",
          "auf wiedersehen": "Na shledanou"
        };
        
        result = sourceText;
        Object.entries(translations).forEach(([de, cs]) => {
          result = result.replace(new RegExp(de, 'gi'), cs);
        });
      } else {
        // Pokud nejsou podporované jazyky, vrátíme původní text
        result = sourceText;
      }
      
      setTranslatedText(result || "Překlad není k dispozici");
      setIsTranslating(false);
    }, 1000);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    
    toast({
      title: "Zkopírováno",
      description: "Text byl zkopírován do schránky"
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleReset = () => {
    setSourceText("");
    setTranslatedText("");
    setIsCopied(false);
  };

  return (
    <PremiumCheck featureKey="translator">
      <div className="container py-6">
        <Helmet>
          <title>Překladač | Pendler Buddy</title>
        </Helmet>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Languages className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Překladač</h1>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-3xl mb-6">
          Přeložte texty mezi češtinou a němčinou pro lepší porozumění v práci a každodenní komunikaci.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="translator">Překladač</TabsTrigger>
            <TabsTrigger value="phrasebook">Frázovník</TabsTrigger>
            <TabsTrigger value="history">Historie</TabsTrigger>
          </TabsList>

          <TabsContent value="translator">
            <Card>
              <CardHeader>
                <CardTitle>Překlad textu</CardTitle>
                <CardDescription>
                  Přeložte text mezi češtinou a němčinou
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Zdrojový text */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Zdrojový jazyk" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Čeština</SelectItem>
                          <SelectItem value="de">Němčina</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSwapLanguages}
                        className="rounded-full"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                      
                      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Cílový jazyk" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Čeština</SelectItem>
                          <SelectItem value="de">Němčina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea 
                      placeholder="Zadejte text k překladu..." 
                      className="min-h-[200px] resize-none"
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                    />
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Mic className="h-4 w-4" />
                        <span>Diktovat</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Vymazat</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Přeložený text */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Přeložený text</h3>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Volume2 className="h-4 w-4" />
                          <span>Přečíst</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCopyToClipboard}
                          className="flex items-center gap-2"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span>{isCopied ? "Zkopírováno" : "Kopírovat"}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="min-h-[200px] p-4 border rounded-md bg-muted">
                      {isTranslating ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        </div>
                      ) : (
                        translatedText || "Zde se zobrazí přeložený text..."
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleTranslate}
                        disabled={isTranslating || !sourceText.trim()}
                        className="px-8"
                      >
                        Přeložit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="phrasebook">
            <Card>
              <CardHeader>
                <CardTitle>Frázovník</CardTitle>
                <CardDescription>
                  Užitečné fráze pro každodenní komunikaci
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { cs: "Dobrý den", de: "Guten Tag" },
                    { cs: "Jak se máte?", de: "Wie geht es Ihnen?" },
                    { cs: "Děkuji", de: "Danke" },
                    { cs: "Prosím", de: "Bitte" },
                    { cs: "Na shledanou", de: "Auf Wiedersehen" },
                    { cs: "Omlouvám se", de: "Entschuldigung" },
                    { cs: "Nerozumím", de: "Ich verstehe nicht" },
                    { cs: "Můžete to zopakovat?", de: "Können Sie das wiederholen?" }
                  ].map((phrase, index) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="font-medium">{phrase.cs}</div>
                      <div className="text-muted-foreground">{phrase.de}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historie překladů</CardTitle>
                <CardDescription>
                  Vaše nedávné překlady
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Historie překladů je prázdná</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default Translator;

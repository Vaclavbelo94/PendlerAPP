import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowRightLeft, Copy, Volume2, Languages, FileText, Mic, History } from "lucide-react";
import { toast } from "sonner";
import PremiumCheck from '@/components/premium/PremiumCheck';

const TranslatorPage = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("cs");
  const [targetLanguage, setTargetLanguage] = useState("de");
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<Array<{
    id: string;
    sourceText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: Date;
  }>>([]);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [activeTab, setActiveTab] = useState("text");

  // Efekt pro automatický překlad při změně textu
  useEffect(() => {
    if (autoTranslate && sourceText.length > 0) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [sourceText, autoTranslate, sourceLanguage, targetLanguage]);

  // Načtení historie překladů z localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Chyba při načítání historie překladů:', e);
      }
    }
  }, []);

  // Uložení historie překladů do localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('translationHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Zadejte text k překladu");
      return;
    }

    setIsTranslating(true);

    try {
      // Simulace API volání pro překlad
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Jednoduchá simulace překladu pro demo účely
      let result = "";
      
      if (sourceLanguage === "cs" && targetLanguage === "de") {
        const translations: Record<string, string> = {
          "ahoj": "hallo",
          "dobrý den": "guten tag",
          "děkuji": "danke",
          "prosím": "bitte",
          "ano": "ja",
          "ne": "nein",
          "jak se máš": "wie geht es dir",
          "na shledanou": "auf wiedersehen"
        };
        
        const lowerText = sourceText.toLowerCase();
        
        if (translations[lowerText]) {
          result = translations[lowerText];
        } else {
          // Simulace překladu pro neznámý text
          result = sourceText
            .split(' ')
            .map(word => word.length > 3 ? word + 'en' : word)
            .join(' ');
        }
      } else if (sourceLanguage === "de" && targetLanguage === "cs") {
        const translations: Record<string, string> = {
          "hallo": "ahoj",
          "guten tag": "dobrý den",
          "danke": "děkuji",
          "bitte": "prosím",
          "ja": "ano",
          "nein": "ne",
          "wie geht es dir": "jak se máš",
          "auf wiedersehen": "na shledanou"
        };
        
        const lowerText = sourceText.toLowerCase();
        
        if (translations[lowerText]) {
          result = translations[lowerText];
        } else {
          // Simulace překladu pro neznámý text
          result = sourceText
            .split(' ')
            .map(word => word.endsWith('en') ? word.slice(0, -2) : word)
            .join(' ');
        }
      } else {
        // Pro ostatní jazykové kombinace jen simulujeme překlad
        result = `[${sourceLanguage} → ${targetLanguage}] ` + sourceText;
      }
      
      setTranslatedText(result);
      
      // Přidání do historie
      const newHistoryItem = {
        id: Date.now().toString(),
        sourceText,
        translatedText: result,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date()
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Chyba při překladu:', error);
      toast.error("Došlo k chybě při překladu");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopyTranslation = () => {
    navigator.clipboard.writeText(translatedText);
    toast.success("Překlad byl zkopírován do schránky");
  };

  const handleTextToSpeech = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'cs' ? 'cs-CZ' : language === 'de' ? 'de-DE' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Váš prohlížeč nepodporuje převod textu na řeč");
    }
  };

  const handleLoadFromHistory = (item: typeof history[0]) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setSourceLanguage(item.sourceLanguage);
    setTargetLanguage(item.targetLanguage);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translationHistory');
    toast.success("Historie překladů byla vymazána");
  };

  return (
    <PremiumCheck featureKey="translator">
      <div className="container py-6 md:py-10">
        <h1 className="text-3xl font-bold mb-6">Překladač</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Historie</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  <span>Překlad textu</span>
                </CardTitle>
                <CardDescription>
                  Přeložte text mezi češtinou, němčinou a angličtinou
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-1/2 space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="sourceLanguage">Zdrojový jazyk</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => setSourceText("")}
                      >
                        Vymazat
                      </Button>
                    </div>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                      <SelectTrigger id="sourceLanguage">
                        <SelectValue placeholder="Vyberte jazyk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Čeština</SelectItem>
                        <SelectItem value="de">Němčina</SelectItem>
                        <SelectItem value="en">Angličtina</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Zadejte text k překladu..."
                      className="min-h-[200px] resize-none"
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleTextToSpeech(sourceText, sourceLanguage)}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Přečíst
                    </Button>
                  </div>
                  
                  <div className="hidden md:flex items-center self-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full"
                      onClick={handleSwapLanguages}
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="targetLanguage">Cílový jazyk</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={handleCopyTranslation}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Kopírovat
                      </Button>
                    </div>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger id="targetLanguage">
                        <SelectValue placeholder="Vyberte jazyk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Čeština</SelectItem>
                        <SelectItem value="de">Němčina</SelectItem>
                        <SelectItem value="en">Angličtina</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Přeložený text..."
                      className="min-h-[200px] resize-none bg-muted/30"
                      value={translatedText}
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleTextToSpeech(translatedText, targetLanguage)}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Přečíst
                    </Button>
                  </div>
                </div>
                
                <div className="md:hidden flex justify-center my-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={handleSwapLanguages}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-translate"
                      checked={autoTranslate}
                      onCheckedChange={setAutoTranslate}
                    />
                    <Label htmlFor="auto-translate">Automatický překlad</Label>
                  </div>
                  
                  <Button 
                    onClick={handleTranslate} 
                    disabled={isTranslating || !sourceText.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isTranslating ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                        Překládám...
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        Přeložit
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  <span>Historie překladů</span>
                </CardTitle>
                <CardDescription>
                  Vaše poslední překlady
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Zatím nemáte žádné překlady v historii</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {item.sourceLanguage === 'cs' ? 'Čeština' : 
                                 item.sourceLanguage === 'de' ? 'Němčina' : 'Angličtina'}
                              </span>
                              <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {item.targetLanguage === 'cs' ? 'Čeština' : 
                                 item.targetLanguage === 'de' ? 'Němčina' : 'Angličtina'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-2 rounded-md">
                              <p className="text-sm line-clamp-2">{item.sourceText}</p>
                            </div>
                            <div className="bg-muted/30 p-2 rounded-md">
                              <p className="text-sm line-clamp-2">{item.translatedText}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleLoadFromHistory(item)}
                            >
                              Použít znovu
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearHistory}
                  disabled={history.length === 0}
                >
                  Vymazat historii
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TranslatorPage;

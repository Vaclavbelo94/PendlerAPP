
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, ArrowRight, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workPhrases } from "@/data/translatorData";

type Language = {
  code: string;
  name: string;
};

const TranslatorPage = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("cs");
  const [targetLanguage, setTargetLanguage] = useState("de");
  const { toast } = useToast();

  const languages: Language[] = [
    { code: "cs", name: "Čeština" },
    { code: "de", name: "Němčina" },
    { code: "en", name: "Angličtina" },
    { code: "pl", name: "Polština" },
    { code: "sk", name: "Slovenština" }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Chyba",
        description: "Zadejte text k překladu",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      // V reálné aplikaci by byl dotaz na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kombinace jazykových párů
      const langPair = `${sourceLanguage}-${targetLanguage}`;
      
      // Základní slovník pro nejčastější fráze ve všech podporovaných jazycích
      const basicTranslations: Record<string, Record<string, string>> = {
        "cs": {
          "ahoj": { de: "Hallo", en: "Hello", pl: "Cześć", sk: "Ahoj" },
          "dobrý den": { de: "Guten Tag", en: "Good day", pl: "Dzień dobry", sk: "Dobrý deň" },
          "děkuji": { de: "Danke", en: "Thank you", pl: "Dziękuję", sk: "Ďakujem" },
          "prosím": { de: "Bitte", en: "Please", pl: "Proszę", sk: "Prosím" },
          "ano": { de: "Ja", en: "Yes", pl: "Tak", sk: "Áno" },
          "ne": { de: "Nein", en: "No", pl: "Nie", sk: "Nie" },
          "jak se máš": { de: "Wie geht es dir", en: "How are you", pl: "Jak się masz", sk: "Ako sa máš" },
          "dobrou noc": { de: "Gute Nacht", en: "Good night", pl: "Dobranoc", sk: "Dobrú noc" },
        },
        "de": {
          "hallo": { cs: "Ahoj", en: "Hello", pl: "Cześć", sk: "Ahoj" },
          "guten tag": { cs: "Dobrý den", en: "Good day", pl: "Dzień dobry", sk: "Dobrý deň" },
          "danke": { cs: "Děkuji", en: "Thank you", pl: "Dziękuję", sk: "Ďakujem" },
        },
        "en": {
          "hello": { cs: "Ahoj", de: "Hallo", pl: "Cześć", sk: "Ahoj" },
          "good day": { cs: "Dobrý den", de: "Guten Tag", pl: "Dzień dobry", sk: "Dobrý deň" },
          "thank you": { cs: "Děkuji", de: "Danke", pl: "Dziękuję", sk: "Ďakujem" },
        },
        "pl": {
          "cześć": { cs: "Ahoj", de: "Hallo", en: "Hello", sk: "Ahoj" },
          "dzień dobry": { cs: "Dobrý den", de: "Guten Tag", en: "Good day", sk: "Dobrý deň" },
          "dziękuję": { cs: "Děkuji", de: "Danke", en: "Thank you", sk: "Ďakujem" },
        },
        "sk": {
          "ahoj": { cs: "Ahoj", de: "Hallo", en: "Hello", pl: "Cześć" },
          "dobrý deň": { cs: "Dobrý den", de: "Guten Tag", en: "Good day", pl: "Dzień dobry" },
          "ďakujem": { cs: "Děkuji", de: "Danke", en: "Thank you", pl: "Dziękuję" },
        }
      };
      
      // Kontrola, zda existuje překlad
      const sourceLang = basicTranslations[sourceLanguage];
      if (sourceLang) {
        const lowerText = sourceText.toLowerCase();
        const translationEntry = sourceLang[lowerText];
        if (translationEntry && translationEntry[targetLanguage]) {
          setTranslatedText(translationEntry[targetLanguage]);
        } else {
          // Mock překlad
          const targetLangName = languages.find(l => l.code === targetLanguage)?.name || targetLanguage;
          setTranslatedText(`${sourceText} [přeloženo do ${targetLangName.toLowerCase()}]`);
        }
      } else {
        // Mock překlad
        const targetLangName = languages.find(l => l.code === targetLanguage)?.name || targetLanguage;
        setTranslatedText(`${sourceText} [přeloženo do ${targetLangName.toLowerCase()}]`);
      }
      
      toast({
        title: "Hotovo",
        description: "Text byl přeložen",
      });
    } catch (error) {
      toast({
        title: "Chyba překladu",
        description: "Nepodařilo se přeložit text. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePhraseSelect = (phrase: string) => {
    setSourceText(phrase);
  };

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Languages className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Překladač</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Přeložte si text mezi několika jazyky pro snazší komunikaci v práci i běžném životě.
          </p>
        </div>
      </section>

      {/* Translator section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="translator" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="translator">Překladač</TabsTrigger>
              <TabsTrigger value="phrases">Užitečné fráze</TabsTrigger>
            </TabsList>

            <TabsContent value="translator">
              <Card>
                <CardHeader>
                  <CardTitle>Překladač</CardTitle>
                  <CardDescription>Vyberte jazyky a vložte text, který chcete přeložit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Zdrojový jazyk</label>
                        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Vyberte jazyk" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={`source-${lang.code}`} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        placeholder={`Zadejte text v ${languages.find(l => l.code === sourceLanguage)?.name || ''}...`}
                        className="h-40 resize-none"
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Cílový jazyk</label>
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Vyberte jazyk" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={`target-${lang.code}`} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        placeholder="Zde se zobrazí přeložený text..."
                        className="h-40 resize-none bg-slate-50"
                        value={translatedText}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={handleTranslate} 
                      disabled={isTranslating}
                      size="lg"
                      className="px-8"
                    >
                      {isTranslating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Překládám...
                        </>
                      ) : (
                        <>
                          Přeložit <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phrases">
              <Card>
                <CardHeader>
                  <CardTitle>Užitečné fráze pro pendlery</CardTitle>
                  <CardDescription>
                    Klikněte na frázi pro přenesení do překladače
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {workPhrases.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <BookOpen className="h-5 w-5" /> 
                          {category.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {category.phrases.map((phrase, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              className="justify-start h-auto py-2 text-left" 
                              onClick={() => handlePhraseSelect(phrase)}
                            >
                              {phrase}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default TranslatorPage;

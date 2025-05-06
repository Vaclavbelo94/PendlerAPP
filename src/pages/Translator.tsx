
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TranslatorPage = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

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
      // In a real app, this would call a translation API
      // For demo purposes, we'll use a simple mock translation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Very simple Czech to German translation examples
      const translations: Record<string, string> = {
        "ahoj": "Hallo",
        "dobrý den": "Guten Tag",
        "děkuji": "Danke",
        "prosím": "Bitte",
        "ano": "Ja",
        "ne": "Nein",
        "jak se máš": "Wie geht es dir",
        "dobrou noc": "Gute Nacht",
      };
      
      // Check if the exact text is in our simple dictionary
      if (translations[sourceText.toLowerCase()]) {
        setTranslatedText(translations[sourceText.toLowerCase()]);
      } else {
        // Mock translation by appending "[přeloženo do němčiny]"
        setTranslatedText(`${sourceText} [přeloženo do němčiny]`);
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

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Languages className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Překladač</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Přeložte si text z češtiny do němčiny pro snazší komunikaci v práci i běžném životě.
          </p>
        </div>
      </section>

      {/* Translator section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>Překladač čeština - němčina</CardTitle>
              <CardDescription>Vložte text, který chcete přeložit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Čeština</label>
                  <Textarea
                    placeholder="Zadejte text v češtině..."
                    className="h-40 resize-none"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Němčina</label>
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
        </div>
      </section>
    </div>
  );
};

export default TranslatorPage;

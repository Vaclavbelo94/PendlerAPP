
import { useState } from "react";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      const translations = {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
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
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Překladač z češtiny do němčiny</CardTitle>
                <CardDescription>
                  Jednoduše zadejte text v češtině a získejte německý překlad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="sourceText">Český text</Label>
                    <Textarea
                      id="sourceText"
                      className="min-h-[100px]"
                      placeholder="Napište text k překladu..."
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      onClick={handleTranslate}
                      disabled={isTranslating}
                      className="mx-auto"
                    >
                      {isTranslating ? "Překládám..." : "Přeložit"}
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="translatedText">Německý překlad</Label>
                    <Textarea
                      id="translatedText"
                      className="min-h-[100px] bg-muted"
                      placeholder="Zde se zobrazí překlad..."
                      value={translatedText}
                      readOnly
                    />
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Pro pokročilejší překlad a konverzace si projděte naši <a href="/language" className="text-primary hover:underline">sekci výuky němčiny</a>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TranslatorPage;

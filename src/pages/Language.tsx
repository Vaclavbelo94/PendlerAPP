
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { grammarExercises } from "@/data/germanExercises";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/components/ui/use-toast";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import LanguageSearchBar from "@/components/language/layout/LanguageSearchBar";
import LanguageTabsNavigation from "@/components/language/layout/LanguageTabsNavigation";
import GrammarTab from "@/components/language/tabs/GrammarTab";
import PhrasesTab from "@/components/language/tabs/PhrasesTab";
import VocabularySection from "@/components/language/VocabularySection";
import InteractiveQuiz from "@/components/language/InteractiveQuiz";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GamificationFeatures from "@/components/language/GamificationFeatures";
import OfflineIndicator from "@/components/offlineMode/OfflineIndicator";
import { Button } from "@/components/ui/button";
import { Download, CloudCheck } from "lucide-react";

const Language = () => {
  const [activeTab, setActiveTab] = useState("grammar");
  const { isPremium, isAdmin } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { toast } = useToast();
  const [offlineStatus, setOfflineStatus] = useState({
    grammarSaved: false,
    vocabularySaved: false,
    phrasesSaved: false
  });
  
  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("xs");

  // Při prvním načtení zkontrolujeme, zda máme uložená offline data
  useEffect(() => {
    const checkOfflineData = () => {
      const savedGrammar = localStorage.getItem('offline_grammar');
      const savedVocabulary = localStorage.getItem('offline_vocabulary');
      const savedPhrases = localStorage.getItem('offline_phrases');
      
      setOfflineStatus({
        grammarSaved: !!savedGrammar,
        vocabularySaved: !!savedVocabulary,
        phrasesSaved: !!savedPhrases
      });
    };
    
    checkOfflineData();
  }, []);

  // Funkce pro stažení dat pro offline použití
  const saveForOffline = (type: 'grammar' | 'vocabulary' | 'phrases') => {
    try {
      switch(type) {
        case 'grammar':
          localStorage.setItem('offline_grammar', JSON.stringify(grammarExercises));
          break;
        case 'vocabulary':
          // Zde by byl kód pro uložení slovní zásoby
          const vocabulary = [
            { word: "der Hund", translation: "pes", example: "Der Hund bellt." },
            { word: "die Katze", translation: "kočka", example: "Die Katze miaut." },
            // ... další slovíčka
          ];
          localStorage.setItem('offline_vocabulary', JSON.stringify(vocabulary));
          break;
        case 'phrases':
          // Zde by byl kód pro uložení frází
          const phrases = [
            { category: "Pozdravy", phrase: "Guten Tag", translation: "Dobrý den" },
            { category: "Pozdravy", phrase: "Auf Wiedersehen", translation: "Na shledanou" },
            // ... další fráze
          ];
          localStorage.setItem('offline_phrases', JSON.stringify(phrases));
          break;
      }
      
      setOfflineStatus(prev => ({
        ...prev,
        [`${type}Saved`]: true
      }));
      
      toast({
        title: "Úspěšně uloženo",
        description: `Data pro ${
          type === 'grammar' ? 'gramatiku' : 
          type === 'vocabulary' ? 'slovní zásobu' : 'fráze'
        } byla uložena pro offline použití.`,
      });
    } catch (error) {
      console.error('Chyba při ukládání offline dat:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit data pro offline použití.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container py-4 sm:py-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {/* Language learning navigation and content */}
        <div className="w-full md:w-2/3 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Výuka německého jazyka</h1>
          
          {activeTab === "grammar" && (
            <LanguageSearchBar grammarExercises={grammarExercises} />
          )}

          {/* Offline indicator/button for the active tab */}
          {!isOffline && (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudCheck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Offline dostupnost</div>
                    <p className="text-sm text-muted-foreground">
                      Stáhněte si materiály pro použití bez připojení k internetu
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => saveForOffline(
                    activeTab === 'grammar' ? 'grammar' : 
                    activeTab === 'vocabulary' ? 'vocabulary' : 
                    activeTab === 'phrases' ? 'phrases' : 'grammar'
                  )}
                  disabled={
                    (activeTab === 'grammar' && offlineStatus.grammarSaved) ||
                    (activeTab === 'vocabulary' && offlineStatus.vocabularySaved) ||
                    (activeTab === 'phrases' && offlineStatus.phrasesSaved) ||
                    activeTab === 'interactive' || 
                    activeTab === 'gamification'
                  }
                  variant="outline"
                  className="h-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {(activeTab === 'grammar' && offlineStatus.grammarSaved) ||
                   (activeTab === 'vocabulary' && offlineStatus.vocabularySaved) ||
                   (activeTab === 'phrases' && offlineStatus.phrasesSaved) 
                    ? "Staženo" 
                    : "Stáhnout pro offline"
                  }
                </Button>
              </CardContent>
            </Card>
          )}
          
          <LanguageTabsNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          >
            <TabsContent value="grammar" className="space-y-4 sm:space-y-6">
              <GrammarTab />
            </TabsContent>
            
            <TabsContent value="vocabulary">
              <VocabularySection />
            </TabsContent>
            
            <TabsContent value="phrases">
              {/* Základní fráze jsou dostupné i v bezplatné verzi */}
              <PhrasesTab />
            </TabsContent>
            
            <TabsContent value="interactive">
              {/* Interaktivní kvíz je pouze pro premium */}
              <PremiumCheck featureKey="language">
                <InteractiveQuiz />
              </PremiumCheck>
            </TabsContent>

            <TabsContent value="gamification">
              {/* Gamifikační záložka */}
              <GamificationFeatures />
            </TabsContent>
          </LanguageTabsNavigation>
        </div>

        {/* Sidebar with additional resources */}
        <div className="w-full md:w-1/3 space-y-4">
          <Card className="overflow-hidden">
            <div className="bg-primary text-primary-foreground p-3 text-lg font-semibold">
              Studijní materiály
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium">Doporučené učebnice</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Sprechen Sie Deutsch? 1</li>
                  <li>• Moderní učebnice němčiny</li>
                  <li>• Němčina pro samouky</li>
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Online zdroje</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Duolingo</li>
                  <li>• Deutsche Welle - Learn German</li>
                  <li>• Memrise</li>
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Jazykové úrovně</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-muted rounded text-center">A1</div>
                  <div className="p-2 bg-muted rounded text-center">A2</div>
                  <div className="p-2 bg-muted rounded text-center">B1</div>
                  <div className="p-2 bg-muted rounded text-center">B2</div>
                  <div className="p-2 bg-muted rounded text-center">C1</div>
                  <div className="p-2 bg-muted rounded text-center">C2</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="bg-primary text-primary-foreground p-3 text-lg font-semibold">
              Jazykový tip dne
            </div>
            <CardContent className="p-4">
              <p className="italic">
                "V němčině se podstatná jména píší vždy s velkým počátečním písmenem - 
                nejen vlastní jména, ale i obecná."
              </p>
              <div className="mt-3 text-sm space-y-1">
                <p><strong>Příklad:</strong></p>
                <p>das Haus (dům)</p>
                <p>die Straße (ulice)</p>
                <p>der Computer (počítač)</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Offline Status Card */}
          {!isOffline && (
            <Card>
              <div className="bg-primary text-primary-foreground p-3 text-lg font-semibold">
                Offline dostupnost
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gramatika:</span> 
                    <span className={offlineStatus.grammarSaved ? "text-green-500" : "text-amber-500"}>
                      {offlineStatus.grammarSaved ? "Staženo" : "Nestaženo"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slovní zásoba:</span> 
                    <span className={offlineStatus.vocabularySaved ? "text-green-500" : "text-amber-500"}>
                      {offlineStatus.vocabularySaved ? "Staženo" : "Nestaženo"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fráze:</span> 
                    <span className={offlineStatus.phrasesSaved ? "text-green-500" : "text-amber-500"}>
                      {offlineStatus.phrasesSaved ? "Staženo" : "Nestaženo"}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    saveForOffline('grammar');
                    saveForOffline('vocabulary');
                    saveForOffline('phrases');
                  }}
                  disabled={
                    offlineStatus.grammarSaved && 
                    offlineStatus.vocabularySaved && 
                    offlineStatus.phrasesSaved
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Stáhnout vše
                </Button>
                <p className="text-xs text-muted-foreground">
                  Data budou uložena v paměti vašeho zařízení a budou dostupná i bez připojení k internetu.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Offline indicator component */}
      <OfflineIndicator />
    </div>
  );
};

export default Language;

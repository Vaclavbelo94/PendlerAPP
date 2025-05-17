
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { grammarExercises } from "@/data/germanExercises";
import { useMediaQuery } from "@/hooks/use-media-query";
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

const Language = () => {
  const [activeTab, setActiveTab] = useState("grammar");
  const { isPremium, isAdmin } = useAuth();
  
  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("xs");

  return (
    <div className="container py-4 sm:py-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {/* Language learning navigation and content */}
        <div className="w-full md:w-2/3 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Výuka německého jazyka</h1>
          
          {activeTab === "grammar" && (
            <LanguageSearchBar grammarExercises={grammarExercises} />
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
              {/* Nová gamifikační záložka */}
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
        </div>
      </div>
    </div>
  );
};

export default Language;

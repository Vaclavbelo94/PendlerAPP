
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

const Language = () => {
  const [activeTab, setActiveTab] = useState("grammar");
  const { isPremium, isAdmin } = useAuth();
  
  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("xs");

  return (
    <div className="container py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Výuka německého jazyka</h1>
      
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
      </LanguageTabsNavigation>
    </div>
  );
};

export default Language;

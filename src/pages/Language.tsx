
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { useAuth } from "@/hooks/useAuth";
import LanguageSearchBar from "@/components/language/layout/LanguageSearchBar";
import LanguageTabsNavigation from "@/components/language/layout/LanguageTabsNavigation";
import GrammarTab from "@/components/language/tabs/GrammarTab";
import PhrasesTab from "@/components/language/tabs/PhrasesTab";
import VocabularySection from "@/components/language/VocabularySection";
import InteractiveQuiz from "@/components/language/InteractiveQuiz";
import PremiumCheck from "@/components/premium/PremiumCheck";
import GamificationFeatures from "@/components/language/GamificationFeatures";
import OfflineIndicator from "@/components/offlineMode/OfflineIndicator";
import OfflineDownloadCard from "@/components/language/OfflineDownloadCard";
import LanguageSidebar from "@/components/language/LanguageSidebar";
import LanguageManager, { useLanguageContext } from "@/components/language/LanguageManager";
import GamificationSummary from "@/components/language/GamificationSummary";
import { PremiumBadge } from "@/components/premium/PremiumBadge";
import { Button } from "@/components/ui/button";
import { Languages, FileText, BookOpen, GraduationCap, ChevronRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LanguageContent = () => {
  const navigate = useNavigate();
  const { isPremium, isAdmin } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { activeTab, setActiveTab, offlineStatus, saveForOffline } = useLanguageContext();
  
  // Použití media query pro detekci mobilních zařízení
  const isMobile = useMediaQuery("xs");

  // Funkce pro vykreslení premium badgů pro specifické záložky
  const renderPremiumBadge = (tabName: string) => {
    const premiumTabs = ['interactive', 'gamification'];
    if (premiumTabs.includes(tabName)) {
      return <PremiumBadge variant="compact" className="ml-2" />;
    }
    return null;
  };

  return (
    <div className="container max-w-screen-lg mx-auto px-2 sm:px-4 py-2 sm:py-4">
      {/* Vylepšená rychlá navigace - upravená pro mobilní zařízení */}
      <div className="mb-3 sm:mb-4 p-1.5 sm:p-2 rounded-lg bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
        <div className="flex items-center">
          <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="font-medium text-xs sm:text-sm">Rychlá navigace:</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-6 px-1.5 sm:text-sm sm:h-7 sm:px-2"
            onClick={() => setActiveTab("grammar")}
          >
            <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Gramatika</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-6 px-1.5 sm:text-sm sm:h-7 sm:px-2"
            onClick={() => setActiveTab("vocabulary")}
          >
            <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Slovíčka</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-6 px-1.5 sm:text-sm sm:h-7 sm:px-2"
            onClick={() => setActiveTab("phrases")}
          >
            <Languages className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Fráze</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-6 px-1.5 sm:text-sm sm:h-7 sm:px-2 bg-primary/10 hover:bg-primary/20 border-primary/30"
            onClick={() => setActiveTab("gamification")}
          >
            <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Pokroky</span>
          </Button>
        </div>
      </div>
      
      {/* Gamifikační přehled - zobrazí se pouze na hlavní stránce */}
      {activeTab === "grammar" && !isMobile && (
        <div className="mb-3 sm:mb-4">
          <GamificationSummary />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start">
        {/* Výuka jazyka - navigace a obsah */}
        <div className="w-full md:w-2/3 space-y-3 sm:space-y-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Výuka německého jazyka</h1>
          
          {activeTab === "grammar" && (
            <LanguageSearchBar grammarExercises={[]} />
          )}

          {/* Tlačítko pro offline režim pro aktivní záložku */}
          {!isOffline && (
            <OfflineDownloadCard 
              activeTab={activeTab} 
              offlineStatus={offlineStatus}
              saveForOffline={saveForOffline}
            />
          )}
          
          <LanguageTabsNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            renderBadge={renderPremiumBadge}
          >
            <TabsContent value="grammar" className="space-y-3 sm:space-y-4">
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
                <div className="mb-3">
                  <PremiumBadge variant="rounded" />
                </div>
                <InteractiveQuiz />
              </PremiumCheck>
            </TabsContent>

            <TabsContent value="gamification">
              {/* Vylepšená gamifikační záložka */}
              <div className="mb-3">
                <PremiumBadge variant="rounded" />
              </div>
              <GamificationFeatures />
            </TabsContent>
          </LanguageTabsNavigation>
        </div>

        {/* Postranní panel s dalšími zdroji - skrytý na mobilu */}
        {!isMobile && (
          <LanguageSidebar 
            offlineStatus={offlineStatus}
            isOffline={isOffline}
            saveForOffline={saveForOffline}
          />
        )}
      </div>
      
      {/* Indikátor offline režimu */}
      <OfflineIndicator />
    </div>
  );
};

const Language = () => {
  return (
    <LanguageManager>
      <LanguageContent />
    </LanguageManager>
  );
};

export default Language;


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
  
  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("xs");

  // Function to render premium badge for specific tabs
  const renderPremiumBadge = (tabName: string) => {
    const premiumTabs = ['interactive', 'gamification'];
    if (premiumTabs.includes(tabName)) {
      return <PremiumBadge variant="compact" className="ml-2" />;
    }
    return null;
  };

  return (
    <div className="container py-4 sm:py-6">
      {/* Enhanced Quick Navigation */}
      <div className="mb-6 p-3 rounded-lg bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          <span className="font-medium">Rychlá navigace:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setActiveTab("grammar")}
          >
            <BookOpen className="h-4 w-4" />
            <span>Gramatika</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setActiveTab("vocabulary")}
          >
            <FileText className="h-4 w-4" />
            <span>Slovíčka</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setActiveTab("phrases")}
          >
            <Languages className="h-4 w-4" />
            <span>Fráze</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 border-primary/30"
            onClick={() => setActiveTab("gamification")}
          >
            <Trophy className="h-4 w-4" />
            <span>Pokroky</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => navigate("/translator")}
          >
            <ChevronRight className="h-4 w-4" />
            <span>Překladač</span>
          </Button>
        </div>
      </div>
      
      {/* Gamifikační přehled - zobrazí se pouze na hlavní stránce */}
      {activeTab === "grammar" && (
        <GamificationSummary />
      )}
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {/* Language learning navigation and content */}
        <div className="w-full md:w-2/3 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Výuka německého jazyka</h1>
          
          {activeTab === "grammar" && (
            <LanguageSearchBar grammarExercises={[]} />
          )}

          {/* Offline indicator/button for the active tab */}
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
                <div className="mb-4">
                  <PremiumBadge variant="rounded" />
                </div>
                <InteractiveQuiz />
              </PremiumCheck>
            </TabsContent>

            <TabsContent value="gamification">
              {/* Vylepšená gamifikační záložka */}
              <div className="mb-4">
                <PremiumBadge variant="rounded" />
              </div>
              <GamificationFeatures />
            </TabsContent>
          </LanguageTabsNavigation>
        </div>

        {/* Sidebar with additional resources */}
        <LanguageSidebar 
          offlineStatus={offlineStatus}
          isOffline={isOffline}
          saveForOffline={saveForOffline}
        />
      </div>
      
      {/* Offline indicator component */}
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


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
import { PremiumBadge } from "@/components/premium/PremiumBadge";

const LanguageContent = () => {
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
              {/* Gamifikační záložka */}
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

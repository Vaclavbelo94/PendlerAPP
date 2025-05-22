
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { useAuth } from "@/hooks/useAuth";
import LanguageTabsNavigation from "@/components/language/layout/LanguageTabsNavigation";
import GrammarTab from "@/components/language/tabs/GrammarTab";
import PhrasesTab from "@/components/language/tabs/PhrasesTab";
import VocabularySection from "@/components/language/VocabularySection";
import OfflineIndicator from "@/components/offlineMode/OfflineIndicator";
import OfflineDownloadCard from "@/components/language/OfflineDownloadCard";
import LanguageSidebar from "@/components/language/LanguageSidebar";
import LanguageManager, { useLanguageContext } from "@/components/language/LanguageManager";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Languages } from "lucide-react";

const LanguageContent = () => {
  const { isPremium } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { activeTab, setActiveTab, offlineStatus, saveForOffline } = useLanguageContext();
  
  // Použití media query pro detekci mobilních zařízení
  const isMobile = useMediaQuery("xs");

  return (
    <div className="container max-w-screen-lg mx-auto px-2 sm:px-4 py-2 sm:py-4">
      {/* Zjednodušená navigace */}
      <div className="mb-3 sm:mb-4 p-1.5 sm:p-2 rounded-lg bg-muted/30 flex flex-wrap gap-2">
        <Button
          variant={activeTab === "grammar" ? "secondary" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setActiveTab("grammar")}
        >
          <BookOpen className="h-4 w-4" />
          <span>Gramatika</span>
        </Button>
        <Button
          variant={activeTab === "vocabulary" ? "secondary" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setActiveTab("vocabulary")}
        >
          <FileText className="h-4 w-4" />
          <span>Slovíčka</span>
        </Button>
        <Button
          variant={activeTab === "phrases" ? "secondary" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setActiveTab("phrases")}
        >
          <Languages className="h-4 w-4" />
          <span>Fráze</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start">
        {/* Výuka jazyka - navigace a obsah */}
        <div className="w-full md:w-2/3 space-y-3 sm:space-y-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Německý jazyk</h1>
          
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
          >
            <TabsContent value="grammar" className="space-y-3 sm:space-y-4">
              <GrammarTab />
            </TabsContent>
            
            <TabsContent value="vocabulary">
              <VocabularySection />
            </TabsContent>
            
            <TabsContent value="phrases">
              <PhrasesTab />
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

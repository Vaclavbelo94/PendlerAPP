
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BookOpenIcon,
  ListIcon,
  MessageSquareIcon,
  FileTextIcon,
  TrophyIcon,
  BarChartIcon
} from "lucide-react";

// Import existing components
import VocabularySection from "@/components/language/VocabularySection";
import GrammarTab from "@/components/language/tabs/GrammarTab";
import PhrasesTab from "@/components/language/tabs/PhrasesTab";
import VocabularyProgressDashboard from "@/components/language/VocabularyProgressDashboard";
import GamificationFeatures from "@/components/language/GamificationFeatures";

const Language = () => {
  const [activeTab, setActiveTab] = useState("vocabulary");
  const isMobile = useIsMobile();

  // Mock data for components that need props
  const mockVocabularyCount = 150;
  const mockProgress = {
    dailyStats: [
      { date: new Date().toISOString(), wordsLearned: 5, timeSpent: 25, accuracy: 85 },
      { date: new Date(Date.now() - 86400000).toISOString(), wordsLearned: 8, timeSpent: 30, accuracy: 92 },
      { date: new Date(Date.now() - 172800000).toISOString(), wordsLearned: 3, timeSpent: 15, accuracy: 78 }
    ],
    totalReviewed: 127,
    streakDays: 5,
    averageAccuracy: 87,
    categoryDistribution: {
      "Základy": 45,
      "Práce": 32,
      "Čísla": 28,
      "Technika": 15
    },
    difficultyDistribution: {
      easy: 68,
      medium: 52,
      hard: 23,
      unspecified: 7
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Switching to tab: ${value}`);
  };

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Němčina</h1>
        <p className="text-muted-foreground">
          Učte se německý jazyk efektivně s našimi interaktivními nástroji
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} ${isMobile ? 'max-w-full' : 'max-w-6xl'} h-auto`}>
          <TabsTrigger value="vocabulary" className="flex flex-col items-center gap-1 py-3 px-4">
            <BookOpenIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Slovíčka</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Učení slov</span>
          </TabsTrigger>
          <TabsTrigger value="grammar" className="flex flex-col items-center gap-1 py-3 px-4">
            <FileTextIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Gramatika</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Pravidla jazyka</span>
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex flex-col items-center gap-1 py-3 px-4">
            <MessageSquareIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Fráze</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Užitečné fráze</span>
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="progress" className="flex flex-col items-center gap-1 py-3 px-4">
                <BarChartIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Pokrok</span>
                <span className="text-xs text-muted-foreground hidden sm:block">Statistiky</span>
              </TabsTrigger>
              <TabsTrigger value="gamification" className="flex flex-col items-center gap-1 py-3 px-4">
                <TrophyIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Výzvy</span>
                <span className="text-xs text-muted-foreground hidden sm:block">Herní prvky</span>
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex flex-col items-center gap-1 py-3 px-4">
                <ListIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Cvičení</span>
                <span className="text-xs text-muted-foreground hidden sm:block">Interaktivní úkoly</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="vocabulary" className="space-y-6">
          <VocabularySection />
        </TabsContent>

        <TabsContent value="grammar" className="space-y-6">
          <GrammarTab />
        </TabsContent>

        <TabsContent value="phrases" className="space-y-6">
          <PhrasesTab />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <VocabularyProgressDashboard 
            vocabularyCount={mockVocabularyCount}
            progress={mockProgress}
          />
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          <GamificationFeatures />
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Cvičení přijdou brzy</h3>
            <p className="text-muted-foreground">Připravujeme interaktivní cvičení pro lepší učení</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Language;

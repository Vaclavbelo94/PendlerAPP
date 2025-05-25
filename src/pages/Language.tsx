
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { UniversalMobileNavigation } from "@/components/navigation/UniversalMobileNavigation";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "vocabulary";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isMobile } = useScreenOrientation();

  const languageTabs = [
    {
      id: "vocabulary",
      label: "Slovíčka",
      icon: BookOpenIcon,
      description: "Učení německých slov"
    },
    {
      id: "grammar",
      label: "Gramatika",
      icon: FileTextIcon,
      description: "Pravidla německého jazyka"
    },
    {
      id: "phrases",
      label: "Fráze",
      icon: MessageSquareIcon,
      description: "Užitečné německé fráze"
    },
    {
      id: "exercises",
      label: "Cvičení",
      icon: ListIcon,
      description: "Interaktivní jazykové úkoly"
    }
  ];

  // Mock data for components that need props
  const mockVocabularyCount = 150;
  const mockProgress = {
    dailyStats: [
      { 
        date: new Date().toISOString(), 
        wordsReviewed: 8, 
        correctCount: 6, 
        incorrectCount: 2 
      },
      { 
        date: new Date(Date.now() - 86400000).toISOString(), 
        wordsReviewed: 12, 
        correctCount: 10, 
        incorrectCount: 2 
      },
      { 
        date: new Date(Date.now() - 172800000).toISOString(), 
        wordsReviewed: 5, 
        correctCount: 3, 
        incorrectCount: 2 
      }
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
    setSearchParams({ tab: value });
    console.log(`Switching to tab: ${value}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "vocabulary":
        return <VocabularySection />;
      case "grammar":
        return <GrammarTab />;
      case "phrases":
        return <PhrasesTab />;
      case "exercises":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Cvičení přijdou brzy</h3>
            <p className="text-muted-foreground">Připravujeme interaktivní cvičení pro lepší učení</p>
          </div>
        );
      default:
        return <VocabularySection />;
    }
  };

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Němčina</h1>
        <p className="text-muted-foreground">
          Učte se německý jazyk efektivně s našimi interaktivními nástroji
        </p>
      </div>

      <UniversalMobileNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={languageTabs}
      />

      <div className="space-y-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Language;

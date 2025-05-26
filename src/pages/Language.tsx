
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { UniversalMobileNavigation } from "@/components/navigation/UniversalMobileNavigation";
import { ErrorBoundaryWithFallback } from "@/components/common/ErrorBoundaryWithFallback";
import FastLoadingFallback from "@/components/common/FastLoadingFallback";
import {
  BookOpenIcon,
  ListIcon,
  MessageSquareIcon,
  FileTextIcon,
} from "lucide-react";

// Optimized lazy loading
const VocabularySection = React.lazy(() => 
  import("@/components/language/VocabularySection").catch(err => {
    console.error('Failed to load VocabularySection:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Slovní zásoba se nenačetla</div> };
  })
);

const GrammarTab = React.lazy(() => 
  import("@/components/language/tabs/GrammarTab").catch(err => {
    console.error('Failed to load GrammarTab:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Gramatika se nenačetla</div> };
  })
);

const PhrasesTab = React.lazy(() => 
  import("@/components/language/tabs/PhrasesTab").catch(err => {
    console.error('Failed to load PhrasesTab:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Fráze se nenačetly</div> };
  })
);

const ExercisesTab = React.lazy(() => 
  import("@/components/language/tabs/ExercisesTab").catch(err => {
    console.error('Failed to load ExercisesTab:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Cvičení se nenačetla</div> };
  })
);

const Language = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "vocabulary";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isMobile } = useScreenOrientation();

  console.log('Language page rendering, activeTab:', activeTab);

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

  const handleTabChange = (value: string) => {
    console.log(`Language: Switching to tab: ${value}`);
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const renderTabContent = () => {
    console.log('Language: Rendering tab content for:', activeTab);
    
    switch (activeTab) {
      case "vocabulary":
        return (
          <React.Suspense fallback={<FastLoadingFallback message="Načítám slovní zásobu..." />}>
            <VocabularySection />
          </React.Suspense>
        );
      case "grammar":
        return (
          <React.Suspense fallback={<FastLoadingFallback message="Načítám gramatiku..." />}>
            <GrammarTab />
          </React.Suspense>
        );
      case "phrases":
        return (
          <React.Suspense fallback={<FastLoadingFallback message="Načítám fráze..." />}>
            <PhrasesTab />
          </React.Suspense>
        );
      case "exercises":
        return (
          <React.Suspense fallback={<FastLoadingFallback message="Načítám cvičení..." />}>
            <ExercisesTab />
          </React.Suspense>
        );
      default:
        return (
          <React.Suspense fallback={<FastLoadingFallback message="Načítám slovní zásobu..." />}>
            <VocabularySection />
          </React.Suspense>
        );
    }
  };

  return (
    <ErrorBoundaryWithFallback>
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
          <ErrorBoundaryWithFallback>
            {renderTabContent()}
          </ErrorBoundaryWithFallback>
        </div>
      </div>
    </ErrorBoundaryWithFallback>
  );
};

export default Language;

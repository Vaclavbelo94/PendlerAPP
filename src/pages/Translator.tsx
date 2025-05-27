
import React, { useState, Suspense } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Bot } from "lucide-react";
import { useTranslator } from "@/hooks/useTranslator";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import TranslatorNavigation from "@/components/translator/TranslatorNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { workPhrases } from "@/data/translatorData";
import SimpleLoadingSpinner from "@/components/loading/SimpleLoadingSpinner";

// Lazy load components for better performance
const AIChatInterface = React.lazy(() => import("@/components/translator/AIChatInterface"));
const QuickTranslation = React.lazy(() => import("@/components/translator/QuickTranslation"));
const TranslationHistory = React.lazy(() => import("@/components/translator/TranslationHistory"));
const PhrasesTranslation = React.lazy(() => import("@/components/translator/PhrasesTranslation"));

const TranslatorSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-2/3" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <Skeleton className="h-12 w-full" />
  </div>
);

const Translator = () => {
  const [activeTab, setActiveTab] = useState("ai-chat");
  const [phrasesTab, setPhrasesTab] = useState("workplace");
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  
  usePerformanceOptimization();
  
  const {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isTranslating,
    history,
    autoTranslate,
    setAutoTranslate,
    handleTranslate,
    handleSwapLanguages,
    handleTextToSpeech,
    handleLoadFromHistory,
    handleClearHistory,
    handleUsePhrase
  } = useTranslator();

  const languagePairs = [
    { code: "cs", name: "Čeština" },
    { code: "de", name: "Němčina" },
    { code: "en", name: "Angličtina" },
    { code: "sk", name: "Slovenština" },
    { code: "pl", name: "Polština" }
  ];

  const useMobileLayout = isMobile || isSmallLandscape;

  const renderTabContent = () => {
    switch (activeTab) {
      case "ai-chat":
        return (
          <Suspense fallback={<SimpleLoadingSpinner message="Načítání AI překladače..." />}>
            <AIChatInterface onTextToSpeech={handleTextToSpeech} />
          </Suspense>
        );
      case "quick-translate":
        return (
          <Suspense fallback={<TranslatorSkeleton />}>
            <QuickTranslation
              sourceText={sourceText}
              setSourceText={setSourceText}
              translatedText={translatedText}
              sourceLanguage={sourceLanguage}
              setSourceLanguage={setSourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              autoTranslate={autoTranslate}
              setAutoTranslate={setAutoTranslate}
              isTranslating={isTranslating}
              handleTranslate={handleTranslate}
              handleSwapLanguages={handleSwapLanguages}
              handleTextToSpeech={handleTextToSpeech}
              languagePairs={languagePairs}
            />
          </Suspense>
        );
      case "phrasebook":
        return (
          <Suspense fallback={<TranslatorSkeleton />}>
            <PhrasesTranslation 
              workPhrases={workPhrases}
              phrasesTab={phrasesTab}
              setPhrasesTab={setPhrasesTab}
              handleUsePhrase={handleUsePhrase}
            />
          </Suspense>
        );
      case "history":
        return (
          <Suspense fallback={<TranslatorSkeleton />}>
            <TranslationHistory
              history={history}
              handleLoadFromHistory={handleLoadFromHistory}
              handleClearHistory={handleClearHistory}
            />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<SimpleLoadingSpinner message="Načítání AI překladače..." />}>
            <AIChatInterface onTextToSpeech={handleTextToSpeech} />
          </Suspense>
        );
    }
  };

  return (
    <PremiumCheck featureKey="translator">
      <div className={`container py-6 ${useMobileLayout ? 'pb-32' : ''} ${isSmallLandscape ? 'px-2' : ''}`}>
        <Helmet>
          <title>AI Překladač | Pendler Buddy</title>
          <meta name="description" content="Inteligentní AI asistent pro češtinu a němčinu. Překlady s kontextovým vysvětlením pro pendlery v Německu." />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Helmet>
        
        <div className={`flex items-center gap-3 mb-4 ${isSmallLandscape ? 'mb-2' : ''}`}>
          <div className="p-2 rounded-full bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h1 className={`${useMobileLayout ? 'text-2xl' : 'text-3xl'} font-bold`}>
            AI Překladač
          </h1>
        </div>
        
        <p className={`text-muted-foreground ${useMobileLayout ? 'text-base mb-4' : 'text-lg mb-6'} max-w-3xl ${isSmallLandscape ? 'mb-2 text-sm' : ''}`}>
          {useMobileLayout 
            ? 'Inteligentní AI asistent pro překlady a výuku němčiny.'
            : 'Váš inteligentní AI asistent pro překládání mezi češtinou a němčinou s kontextovým vysvětlením a praktickými radami.'
          }
        </p>

        <TranslatorNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </PremiumCheck>
  );
};

export default Translator;

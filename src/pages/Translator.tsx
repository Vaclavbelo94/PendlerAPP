
import React, { Suspense } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Bot } from "lucide-react";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import SimpleLoadingSpinner from "@/components/loading/SimpleLoadingSpinner";

// Lazy load the simple auto translator
const SimpleAutoTranslator = React.lazy(() => import("@/components/translator/SimpleAutoTranslator"));

const Translator = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  
  usePerformanceOptimization();

  const handleTextToSpeech = (text: string, language: string) => {
    if (!text.trim()) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  };

  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <PremiumCheck featureKey="translator">
      <div className={`container py-6 ${useMobileLayout ? 'pb-32' : ''} ${isSmallLandscape ? 'px-2' : ''}`}>
        <Helmet>
          <title>AI Překladač CZ/PL → DE | Pendlerův Pomocník</title>
          <meta name="description" content="Automatický překladač z češtiny a polštiny do němčiny pro pendlery v Německu." />
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
        
        <p className={`text-muted-foreground ${useMobileLayout ? 'text-base mb-6' : 'text-lg mb-8'} max-w-3xl ${isSmallLandscape ? 'mb-4 text-sm' : ''}`}>
          {useMobileLayout 
            ? 'Automatický překladač z češtiny a polštiny do němčiny.'
            : 'Automatický AI překladač, který převede váš český nebo polský text do němčiny. Ideální pro rychlou komunikaci v Německu.'
          }
        </p>

        <div className="space-y-6">
          <Suspense fallback={<SimpleLoadingSpinner message="Načítání překladače..." />}>
            <SimpleAutoTranslator onTextToSpeech={handleTextToSpeech} />
          </Suspense>
        </div>
      </div>
    </PremiumCheck>
  );
};

export default Translator;

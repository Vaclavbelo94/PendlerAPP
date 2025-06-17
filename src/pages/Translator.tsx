
import React, { Suspense } from 'react';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import PremiumCheck from "@/components/premium/PremiumCheck";
import { DashboardBackground } from "@/components/common/DashboardBackground";
import { Bot, Languages } from "lucide-react";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useLanguage } from "@/hooks/useLanguage";
import SimpleLoadingSpinner from "@/components/loading/SimpleLoadingSpinner";

// Lazy load the simple auto translator
const SimpleAutoTranslator = React.lazy(() => import("@/components/translator/SimpleAutoTranslator"));

const Translator = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const { t } = useLanguage();
  
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
      <DashboardBackground variant="default">
        <div className={`container py-6 ${useMobileLayout ? 'pb-32' : ''} ${isSmallLandscape ? 'px-2' : ''}`}>
          <Helmet>
            <title>AI Překladač CZ/PL → DE | Pendlerův Pomocník</title>
            <meta name="description" content="Automatický překladač z češtiny a polštiny do němčiny pro pendlery v Německu." />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          </Helmet>
          
          {/* Header with consistent styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 backdrop-blur-sm">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
                <Languages className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h1 className={`${useMobileLayout ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-bold mb-4`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
                AI Překladač
              </span>
            </h1>
            
            <p className={`text-muted-foreground ${useMobileLayout ? 'text-base' : 'text-lg lg:text-xl'} max-w-3xl mx-auto leading-relaxed ${isSmallLandscape ? 'text-sm' : ''}`}>
              {useMobileLayout 
                ? 'Automatický překladač z češtiny a polštiny do němčiny pro komunikaci s německým zaměstnavatelem.'
                : 'Automatický AI překladač, který převede váš český nebo polský text do němčiny. Ideální pro rychlou a přesnou komunikaci s německým zaměstnavatelem nebo úřady.'
              }
            </p>
          </motion.div>

          {/* Translator component with animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <Suspense fallback={
              <div className="flex items-center justify-center py-16">
                <SimpleLoadingSpinner text="Načítání překladače..." />
              </div>
            }>
              <SimpleAutoTranslator onTextToSpeech={handleTextToSpeech} />
            </Suspense>
          </motion.div>

          {/* Additional info section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="max-w-2xl mx-auto p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Jak překladač funguje?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Napište text v češtině nebo polštině a automaticky se přeloží do němčiny pomocí AI. 
                Můžete si nechat překlad přečíst nahlas nebo jej odeslat přímo na email.
              </p>
            </div>
          </motion.div>
        </div>
      </DashboardBackground>
    </PremiumCheck>
  );
};

export default Translator;


import React, { Suspense } from 'react';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import PremiumCheck from "@/components/premium/PremiumCheck";
import { DashboardBackground } from "@/components/common/DashboardBackground";
import { Bot, Languages } from "lucide-react";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import SimpleLoadingSpinner from "@/components/loading/SimpleLoadingSpinner";
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';

// Lazy load the simple auto translator
const SimpleAutoTranslator = React.lazy(() => import("@/components/translator/SimpleAutoTranslator"));

const Translator = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const { t } = useTranslation(['translator', 'common']);
  
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
    <Layout navbarRightContent={<NavbarRightContent />}>
      <PremiumCheck featureKey="translator">
        <DashboardBackground variant="default">
          <div className={`container py-6 ${useMobileLayout ? 'pb-32' : ''} ${isSmallLandscape ? 'px-2' : ''}`}>
            <Helmet>
              <title>{t('translator:title')} | {t('common:dashboard')}</title>
              <meta name="description" content={t('translator:translatorDescription')} />
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
                  {t('translator:title')}
                </span>
              </h1>
              
              <p className={`text-muted-foreground ${useMobileLayout ? 'text-base' : 'text-lg lg:text-xl'} max-w-3xl mx-auto leading-relaxed ${isSmallLandscape ? 'text-sm' : ''}`}>
                {useMobileLayout 
                  ? t('translator:translatorDescriptionMobile')
                  : t('translator:translatorDescription')
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
                  <SimpleLoadingSpinner message={t('translator:translating')} />
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
                  {t('translator:howTranslatorWorks')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('translator:translatorInstructions')}
                </p>
              </div>
            </motion.div>
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default Translator;

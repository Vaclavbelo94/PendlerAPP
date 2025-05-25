
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages } from "lucide-react";
import { useTranslator } from "@/hooks/useTranslator";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import TextTranslation from "@/components/translator/TextTranslation";
import MobileTextTranslation from "@/components/translator/MobileTextTranslation";
import TranslationHistory from "@/components/translator/TranslationHistory";
import PhrasesTranslation from "@/components/translator/PhrasesTranslation";

const Translator = () => {
  const [activeTab, setActiveTab] = useState("translator");
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  
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

  // Use mobile layout for mobile devices or small landscape screens
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <PremiumCheck featureKey="translator">
      <div className={`container py-6 ${useMobileLayout ? 'pb-32' : ''}`}>
        <Helmet>
          <title>Překladač | Pendler Buddy</title>
        </Helmet>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Languages className="h-6 w-6 text-primary" />
          </div>
          <h1 className={`${useMobileLayout ? 'text-2xl' : 'text-3xl'} font-bold`}>
            Překladač
          </h1>
        </div>
        
        <p className={`text-muted-foreground ${useMobileLayout ? 'text-base mb-4' : 'text-lg mb-6'} max-w-3xl`}>
          {useMobileLayout 
            ? 'Přeložte texty mezi jazyky pro lepší komunikaci.'
            : 'Přeložte texty mezi češtinou a němčinou pro lepší porozumění v práci a každodenní komunikaci.'
          }
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`${useMobileLayout ? 'grid w-full grid-cols-3' : ''}`}>
            <TabsTrigger value="translator" className={useMobileLayout ? 'text-xs' : ''}>
              {useMobileLayout ? 'Překladač' : 'Překladač'}
            </TabsTrigger>
            <TabsTrigger value="phrasebook" className={useMobileLayout ? 'text-xs' : ''}>
              {useMobileLayout ? 'Fráze' : 'Frázovník'}
            </TabsTrigger>
            <TabsTrigger value="history" className={useMobileLayout ? 'text-xs' : ''}>
              Historie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator">
            {useMobileLayout ? (
              <MobileTextTranslation
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
            ) : (
              <TextTranslation
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
            )}
          </TabsContent>
          
          <TabsContent value="phrasebook">
            <PhrasesTranslation onUsePhrase={handleUsePhrase} />
          </TabsContent>
          
          <TabsContent value="history">
            <TranslationHistory
              history={history}
              onLoadFromHistory={handleLoadFromHistory}
              onClearHistory={handleClearHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default Translator;

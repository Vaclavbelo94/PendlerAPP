
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Languages, History } from "lucide-react";
import PremiumCheck from '@/components/premium/PremiumCheck';
import { workPhrases } from '@/data/translatorData';
import TextTranslation from '@/components/translator/TextTranslation';
import PhrasesTranslation from '@/components/translator/PhrasesTranslation';
import TranslationHistory from '@/components/translator/TranslationHistory';
import { useTranslator } from '@/hooks/useTranslator';
import { PremiumBadge } from '@/components/premium/PremiumBadge';

const TranslatorPage = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [phrasesTab, setPhrasesTab] = useState("workplace");
  
  const {
    sourceText,
    setSourceText,
    translatedText,
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

  return (
    <PremiumCheck featureKey="translator">
      <div className="container py-6 md:py-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">Překladač</h1>
          <PremiumBadge />
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="phrases" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Fráze</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Historie</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Text Translation Tab */}
          <TabsContent value="text" className="space-y-6">
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
            />
          </TabsContent>
          
          {/* Common Phrases Tab */}
          <TabsContent value="phrases" className="space-y-6">
            <PhrasesTranslation
              workPhrases={workPhrases}
              phrasesTab={phrasesTab}
              setPhrasesTab={setPhrasesTab}
              handleUsePhrase={handleUsePhrase}
            />
          </TabsContent>

          {/* Translation History Tab */}
          <TabsContent value="history" className="space-y-6">
            <TranslationHistory
              history={history}
              handleLoadFromHistory={handleLoadFromHistory}
              handleClearHistory={handleClearHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TranslatorPage;


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Languages, History, ArrowLeftRight } from "lucide-react";
import PremiumCheck from '@/components/premium/PremiumCheck';
import { workPhrases, languagePairs } from '@/data/translatorData';
import TextTranslation from '@/components/translator/TextTranslation';
import PhrasesTranslation from '@/components/translator/PhrasesTranslation';
import TranslationHistory from '@/components/translator/TranslationHistory';
import { useTranslator } from '@/hooks/useTranslator';
import { PremiumBadge } from '@/components/premium/PremiumBadge';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TranslatorPage = () => {
  const navigate = useNavigate();
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
        {/* Enhanced Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold">Překladač</h1>
            <PremiumBadge />
          </div>
          
          <NavigationMenu className="w-full sm:w-auto">
            <NavigationMenuList className="w-full sm:w-auto">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-muted/40">Rychlé přechody</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 w-[220px] md:w-[320px]">
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center gap-2 text-left w-full" 
                      onClick={() => navigate("/language")}
                    >
                      <Languages className="h-4 w-4" />
                      <span>Výuka jazyka</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center gap-2 text-left w-full" 
                      onClick={() => navigate("/language")}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Užitečné fráze</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center gap-2 text-left w-full"
                      onClick={() => {
                        setActiveTab("phrases");
                      }}
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                      <span>Rychlý překlad frází</span>
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
              languagePairs={languagePairs}
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

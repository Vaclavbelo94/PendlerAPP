
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Copy, Languages } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LanguageSelector from './components/LanguageSelector';
import TranslationInput from './components/TranslationInput';
import TranslationControls from './components/TranslationControls';

interface TextTranslationProps {
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  sourceLanguage: string;
  setSourceLanguage: (language: string) => void;
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
  autoTranslate: boolean;
  setAutoTranslate: (auto: boolean) => void;
  isTranslating: boolean;
  handleTranslate: () => void;
  handleSwapLanguages: () => void;
  handleTextToSpeech: (text: string, language: string) => void;
  languagePairs: Array<{code: string, name: string}>;
}

const TextTranslation: React.FC<TextTranslationProps> = ({
  sourceText,
  setSourceText,
  translatedText,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  autoTranslate,
  setAutoTranslate,
  isTranslating,
  handleTranslate,
  handleSwapLanguages,
  handleTextToSpeech,
  languagePairs
}) => {
  const handleCopyTranslation = () => {
    if (!translatedText.trim()) return;
    
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Zkopírováno",
      description: "Překlad byl zkopírován do schránky",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          <span>Překlad textu</span>
        </CardTitle>
        <CardDescription>
          Přeložte text mezi češtinou, němčinou, angličtinou a dalšími jazyky
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between">
              <LanguageSelector
                value={sourceLanguage}
                onValueChange={setSourceLanguage}
                id="sourceLanguage"
                languages={languagePairs}
              />
              
              <div className="hidden md:flex items-center self-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={handleSwapLanguages}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <LanguageSelector
                value={targetLanguage}
                onValueChange={setTargetLanguage}
                id="targetLanguage"
                languages={languagePairs}
              />
            </div>
            
            <TranslationInput
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              label="Zdrojový jazyk"
              placeholder="Zadejte text k překladu..."
              onTextToSpeech={() => handleTextToSpeech(sourceText, sourceLanguage)}
              actions={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setSourceText("")}
                >
                  Vymazat
                </Button>
              }
            />
          </div>
          
          <div className="w-full md:w-1/2 space-y-2">
            <TranslationInput
              value={translatedText}
              onChange={() => {}}
              label="Cílový jazyk"
              placeholder="Přeložený text..."
              readOnly={true}
              className="min-h-[200px] resize-none bg-muted/30"
              onTextToSpeech={() => handleTextToSpeech(translatedText, targetLanguage)}
              actions={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={handleCopyTranslation}
                  disabled={!translatedText.trim()}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Kopírovat
                </Button>
              }
            />
          </div>
        </div>
        
        <TranslationControls
          autoTranslate={autoTranslate}
          setAutoTranslate={setAutoTranslate}
          isTranslating={isTranslating}
          onTranslate={handleTranslate}
          onSwapLanguages={handleSwapLanguages}
        />
      </CardContent>
    </Card>
  );
};

export default TextTranslation;

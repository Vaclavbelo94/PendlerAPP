
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Copy, Languages, Volume2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import LanguageSelector from './components/LanguageSelector';

interface MobileTextTranslationProps {
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

const MobileTextTranslation: React.FC<MobileTextTranslationProps> = ({
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Languages className="h-5 w-5" />
          <span>Překlad textu</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Přeložte text mezi jazyky
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-20">
        {/* Language selectors */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <LanguageSelector
              value={sourceLanguage}
              onValueChange={setSourceLanguage}
              id="sourceLanguage"
              languages={languagePairs}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0"
            onClick={handleSwapLanguages}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <LanguageSelector
              value={targetLanguage}
              onValueChange={setTargetLanguage}
              id="targetLanguage"
              languages={languagePairs}
            />
          </div>
        </div>
        
        {/* Source text input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Zdrojový text</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => setSourceText("")}
            >
              Vymazat
            </Button>
          </div>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Zadejte text k překladu..."
            className="min-h-[120px] resize-none text-base"
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleTextToSpeech(sourceText, sourceLanguage)}
            disabled={!sourceText.trim()}
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Přečíst zdrojový text
          </Button>
        </div>
        
        {/* Translated text display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Přeložený text</Label>
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
          </div>
          <div className="min-h-[120px] p-3 border rounded-md bg-muted/30 text-base">
            {isTranslating ? (
              <div className="flex justify-center items-center h-full">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              translatedText || "Zde se zobrazí přeložený text..."
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleTextToSpeech(translatedText, targetLanguage)}
            disabled={!translatedText.trim()}
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Přečíst překlad
          </Button>
        </div>
      </CardContent>
      
      {/* Sticky bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="container max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="auto-translate-mobile"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="auto-translate-mobile" className="text-sm">
                Auto překlad
              </Label>
            </div>
          </div>
          
          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating || !sourceText.trim()}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isTranslating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                Překládám...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-5 w-5" />
                Přeložit
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MobileTextTranslation;

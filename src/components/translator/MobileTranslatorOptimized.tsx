
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Copy, Languages, Volume2, Minimize2, Maximize2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import LanguageSelector from './components/LanguageSelector';
import { useScreenOrientation } from "@/hooks/useScreenOrientation";

interface MobileTranslatorOptimizedProps {
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

export const MobileTranslatorOptimized: React.FC<MobileTranslatorOptimizedProps> = ({
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
  const { isLandscape, isSmallLandscape } = useScreenOrientation();
  const [isCompactMode, setIsCompactMode] = React.useState(false);

  const handleCopyTranslation = useCallback(() => {
    if (!translatedText.trim()) return;
    
    navigator.clipboard.writeText(translatedText).then(() => {
      toast({
        title: "Zkopírováno",
        description: "Překlad byl zkopírován do schránky",
        duration: 2000,
      });
    });
  }, [translatedText]);

  const textareaHeight = useMemo(() => {
    if (isSmallLandscape) return isCompactMode ? "80px" : "100px";
    if (isLandscape) return isCompactMode ? "100px" : "120px";
    return isCompactMode ? "100px" : "120px";
  }, [isLandscape, isSmallLandscape, isCompactMode]);

  const controlsPosition = useMemo(() => {
    return isSmallLandscape ? "fixed bottom-0 left-0 right-0" : "sticky bottom-0";
  }, [isSmallLandscape]);

  return (
    <div className={`h-full flex flex-col ${isSmallLandscape ? 'max-h-screen overflow-hidden' : ''}`}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className={`pb-3 flex-shrink-0 ${isSmallLandscape ? 'py-2' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <CardTitle className={`${isSmallLandscape ? 'text-base' : 'text-lg'}`}>
                Překlad textu
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCompactMode(!isCompactMode)}
              className="p-1"
            >
              {isCompactMode ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
          {!isCompactMode && (
            <CardDescription className={`${isSmallLandscape ? 'text-xs' : 'text-sm'}`}>
              Přeložte text mezi jazyky
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className={`flex-1 space-y-3 overflow-y-auto ${isSmallLandscape ? 'pb-20' : 'pb-24'} ${isSmallLandscape ? 'px-3' : ''}`}>
          {/* Language selectors */}
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <LanguageSelector
                value={sourceLanguage}
                onValueChange={setSourceLanguage}
                id="sourceLanguage"
                languages={languagePairs}
              />
            </div>
            
            <Button 
              variant="outline" 
              size={isSmallLandscape ? "sm" : "icon"}
              className="shrink-0 touch-manipulation min-h-[44px] min-w-[44px]"
              onClick={handleSwapLanguages}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 min-w-0">
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
              <Label className={`font-medium ${isSmallLandscape ? 'text-xs' : 'text-sm'}`}>
                Zdrojový text
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 ${isSmallLandscape ? 'text-xs' : 'text-xs'} touch-manipulation`}
                onClick={() => setSourceText("")}
              >
                Vymazat
              </Button>
            </div>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Zadejte text k překladu..."
              className="resize-none text-base touch-manipulation"
              style={{ height: textareaHeight, fontSize: '16px' }}
            />
            {!isCompactMode && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full touch-manipulation min-h-[44px]"
                onClick={() => handleTextToSpeech(sourceText, sourceLanguage)}
                disabled={!sourceText.trim()}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Přečíst zdrojový text
              </Button>
            )}
          </div>
          
          {/* Translated text display */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className={`font-medium ${isSmallLandscape ? 'text-xs' : 'text-sm'}`}>
                Přeložený text
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 ${isSmallLandscape ? 'text-xs' : 'text-xs'} touch-manipulation`}
                onClick={handleCopyTranslation}
                disabled={!translatedText.trim()}
              >
                <Copy className="h-3 w-3 mr-1" />
                Kopírovat
              </Button>
            </div>
            <div 
              className="p-3 border rounded-md bg-muted/30 text-base overflow-y-auto"
              style={{ height: textareaHeight, fontSize: '16px' }}
            >
              {isTranslating ? (
                <div className="flex justify-center items-center h-full">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                translatedText || "Zde se zobrazí přeložený text..."
              )}
            </div>
            {!isCompactMode && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full touch-manipulation min-h-[44px]"
                onClick={() => handleTextToSpeech(translatedText, targetLanguage)}
                disabled={!translatedText.trim()}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Přečíst překlad
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Optimized bottom controls */}
      <div className={`${controlsPosition} bg-background/95 backdrop-blur-sm border-t p-3 z-50`}>
        <div className="container max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-translate-mobile"
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
              <Label htmlFor="auto-translate-mobile" className={`${isSmallLandscape ? 'text-xs' : 'text-sm'}`}>
                Auto překlad
              </Label>
            </div>
            
            {isCompactMode && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTextToSpeech(sourceText, sourceLanguage)}
                  disabled={!sourceText.trim()}
                  className="p-2"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTextToSpeech(translatedText, targetLanguage)}
                  disabled={!translatedText.trim()}
                  className="p-2"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating || !sourceText.trim()}
            className="w-full min-h-[48px] text-base touch-manipulation"
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
    </div>
  );
};

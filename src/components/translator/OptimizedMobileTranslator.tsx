
import React, { memo, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, Volume2, Copy, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OptimizedMobileTranslatorProps {
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  autoTranslate: boolean;
  setAutoTranslate: (auto: boolean) => void;
  isTranslating: boolean;
  handleTranslate: () => void;
  handleSwapLanguages: () => void;
  handleTextToSpeech: (text: string, lang: string) => void;
  languagePairs: Array<{ code: string; name: string }>;
}

const OptimizedMobileTranslator = memo<OptimizedMobileTranslatorProps>(({
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
  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Zkopírováno",
        description: "Text byl zkopírován do schránky."
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  const handleSpeak = useCallback((text: string, lang: string) => {
    if (text.trim()) {
      handleTextToSpeech(text, lang);
    }
  }, [handleTextToSpeech]);

  const sourceLanguageOption = useMemo(() => 
    languagePairs.find(lang => lang.code === sourceLanguage),
    [languagePairs, sourceLanguage]
  );

  const targetLanguageOption = useMemo(() => 
    languagePairs.find(lang => lang.code === targetLanguage),
    [languagePairs, targetLanguage]
  );

  return (
    <div className="space-y-4 p-4 mobile-translator-container">
      {/* Language Selection */}
      <div className="flex items-center justify-between gap-3 mobile-translator-controls">
        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
          <SelectTrigger className="flex-1 mobile-language-selector">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languagePairs.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleSwapLanguages}
          className="mobile-translator-button"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>

        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
          <SelectTrigger className="flex-1 mobile-language-selector">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languagePairs.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Auto-translate Toggle */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label htmlFor="auto-translate" className="text-sm">
          Automatický překlad
        </Label>
        <Switch
          id="auto-translate"
          checked={autoTranslate}
          onCheckedChange={setAutoTranslate}
        />
      </div>

      {/* Source Text */}
      <Card className="mobile-translator-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">
              {sourceLanguageOption?.name || 'Zdrojový jazyk'}
            </Label>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSpeak(sourceText, sourceLanguage)}
                disabled={!sourceText.trim()}
                className="h-8 w-8 p-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(sourceText)}
                disabled={!sourceText.trim()}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Zadejte text k překladu..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className={cn(
              "mobile-translator-textarea resize-none border-0 focus-visible:ring-0",
              "min-h-[120px] max-h-[200px]"
            )}
          />
        </CardContent>
      </Card>

      {/* Translate Button */}
      {!autoTranslate && (
        <Button 
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isTranslating}
          className="w-full mobile-translator-button"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Překládá se...
            </>
          ) : (
            'Přeložit'
          )}
        </Button>
      )}

      {/* Translated Text */}
      <Card className="mobile-translator-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">
              {targetLanguageOption?.name || 'Cílový jazyk'}
            </Label>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSpeak(translatedText, targetLanguage)}
                disabled={!translatedText.trim()}
                className="h-8 w-8 p-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(translatedText)}
                disabled={!translatedText.trim()}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={cn(
            "mobile-translator-textarea min-h-[120px] max-h-[200px]",
            "p-3 bg-muted/30 rounded-md border text-sm",
            "overflow-y-auto whitespace-pre-wrap"
          )}>
            {isTranslating ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Překládá se...
              </div>
            ) : translatedText || (
              <span className="text-muted-foreground">
                Překlad se zobrazí zde...
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

OptimizedMobileTranslator.displayName = 'OptimizedMobileTranslator';

export default OptimizedMobileTranslator;

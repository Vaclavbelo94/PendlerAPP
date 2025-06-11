
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Trash2, Languages, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAITranslator } from '@/hooks/useAITranslator';
import { toast } from '@/components/ui/use-toast';

interface SimpleAutoTranslatorProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const SimpleAutoTranslator: React.FC<SimpleAutoTranslatorProps> = ({ onTextToSpeech }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect if text is Czech or Polish
  const detectLanguage = (text: string): 'cs' | 'pl' | 'unknown' => {
    const czechChars = /[áčďéěíňóřšťúůýž]/i;
    const polishChars = /[ąćęłńóśźż]/i;
    
    if (czechChars.test(text)) {
      return 'cs';
    } else if (polishChars.test(text)) {
      return 'pl';
    }
    
    // Check for common Czech/Polish words
    const czechWords = /\b(je|jsou|byl|byla|bylo|můj|moje|tento|tato|toto|kde|jak|kdy|proč|ano|ne|děkuji|prosím)\b/i;
    const polishWords = /\b(jest|są|był|była|było|mój|moja|ten|ta|to|gdzie|jak|kiedy|dlaczego|tak|nie|dziękuję|proszę)\b/i;
    
    if (czechWords.test(text)) {
      return 'cs';
    } else if (polishWords.test(text)) {
      return 'pl';
    }
    
    return 'unknown';
  };

  const translateText = async (text: string) => {
    if (!text.trim()) return;

    const language = detectLanguage(text);
    
    if (language === 'unknown') {
      toast({
        variant: "destructive",
        title: "Nepodporovaný jazyk",
        description: "Zadejte prosím text v češtině nebo polštině"
      });
      return;
    }

    setIsTranslating(true);
    setDetectedLanguage(language === 'cs' ? 'Čeština' : 'Polština');

    try {
      const response = await fetch('/api/supabase/functions/v1/ai-translator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Přelož následující ${language === 'cs' ? 'český' : 'polský'} text do němčiny. Vrať pouze překlad bez dalších komentářů: "${text}"`,
          conversationHistory: []
        })
      });

      const data = await response.json();
      
      if (data.response) {
        // Extract just the translation from the AI response
        let translation = data.response;
        
        // Remove formatting if present
        translation = translation.replace(/🔄\s*\*\*Překlad\*\*:\s*/g, '');
        translation = translation.replace(/^.*?:\s*/g, '');
        translation = translation.trim();
        
        setTranslatedText(translation);
      } else {
        throw new Error('Nepodařilo se získat překlad');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Chyba překladu",
        description: "Nepodařilo se přeložit text. Zkuste to prosím znovu."
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = () => {
    translateText(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setDetectedLanguage('');
  };

  const handleCopyTranslation = () => {
    if (!translatedText.trim()) return;
    
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Zkopírováno",
      description: "Překlad byl zkopírován do schránky"
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Automatický překladač CZ/PL → DE
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Napište text v češtině nebo polštině a automaticky se přeloží do němčiny
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Zadejte text (čeština/polština)
            </label>
            {detectedLanguage && (
              <Badge variant="outline" className="text-xs">
                Rozpoznáno: {detectedLanguage}
              </Badge>
            )}
          </div>
          <Textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Zadejte text v češtině nebo polštině..."
            className="min-h-[120px] resize-none"
            disabled={isTranslating}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {isTranslating ? 'Překládám...' : 'Přeložit do němčiny'}
            </Button>
            {onTextToSpeech && inputText.trim() && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onTextToSpeech(inputText, detectedLanguage === 'Čeština' ? 'cs' : 'pl')}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Output Section */}
        {(translatedText || isTranslating) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Překlad (němčina)
            </label>
            <div className="relative">
              <Textarea
                value={isTranslating ? 'Překládám...' : translatedText}
                readOnly
                className="min-h-[120px] resize-none bg-muted/30"
                placeholder="Zde se zobrazí překlad..."
              />
              {translatedText && !isTranslating && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {onTextToSpeech && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTextToSpeech(translatedText, 'de')}
                      className="h-7 w-7 p-0"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyTranslation}
                    className="h-7 px-2 text-xs"
                  >
                    Kopírovat
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clear Button */}
        {(inputText || translatedText) && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isTranslating}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vymazat vše
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Stiskněte Enter pro překlad, Shift+Enter pro nový řádek
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleAutoTranslator;

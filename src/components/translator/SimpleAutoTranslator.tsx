import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Trash2, Languages, Volume2, Mail, ArrowDown, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailDialog } from './EmailDialog';
import { motion } from 'framer-motion';

interface SimpleAutoTranslatorProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const SimpleAutoTranslator: React.FC<SimpleAutoTranslatorProps> = ({ onTextToSpeech }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
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
      const { data, error } = await supabase.functions.invoke('ai-translator', {
        body: {
          message: `Přelož následující ${language === 'cs' ? 'český' : 'polský'} text do němčiny. Vrať pouze překlad bez dalších komentářů: "${text}"`,
          conversationHistory: []
        }
      });

      if (error) throw error;
      
      if (data?.response) {
        // Extract just the translation from the AI response
        let translation = data.response;
        
        // Remove formatting if present
        translation = translation.replace(/🔄\s*\*\*Překlad\*\*:\s*/g, '');
        translation = translation.replace(/^.*?:\s*/g, '');
        translation = translation.trim();
        
        setTranslatedText(translation);
        
        toast({
          title: "Překlad dokončen",
          description: "Text byl úspěšně přeložen do němčiny"
        });
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

  const handleSendEmail = async (email: string) => {
    if (!translatedText.trim()) return;

    setIsSendingEmail(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-translation-email', {
        body: {
          email,
          originalText: inputText,
          translatedText,
          sourceLanguage: detectedLanguage,
          targetLanguage: 'Němčina'
        }
      });

      if (error) throw error;

      toast({
        title: "Email odeslán",
        description: `Překlad byl odeslán na adresu ${email}`
      });
      
      setShowEmailDialog(false);
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        variant: "destructive",
        title: "Chyba odesílání",
        description: "Nepodařilo se odeslat email. Zkuste to prosím znovu."
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Input Section */}
        <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Languages className="h-5 w-5 text-primary" />
              Zadejte text k překladu
              {detectedLanguage && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Rozpoznáno: {detectedLanguage}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napište text v češtině nebo polštině..."
              className="min-h-[120px] resize-none bg-background/50 border-border/50"
              disabled={isTranslating}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                className="flex-1"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                {isTranslating ? 'Překládám...' : 'Přeložit do němčiny'}
              </Button>
              {onTextToSpeech && inputText.trim() && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onTextToSpeech(inputText, detectedLanguage === 'Čeština' ? 'cs' : 'pl')}
                  className="bg-background/50"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Arrow indicator */}
        {(translatedText || isTranslating) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="p-2 rounded-full bg-primary/10 backdrop-blur-sm">
              <ArrowDown className="h-5 w-5 text-primary" />
            </div>
          </motion.div>
        )}

        {/* Output Section */}
        {(translatedText || isTranslating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-green-600" />
                  Překlad do němčiny
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Textarea
                  value={isTranslating ? 'Překládám...' : translatedText}
                  readOnly
                  className="min-h-[120px] resize-none bg-background/50 border-border/50"
                  placeholder="Zde se zobrazí překlad..."
                />
                
                {/* Action buttons moved outside textarea */}
                {translatedText && !isTranslating && (
                  <div className="flex gap-2 justify-end">
                    {onTextToSpeech && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTextToSpeech(translatedText, 'de')}
                        className="bg-background/50"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Přehrát
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyTranslation}
                      className="bg-background/50"
                    >
                      Kopírovat
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main action buttons */}
        {translatedText && !isTranslating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(true)}
              disabled={isSendingEmail}
              className="flex items-center gap-2 bg-card/50 backdrop-blur-sm"
              size="lg"
            >
              <Mail className="h-4 w-4" />
              Odeslat překlad emailem
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isTranslating}
              className="flex items-center gap-2 bg-card/50 backdrop-blur-sm"
              size="lg"
            >
              <Trash2 className="h-4 w-4" />
              Vymazat vše
            </Button>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center mt-6">
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            Stiskněte Enter pro překlad, Shift+Enter pro nový řádek
          </div>
        </div>
      </div>

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSendEmail={handleSendEmail}
        isLoading={isSendingEmail}
      />
    </>
  );
};

export default SimpleAutoTranslator;
